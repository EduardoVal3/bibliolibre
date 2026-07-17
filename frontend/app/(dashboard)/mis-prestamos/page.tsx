'use client';

import { useState } from 'react';
import { useMisPrestamos } from '@/hooks/use-prestamos';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, BookOpen } from 'lucide-react';

export default function MisPrestamosPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMisPrestamos({ page, pageSize: 10 });

  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 10) : 1;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Mis Préstamos</h1>
        <p className="text-zinc-500 text-sm">Ejemplares que tienes actualmente en préstamo</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Ejemplar</TableHead>
                  <TableHead className="font-semibold">Libro</TableHead>
                  <TableHead className="font-semibold">Fecha Préstamo</TableHead>
                  <TableHead className="font-semibold">Límite</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!data?.data || data.data.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-zinc-400">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No tienes préstamos activos.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((p) => {
                    const vencido = new Date(p.fechaLimiteDevolucion) < new Date();
                    return (
                      <TableRow key={p.idPrestamo} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                        <TableCell className="font-mono text-xs">
                          {p.detalles?.map((d) => d.edicionVolumen?.codigoBarras).filter(Boolean).join(', ') || `Préstamo #${p.idPrestamo}`}
                        </TableCell>
                        <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                          {p.detalles?.[0]?.edicionVolumen?.libro?.titulo || '-'}
                        </TableCell>
                        <TableCell className="text-xs">{new Date(p.fechaPrestamo).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs">{new Date(p.fechaLimiteDevolucion).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {vencido ? (
                            <Badge variant="destructive" className="text-xs">Vencido</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">Activo</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

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
