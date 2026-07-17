'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRecursos } from '@/hooks/use-recursos-digitales';
import { RecursoCard } from '@/components/recursos-digitales/RecursoCard';
import { RecursoDigitalTable } from '@/components/recursos-digitales/RecursoDigitalTable';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Plus, LayoutGrid, List } from 'lucide-react';

export default function BibliotecaDigitalPage() {
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const { data, isLoading, refetch, isFetching } = useRecursos({ page, pageSize: 12 });
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 12) : 1;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Biblioteca Digital</h1>
          <p className="text-zinc-500 text-sm">Recursos digitales disponibles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setView(view === 'grid' ? 'table' : 'grid')} className="cursor-pointer">
            {view === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualizar
          </Button>
          <Link href="/biblioteca-digital/nuevo">
            <Button size="sm" className="cursor-pointer gap-2"><Plus className="w-4 h-4" /> Nuevo</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(data?.data || []).map((r) => <RecursoCard key={r.idRecurso} recurso={r} />)}
            </div>
          ) : (
            <RecursoDigitalTable recursos={data?.data || []} />
          )}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="cursor-pointer">Anterior</Button>
              <span className="text-xs text-zinc-500 font-medium">Página {page} de {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="cursor-pointer">Siguiente</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
