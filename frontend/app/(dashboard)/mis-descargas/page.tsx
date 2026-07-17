'use client';

import { useState } from 'react';
import { useRecursos } from '@/hooks/use-recursos-digitales';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MisDescargasPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isFetching } = useRecursos({ page, pageSize: 20 });
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 20) : 1;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Mis Descargas</h1>
          <p className="text-zinc-500 text-sm">Historial de accesos a recursos digitales</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualizar
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Recurso</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Formato</TableHead>
                  <TableHead className="font-semibold text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.data || []).length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-zinc-400">No hay recursos disponibles.</TableCell></TableRow>
                ) : (
                  (data?.data || []).map((r) => (
                    <TableRow key={r.idRecurso} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">{r.titulo}</TableCell>
                      <TableCell className="text-zinc-600 dark:text-zinc-300">{r.tipoRecurso || '—'}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{r.formato || '—'}</Badge></TableCell>
                      <TableCell className="text-right">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.urlAcceso ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500'}`}>
                          {r.urlAcceso ? 'Disponible' : 'Sin acceso'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
