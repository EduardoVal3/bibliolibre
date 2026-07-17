'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvento, useUpdateEvento } from '@/hooks/use-eventos';
import { EventoForm } from '@/components/eventos/EventoForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditarEventoPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { data: evento, isLoading } = useEvento(id);
  const { mutate, isPending } = useUpdateEvento();

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!evento) return <div className="text-center py-24 text-zinc-400">Evento no encontrado</div>;

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <Link href="/eventos" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
        <ArrowLeft className="w-4 h-4" /> Volver a eventos
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Editar Evento</h1>
        <p className="text-zinc-500 text-sm">{evento.nombreEvento}</p>
      </div>

      <EventoForm
        initial={evento}
        onSubmit={(data) => mutate({ id, data }, { onSuccess: () => router.push('/eventos') })}
        isPending={isPending}
      />
    </div>
  );
}
