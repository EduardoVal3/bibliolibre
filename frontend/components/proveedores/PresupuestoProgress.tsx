'use client';

import { Progress, ProgressIndicator } from '@/components/ui/progress';
import type { VwPresupuestoEjecutado } from '@/types/proveedores.types';

interface PresupuestoProgressProps {
  data: VwPresupuestoEjecutado;
}

export function PresupuestoProgress({ data }: PresupuestoProgressProps) {
  const pct = data.montoAsignado > 0 ? (data.montoEjecutado / data.montoAsignado) * 100 : 0;
  const color = pct > 90 ? 'bg-rose-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-zinc-500">Ejecutado</span>
        <span className="font-mono font-medium text-zinc-700 dark:text-zinc-200">
          ${Number(data.montoEjecutado).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          {' / '}
          ${Number(data.montoAsignado).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
        </span>
      </div>
      <Progress value={pct} className="h-2">
        <ProgressIndicator className={color} />
      </Progress>
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{pct.toFixed(1)}% ejecutado</span>
        <span>Disponible: ${Number(data.montoDisponible).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}
