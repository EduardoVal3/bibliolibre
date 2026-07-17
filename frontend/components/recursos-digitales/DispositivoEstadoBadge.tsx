'use client';

import { cn } from '@/lib/utils';

interface DispositivoEstadoBadgeProps {
  estado?: string;
}

export function DispositivoEstadoBadge({ estado }: DispositivoEstadoBadgeProps) {
  const colorMap: Record<string, string> = {
    Disponible: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
    Prestado: 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
    Mantenimiento: 'bg-rose-100 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400',
    Perdido: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  };

  return (
    <span className={cn(
      'text-xs font-medium px-2 py-0.5 rounded-full',
      colorMap[estado || ''] || 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    )}>
      {estado || 'Desconocido'}
    </span>
  );
}
