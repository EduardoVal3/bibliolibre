'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useOrdenesCompra } from '@/hooks/use-proveedores';
import { OrdenCompraTable } from '@/components/proveedores/OrdenCompraTable';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Plus } from 'lucide-react';

export default function OrdenesCompraPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isFetching } = useOrdenesCompra({ page, pageSize: 10 });
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 10) : 1;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Órdenes de Compra</h1>
          <p className="text-zinc-500 text-sm">Gestión de órdenes de compra a proveedores</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualizar
          </Button>
          <Link href="/ordenes-compra/nuevo">
            <Button size="sm" className="cursor-pointer gap-2">
              <Plus className="w-4 h-4" /> Nueva
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <>
          <OrdenCompraTable ordenes={data?.data || []} />
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
