import { Badge } from '@/components/ui/badge';

interface CupoBadgeProps {
  inscritos?: number;
  capacidadMaxima?: number;
}

export function CupoBadge({ inscritos = 0, capacidadMaxima }: CupoBadgeProps) {
  if (!capacidadMaxima) return <Badge variant="secondary" className="text-xs">Sin límite</Badge>;

  const disponible = capacidadMaxima - inscritos;
  const lleno = disponible <= 0;
  const casiLleno = disponible <= Math.max(1, Math.floor(capacidadMaxima * 0.2));

  return (
    <Badge
      variant={lleno ? 'destructive' : casiLleno ? 'secondary' : 'outline'}
      className={casiLleno && !lleno ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-200' : ''}
    >
      {lleno ? 'Completo' : `${disponible} cupo${disponible !== 1 ? 's' : ''}`}
    </Badge>
  );
}
