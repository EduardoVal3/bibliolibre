import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CupoBadge } from './CupoBadge';
import { Calendar, MapPin } from 'lucide-react';
import Link from 'next/link';
import type { Evento } from '@/types/eventos.types';

interface EventoCardProps {
  evento: Evento & { inscritos?: number; cuposDisponibles?: number };
}

export function EventoCard({ evento }: EventoCardProps) {
  const pasada = new Date(evento.fechaEvento) < new Date(new Date().toDateString());

  return (
    <Card className={pasada ? 'opacity-70' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{evento.nombreEvento}</CardTitle>
          {pasada && <Badge variant="secondary" className="shrink-0 text-xs">Finalizado</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(evento.fechaEvento).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        {evento.lugar && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {evento.lugar}
          </div>
        )}
        {evento.descripcion && (
          <p className="line-clamp-2 text-xs mt-1">{evento.descripcion}</p>
        )}
        <div className="pt-2">
          <CupoBadge inscritos={evento.inscritos} capacidadMaxima={evento.capacidadMaxima} />
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={`/eventos/${evento.idEvento}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          Ver detalles →
        </Link>
      </CardFooter>
    </Card>
  );
}
