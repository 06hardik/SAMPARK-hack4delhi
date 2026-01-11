import { Violation } from '@/types/parking';
import { StatusBadge } from './StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ChevronRight, FileText } from 'lucide-react';

interface ViolationsTableProps {
  violations: Violation[];
  onViolationClick?: (violationId: string) => void;
  compact?: boolean;
  className?: string;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ViolationsTable({ 
  violations, 
  onViolationClick, 
  compact = false,
  className 
}: ViolationsTableProps) {
  if (violations.length === 0) {
    return (
      <div className={cn('rounded border bg-white p-6 text-center', className)}>
        <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <p className="text-base text-muted-foreground">No violations found</p>
      </div>
    );
  }

  return (
    <div className={cn('rounded border bg-white overflow-x-auto', className)}>
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">Lot</TableHead>
            <TableHead className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">Started</TableHead>
            <TableHead className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground text-center whitespace-nowrap">Duration</TableHead>
            <TableHead className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground text-center whitespace-nowrap">Max Excess</TableHead>
            <TableHead className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground text-right whitespace-nowrap">Penalty</TableHead>
            <TableHead className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground text-center whitespace-nowrap">Status</TableHead>
            {!compact && (
              <TableHead className="text-xs md:text-sm font-semibold uppercase tracking-wide text-muted-foreground text-center whitespace-nowrap">
                Evidence
              </TableHead>
            )}
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {violations.map((violation) => (
            <TableRow
              key={violation.id}
              className={cn(
                'cursor-pointer transition-colors',
                violation.status === 'active' && 'bg-status-violating/5 hover:bg-status-violating/10'
              )}
              onClick={() => onViolationClick?.(violation.id)}
            >
              <TableCell className="text-sm md:text-base font-medium max-w-[160px] md:max-w-[240px] truncate">
                {violation.lotName}
              </TableCell>

              <TableCell className="text-sm md:text-base whitespace-nowrap">
                {format(violation.startedAt, 'MMM d, HH:mm')}
              </TableCell>

              <TableCell className="text-center text-sm md:text-base whitespace-nowrap">
                {violation.status === 'active' ? (
                  <span className="text-status-violating font-medium">
                    {formatDuration(
                      Math.floor((Date.now() - violation.startedAt.getTime()) / 60000)
                    )}
                  </span>
                ) : (
                  formatDuration(violation.durationMinutes)
                )}
              </TableCell>

              <TableCell className="text-center whitespace-nowrap">
                <span className="text-sm md:text-base font-medium text-status-violating">
                  +{violation.maxExcess}
                </span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({violation.peakCount}/{violation.allowedCapacity})
                </span>
              </TableCell>

              <TableCell className="text-right text-sm md:text-base font-medium whitespace-nowrap">
                {violation.status === 'active' ? (
                  <span className="text-muted-foreground">Calculating...</span>
                ) : (
                  formatCurrency(violation.penaltyAmount)
                )}
              </TableCell>

              <TableCell className="text-center">
                <StatusBadge 
                  status={violation.status === 'active' ? 'violating' : 'compliant'} 
                  size="sm"
                />
              </TableCell>

              {!compact && (
                <TableCell className="text-center">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {violation.evidence.length} items
                  </span>
                </TableCell>
              )}

              <TableCell>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
