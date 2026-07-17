'use client';

import { useParams } from 'next/navigation';
import { useEvento, useCupo } from '@/hooks/use-eventos';
import { InscripcionButton } from '@/components/eventos/InscripcionButton';
import { CupoBadge } from '@/components/eventos/CupoBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getStoredUser } from '@/lib/auth/auth';

export default function EventoDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: evento, isLoading } = useEvento(id);
  const { data: cupo } = useCupo(id);
  const user = getStoredUser();

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!evento) return <div className="text-center py-24 text-zinc-400">Evento no encontrado</div>;

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <Link href="/eventos" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
        <ArrowLeft className="w-4 h-4" /> Volver a eventos
      </Link>

      <Card>
        <CardContent className="p-6 space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{evento.nombreEvento}</h1>

          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <Calendar className="w-4 h-4" />
            {new Date(evento.fechaEvento).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          {evento.lugar && (
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
              <MapPin className="w-4 h-4" />
              {evento.lugar}
            </div>
          )}

          {evento.descripcion && (
            <p className="text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">{evento.descripcion}</p>
          )}

          <div className="pt-2">
            <CupoBadge inscritos={cupo?.inscritos} capacidadMaxima={cupo?.capacidadMaxima ?? evento.capacidadMaxima} />
            {cupo && <span className="ml-2 text-xs text-zinc-400">{cupo.inscritos} inscrito{cupo.inscritos !== 1 ? 's' : ''}</span>}
          </div>

          {user && (
            <div className="pt-2">
              <InscripcionButton
                idEvento={evento.idEvento}
                lleno={(cupo?.cuposDisponibles ?? 1) <= 0}
                inscrito={false}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {user && (
        <div className="flex gap-2">
          <Link href={`/eventos/${evento.idEvento}/asistencia`}>
            <Button variant="outline" className="cursor-pointer gap-2">
              Gestionar asistencia
            </Button>
          </Link>
          <Link href={`/eventos/editar/${evento.idEvento}`}>
            <Button variant="outline" className="cursor-pointer">Editar evento</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
