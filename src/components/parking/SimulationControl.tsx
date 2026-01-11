import { SimulationState, SimulationScenario } from '@/types/parking';
import { scenarioConfigs } from '@/data/seedData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Play, Square, Zap, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface SimulationControlProps {
  state: SimulationState;
  onStart: (scenario: SimulationScenario) => void;
  onStop: () => void;
  isLoading?: boolean;
  className?: string;
}

export function SimulationControl({ 
  state, 
  onStart, 
  onStop, 
  isLoading = false,
  className 
}: SimulationControlProps) {
  return (
    <div className={cn('rounded border bg-white p-4 space-y-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Zap className="h-5 w-5 text-primary flex-shrink-0" />
          <h3 className="font-semibold text-sm md:text-base truncate">Simulation Control</h3>
        </div>
        
        {state.isRunning && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-status-compliant" />
            </span>
            <span className="text-xs md:text-sm text-status-compliant font-medium">Running</span>
          </div>
        )}
      </div>
      
      {state.isRunning ? (
        <div className="space-y-4">
          <div className="rounded bg-muted p-3 space-y-2">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Scenario</span>
              <span className="font-medium truncate">
                {scenarioConfigs.find(s => s.id === state.scenario)?.name}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Started</span>
              <span>
                {state.startedAt && format(state.startedAt, 'HH:mm:ss')}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Events</span>
              <span className="flex items-center gap-1 font-medium">
                <Activity className="h-4 w-4" />
                {state.eventsGenerated}
              </span>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            onClick={onStop}
            disabled={isLoading}
            className="w-full h-10 text-sm"
          >
            <Square className="h-4 w-4 mr-2" />
            Stop Simulation
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Start Rush Hour simulation to test high traffic patterns:
          </p>
          
          <Button
            variant="default"
            onClick={() => onStart('rush_hour')}
            disabled={isLoading}
            className="w-full h-10 text-sm"
          >
            <Play className="h-4 w-4 mr-2" />
            Start Simulation
          </Button>
        </div>
      )}
    </div>
  );
}
