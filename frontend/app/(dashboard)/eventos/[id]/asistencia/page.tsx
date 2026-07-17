'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useEvento } from '@/hooks/use-eventos';
import { eventosApi } from '@/lib/api/eventos.api';
import { AsistenciaTable } from '@/components/eventos/AsistenciaTable';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStoredUser } from '@/lib/auth/auth';

export default function AsistenciaPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { data: evento, isLoading: loadingEvento } = useEvento(id);
  const user = getStoredUser();

  const { data: asistencias, isLoading: loadingAsis } = useQuery({
    queryKey: ['eventos', id, 'asistencias'],
    queryFn: () => eventosApi.getAsistencias(id),
    enabled: !!id,
  });

  if (loadingEvento) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!evento) return <div className="text-center py-24 text-zinc-400">Evento no encontrado</div>;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <Link href={`/eventos/${id}`} className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
        <ArrowLeft className="w-4 h-4" /> Volver al evento
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Asistencia</h1>
          <p className="text-zinc-500 text-sm">{evento.nombreEvento}</p>
        </div>
      </div>

      {loadingAsis ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
      ) : (
        <AsistenciaTable asistencias={asistencias || []} />
      )}
    </div>
  );
}
