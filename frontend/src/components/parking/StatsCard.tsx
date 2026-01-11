import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: 'border-border bg-white',
  success: 'border-status-compliant/30 bg-white',
  warning: 'border-status-compliant/30 bg-white',
  danger: 'border-status-violating/30 bg-white',
};

const iconVariantStyles = {
  default: 'text-primary bg-muted',
  success: 'text-status-compliant bg-status-compliant/10',
  warning: 'text-status-compliant bg-status-compliant/10',
  danger: 'text-status-violating bg-status-violating/10',
};

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  className 
}: StatsCardProps) {
  return (
    <div className={cn(
      'rounded border p-4 transition-colors min-w-0',
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0 flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
            {title}
          </p>
          <p className="text-xl md:text-2xl font-semibold text-foreground truncate">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
        
        {Icon && (
          <div className={cn(
            'p-2 rounded flex-shrink-0',
            iconVariantStyles[variant]
          )}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      
      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-sm flex-wrap">
          <span className={cn(
            'font-medium',
            trend.isPositive ? 'text-status-compliant' : 'text-status-violating'
          )}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">vs last period</span>
        </div>
      )}
    </div>
  );
}
