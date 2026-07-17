'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePresupuestos, usePresupuestoEjecucion } from '@/hooks/use-proveedores';
import { PresupuestoTable } from '@/components/proveedores/PresupuestoTable';
import { PresupuestoProgress } from '@/components/proveedores/PresupuestoProgress';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Plus, ChevronDown, ChevronUp } from 'lucide-react';

function PresupuestoRow({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const { data: ejecucion, isLoading } = usePresupuestoEjecucion(id);

  return (
    <div>
      <div className="flex items-center justify-between px-4 py-2 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 rounded-lg cursor-pointer" onClick={() => setOpen(!open)}>
        <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Ver ejecución</span>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
      </div>
      {open && (
        <div className="px-4 pb-4">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-indigo-500" /> : ejecucion ? <PresupuestoProgress data={ejecucion} /> : null}
        </div>
      )}
    </div>
  );
}

export default function PresupuestosPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isFetching } = usePresupuestos({ page, pageSize: 10 });
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 10) : 1;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Presupuestos</h1>
          <p className="text-zinc-500 text-sm">Gestión de presupuestos anuales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualizar
          </Button>
          <Link href="/presupuestos/nuevo">
            <Button size="sm" className="cursor-pointer gap-2">
              <Plus className="w-4 h-4" /> Nuevo
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <PresupuestoTable presupuestos={data?.data || []} />
            {(data?.data || []).map((p) => <PresupuestoRow key={p.idPresupuesto} id={p.idPresupuesto} />)}
          </div>
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
