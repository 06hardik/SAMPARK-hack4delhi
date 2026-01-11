import { 
  ParkingLotWithStatus, 
  Violation, 
  ChronicOffender, 
  AggregateStats, 
  ViolationHeatmapData,
  SimulationState,
  SimulationScenario,
  CountHistoryPoint
} from '@/types/parking';
import { 
  getLotsWithStatus, 
  violations as seedViolations, 
  chronicOffenders, 
  aggregateStats, 
  heatmapData,
  parkingLots as seedLots
} from '@/data/seedData';

// ----------------------
// Internal mutable state
// ----------------------

let simulationState: SimulationState = {
  isRunning: false,
  scenario: null,
  startedAt: null,
  eventsGenerated: 0,
};

let simulatedLots = seedLots.map(l => ({ ...l }));
let simulatedViolations = seedViolations.map(v => ({ ...v }));

let tickTimer: ReturnType<typeof setInterval> | null = null;

// ----------------------
// Helpers
// ----------------------

const resetData = () => {
  simulatedLots = seedLots.map(l => ({ ...l }));
  simulatedViolations = seedViolations.map(v => ({ ...v }));
};

const generateHistory = (lot: typeof simulatedLots[number], status: 'compliant' | 'violating'): CountHistoryPoint[] => {
  const points: CountHistoryPoint[] = [];
  const base = status === 'violating' ? lot.allowedCapacity * 1.1 : lot.allowedCapacity * 0.7;

  for (let i = 24; i >= 0; i--) {
    const variance = Math.random() * 0.2 - 0.1;
    points.push({
      timestamp: new Date(Date.now() - i * 60 * 60 * 1000),
      count: Math.max(0, Math.round(base * (1 + variance))),
    });
  }
  return points;
};

// ----------------------
// Tick engine
// ----------------------

const tick = () => {
  if (!simulationState.isRunning) return;

  simulationState.eventsGenerated++;

  simulatedLots = simulatedLots.map(lot => {
    const delta = Math.floor(Math.random() * 11) - 3; // biased upward
    let newCount = Math.max(0, lot.currentCount + delta);

    const activeViolation = simulatedViolations.find(v => v.lotId === lot.id && v.status === 'active');

    if (newCount > lot.allowedCapacity) {
      if (!activeViolation) {
        simulatedViolations.push({
          id: `sim-${Date.now()}-${lot.id}`,
          lotId: lot.id,
          lotName: lot.name,
          contractor: lot.contractor,
          startedAt: new Date(),
          endedAt: null,
          maxExcess: newCount - lot.allowedCapacity,
          allowedCapacity: lot.allowedCapacity,
          peakCount: newCount,
          durationMinutes: 0,
          penaltyAmount: 0,
          ruleVersion: 'sim',
          status: 'active',
          evidence: [],
        });
      } else {
        const excess = newCount - lot.allowedCapacity;
        if (excess > activeViolation.maxExcess) {
          activeViolation.maxExcess = excess;
          activeViolation.peakCount = newCount;
        }
        activeViolation.durationMinutes = Math.floor(
          (Date.now() - activeViolation.startedAt.getTime()) / 60000
        );
      }
    } else if (activeViolation) {
      activeViolation.status = 'resolved';
      activeViolation.endedAt = new Date();
      activeViolation.durationMinutes = Math.floor(
        (Date.now() - activeViolation.startedAt.getTime()) / 60000
      );
      activeViolation.penaltyAmount = Math.round(
        activeViolation.maxExcess * (activeViolation.durationMinutes / 60) * lot.penaltyRatePerHour
      );
    }

    return { ...lot, currentCount: newCount, updatedAt: new Date() };
  });
};

// ----------------------
// Public API
// ----------------------

export const parkingService = {
  async getLots(): Promise<ParkingLotWithStatus[]> {
    await new Promise(r => setTimeout(r, 50));

    const source = simulationState.isRunning ? simulatedLots : seedLots;

    return source.map(lot => {
      const utilization = (lot.currentCount / lot.allowedCapacity) * 100;
      const activeViolation = simulatedViolations.find(v => v.lotId === lot.id && v.status === 'active');
      const status = activeViolation || lot.currentCount > lot.allowedCapacity ? 'violating' : 'compliant';

      return {
        ...lot,
        utilization,
        status,
        activeViolation: activeViolation
          ? {
              id: activeViolation.id,
              lotId: lot.id,
              startedAt: activeViolation.startedAt,
              maxExcess: activeViolation.maxExcess,
              currentExcess: Math.max(0, lot.currentCount - lot.allowedCapacity),
              durationMinutes: activeViolation.durationMinutes,
            }
          : undefined,
        countHistory: generateHistory(lot, status),
      };
    });
  },

  async getViolations(filter?: { status?: 'active' | 'resolved'; lotId?: string }): Promise<Violation[]> {
    await new Promise(r => setTimeout(r, 50));

    let data = simulationState.isRunning ? simulatedViolations : seedViolations;

    if (filter?.status) data = data.filter(v => v.status === filter.status);
    if (filter?.lotId) data = data.filter(v => v.lotId === filter.lotId);

    return data.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime());
  },

  async getViolation(id: string): Promise<Violation | null> {
    await new Promise(r => setTimeout(r, 50));
    return (simulationState.isRunning ? simulatedViolations : seedViolations).find(v => v.id === id) || null;
  },

  async getChronicOffenders(): Promise<ChronicOffender[]> {
    return chronicOffenders;
  },

  async getAggregateStats(): Promise<AggregateStats> {
    if (!simulationState.isRunning) return aggregateStats;

    const activeCount = simulatedViolations.filter(v => v.status === 'active').length;
    const lotsStatus = simulatedLots.map(l => (l.currentCount > l.allowedCapacity ? 'violating' : 'compliant'));

    return {
      ...aggregateStats,
      activeViolations: activeCount,
      lotsViolating: lotsStatus.filter(s => s === 'violating').length,
      lotsInCompliance: lotsStatus.filter(s => s === 'compliant').length,
    };
  },

  async getHeatmapData(): Promise<ViolationHeatmapData[]> {
    return heatmapData;
  },

  getSimulationState(): SimulationState {
    return { ...simulationState };
  },

  async startSimulation(scenario: SimulationScenario): Promise<SimulationState> {
    resetData();

    simulationState = {
      isRunning: true,
      scenario,
      startedAt: new Date(),
      eventsGenerated: 0,
    };

    simulatedLots = simulatedLots.map(l => ({
      ...l,
      currentCount: Math.round(l.allowedCapacity * (0.9 + Math.random() * 0.3)),
    }));

    tickTimer && clearInterval(tickTimer);
    tickTimer = setInterval(tick, 10000); // every 10 seconds

    return { ...simulationState };
  },

  async stopSimulation(): Promise<SimulationState> {
    tickTimer && clearInterval(tickTimer);
    tickTimer = null;

    simulationState = {
      isRunning: false,
      scenario: null,
      startedAt: null,
      eventsGenerated: 0,
    };

    resetData();

    return { ...simulationState };
  },

  simulateTick: async () => tick(), // still callable manually
};
