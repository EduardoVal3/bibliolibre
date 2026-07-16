import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DisponibilidadBadgeProps {
  disponibilidad?: string;
  className?: string;
}

export function DisponibilidadBadge({ disponibilidad, className }: DisponibilidadBadgeProps) {
  const disp = disponibilidad || 'Disponible';
  const lowercaseDisp = disp.toLowerCase();

  let badgeStyles = 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300';
  let dotColor = 'bg-zinc-400';
  let showDot = true;

  if (lowercaseDisp === 'disponible') {
    badgeStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50';
    dotColor = 'bg-emerald-500';
  } else if (lowercaseDisp === 'prestado') {
    badgeStyles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
    dotColor = 'bg-amber-500';
  } else if (lowercaseDisp === 'mantenimiento') {
    badgeStyles = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50';
    dotColor = 'bg-indigo-500';
  } else if (lowercaseDisp === 'perdido' || lowercaseDisp === 'malo') {
    badgeStyles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50';
    dotColor = 'bg-rose-500';
  } else {
    showDot = false;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'px-2.5 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1.5 w-fit select-none',
        badgeStyles,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {lowercaseDisp === 'disponible' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={cn('relative inline-flex rounded-full h-2 w-2', dotColor)}></span>
        </span>
      )}
      {disp}
    </Badge>
  );
}
