import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart3, 
  Zap,
  Car,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/violations', icon: AlertTriangle, label: 'Violations' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/simulation', icon: Zap, label: 'Simulation' },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  return (
    <aside
      className={cn(
        'min-h-screen bg-white border-r border-border flex flex-col transition-all duration-200 relative z-50',
        isCollapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo Header */}
      <div
        className={cn(
          'min-h-16 flex items-center border-b border-border px-4',
          isCollapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <div className="flex items-center justify-center w-9 h-9 rounded bg-primary flex-shrink-0">
          <Car className="h-5 w-5 text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-semibold text-base text-foreground truncate">SAMPARK</span>
            <span className="text-xs text-muted-foreground truncate">MCD Capacity Monitor</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-md text-base transition-colors',
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-muted',
                isCollapsed && 'justify-center px-3'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-border hidden md:block">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'w-full text-muted-foreground hover:text-foreground hover:bg-muted h-9 text-sm',
            isCollapsed && 'justify-center px-0'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
