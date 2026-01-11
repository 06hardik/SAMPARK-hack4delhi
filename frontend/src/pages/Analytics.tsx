import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { OffendersTable } from '@/components/parking/OffendersTable';
import { ViolationHeatmap } from '@/components/parking/ViolationHeatmap';
import { StatsCard } from '@/components/parking/StatsCard';
import { ViolationsTable } from '@/components/parking/ViolationsTable';
import { PollingIndicator } from '@/components/parking/PollingIndicator';
import { usePolling } from '@/hooks/usePolling';
import { parkingService } from '@/services/parkingService';
import { 
  ChronicOffender, 
  ViolationHeatmapData, 
  AggregateStats,
  Violation 
} from '@/types/parking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  Calendar, 
  IndianRupee, 
  AlertTriangle,
  BarChart3,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['hsl(210, 70%, 35%)', 'hsl(145, 55%, 38%)', 'hsl(40, 70%, 50%)', 'hsl(0, 60%, 50%)', 'hsl(280, 40%, 45%)'];

export default function Analytics() {
  const navigate = useNavigate();

  const { data: offenders, isLoading: offendersLoading } = usePolling<ChronicOffender[]>({
    fetcher: parkingService.getChronicOffenders,
    interval: 30000,
  });

  const { data: heatmapData, isLoading: heatmapLoading } = usePolling<ViolationHeatmapData[]>({
    fetcher: parkingService.getHeatmapData,
    interval: 30000,
  });

  const { data: stats, isLoading: statsLoading, lastUpdated } = usePolling<AggregateStats>({
    fetcher: parkingService.getAggregateStats,
    interval: 10000,
  });

  const { data: violations } = usePolling<Violation[]>({
    fetcher: () => parkingService.getViolations({ status: 'resolved' }),
    interval: 30000,
  });

  const lotChartData = violations?.reduce((acc, v) => {
    const lotName = v.lotName.split('—')[1]?.trim().split(',')[0] || v.lotName.substring(0, 15);
    const existing = acc.find(item => item.name === lotName);
    if (existing) {
      existing.violations++;
      existing.penalties += v.penaltyAmount;
    } else {
      acc.push({ name: lotName, violations: 1, penalties: v.penaltyAmount });
    }
    return acc;
  }, [] as { name: string; violations: number; penalties: number }[]) || [];

  const pieData = lotChartData.map(l => ({
    name: l.name,
    value: l.penalties,
  }));

  return (
    <DashboardLayout>
      <Header 
        title="Analytics" 
        subtitle="Violation patterns and parking lot performance"
        actions={
          <PollingIndicator 
            lastUpdated={lastUpdated} 
            isLoading={statsLoading}
            interval={10000}
          />
        }
      />
      
      <div className="p-5 md:p-7 space-y-6 md:space-y-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          {statsLoading || !stats ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 md:h-28" />
              ))}
            </>
          ) : (
            <>
              <StatsCard title="Today" value={stats.violationsToday} icon={AlertTriangle} variant={stats.violationsToday > 0 ? 'danger' : 'success'} />
              <StatsCard title="This Week" value={stats.violationsThisWeek} icon={Calendar} />
              <StatsCard title="This Month" value={stats.violationsThisMonth} icon={TrendingUp} />
              <StatsCard title="Total Penalties" value={`₹${stats.totalPenaltiesAssessed.toLocaleString('en-IN')}`} icon={IndianRupee} />
            </>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-7">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <BarChart3 className="h-5 w-5" /> Violations by Lot
              </CardTitle>
            </CardHeader>
            <CardContent>
              {offendersLoading ? <Skeleton className="h-56" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={lotChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 10%, 88%)" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" height={50} />
                    <YAxis tick={{ fontSize: 10 }} width={36} />
                    <Tooltip contentStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="violations" fill="hsl(210, 70%, 35%)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <IndianRupee className="h-5 w-5" /> Penalty Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {offendersLoading ? <Skeleton className="h-56" /> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={1} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Penalties']} contentStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {pieData.map((e, i) => (
                  <div key={e.name} className="flex items-center gap-1.5 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="truncate max-w-[90px]">{e.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base md:text-lg">
              <Clock className="h-5 w-5" /> Violation Frequency by Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {heatmapLoading || !heatmapData ? <Skeleton className="h-56" /> : <ViolationHeatmap data={heatmapData} />}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5" /> Violation Summary
          </h2>
          {offendersLoading || !offenders ? <Skeleton className="h-56" /> : <OffendersTable offenders={offenders} />}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Recent Resolved Violations</h2>
          {!violations ? <Skeleton className="h-56" /> : (
            <ViolationsTable 
              violations={violations.slice(0, 5)} 
              onViolationClick={(id) => navigate(`/violations/${id}`)}
              compact
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
