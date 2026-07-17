'use client';

import { useRouter } from 'next/navigation';
import { useCreateEvento } from '@/hooks/use-eventos';
import { EventoForm } from '@/components/eventos/EventoForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NuevoEventoPage() {
  const router = useRouter();
  const { mutate, isPending } = useCreateEvento();

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <Link href="/eventos" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
        <ArrowLeft className="w-4 h-4" /> Volver a eventos
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Nuevo Evento</h1>
        <p className="text-zinc-500 text-sm">Crea un nuevo evento en la biblioteca</p>
      </div>

      <EventoForm
        onSubmit={(data) => mutate(data, { onSuccess: () => router.push('/eventos') })}
        isPending={isPending}
      />
    </div>
  );
}
