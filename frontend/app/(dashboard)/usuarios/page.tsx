'use client';

import { useState } from 'react';
import { useUsuarios } from '@/hooks/use-usuarios';
import { UsuarioTable } from '@/components/usuarios/UsuarioTable';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';

export default function UsuariosPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isFetching } = useUsuarios({ page, pageSize: 10 });

  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 10) : 1;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Usuarios</h1>
          <p className="text-zinc-500 text-sm">Gestión de usuarios registrados en el sistema</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          <UsuarioTable usuarios={data?.data || []} />
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="cursor-pointer">
                Anterior
              </Button>
              <span className="text-xs text-zinc-500 font-medium">
                Página {page} de {totalPages}
              </span>
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
