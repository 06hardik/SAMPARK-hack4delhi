import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bell, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function Header({ title, subtitle, actions, className }: HeaderProps) {
  return (
    <header
      className={cn(
        'min-h-16 border-b border-border bg-white flex items-center justify-between px-5 md:px-7 py-2.5',
        className
      )}
    >
      <div className="min-w-0 flex-1 pl-10 md:pl-0">
        <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">{title}</h1>
        {subtitle && (
          <p className="text-sm md:text-base text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        {actions}

        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground h-9 w-9 md:h-10 md:w-10"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-status-violating text-[11px] font-medium flex items-center justify-center text-white">
            3
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-9 w-9 md:h-10 md:w-10"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
