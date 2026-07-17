'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useEventos } from '@/hooks/use-eventos';
import { EventoCard } from '@/components/eventos/EventoCard';
import { EventoTable } from '@/components/eventos/EventoTable';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Plus, Grid3X3, List } from 'lucide-react';
import { getStoredUser } from '@/lib/auth/auth';

export default function EventosPage() {
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const { data, isLoading, refetch, isFetching } = useEventos({ page, pageSize: 12 });
  const user = getStoredUser();

  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 12) : 1;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Eventos</h1>
          <p className="text-zinc-500 text-sm">Explora y regístrate en eventos de la biblioteca</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={() => setView(view === 'grid' ? 'table' : 'grid')} className="cursor-pointer">
            {view === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </Button>
          {user && (
            <Link href="/eventos/nuevo">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium border-0 cursor-pointer gap-2">
                <Plus className="w-4 h-4" />
                Nuevo Evento
              </Button>
            </Link>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.data?.map((e) => (
                <EventoCard key={e.idEvento} evento={e} />
              ))}
              {data?.data?.length === 0 && (
                <div className="col-span-full text-center py-16 text-zinc-400">No hay eventos disponibles</div>
              )}
            </div>
          ) : (
            <EventoTable eventos={data?.data || []} />
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="cursor-pointer">
                Anterior
              </Button>
              <span className="text-xs text-zinc-500 font-medium">Página {page} de {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="cursor-pointer">
                Siguiente
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
