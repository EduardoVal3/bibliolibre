import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MembresiaBadgeProps {
  nombre: string;
  vence: string;
  className?: string;
}

export function MembresiaBadge({ nombre, vence, className }: MembresiaBadgeProps) {
  if (!nombre) return <span className="text-xs text-zinc-400">Sin membresía</span>;

  const isExpired = vence && new Date(vence) < new Date();
  const lower = nombre.toLowerCase();

  const colorMap: Record<string, string> = {
    gratuita: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
    premium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    institucional: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400',
  };

  const style = Object.entries(colorMap).find(([k]) => lower.includes(k))?.[1] || colorMap.gratuita;

  return (
    <Badge variant="outline" className={cn('px-2 py-0.5 text-xs font-medium rounded-full', style, isExpired && 'opacity-50', className)}>
      {nombre}
      {vence && (
        <span className="ml-1 opacity-60">
          {isExpired ? '(vencida)' : `hasta ${new Date(vence).toLocaleDateString()}`}
        </span>
      )}
    </Badge>
  );
}
