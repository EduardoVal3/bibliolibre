'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useVentas } from '@/hooks/use-ventas';
import { Button } from '@/components/ui/button';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Loader2, RefreshCw, Plus } from 'lucide-react';

export default function VentasPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isFetching } = useVentas({ page, pageSize: 10 });

  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 10) : 1;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Ventas</h1>
          <p className="text-zinc-500 text-sm">Historial de ventas registradas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Link href="/ventas/nueva">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer gap-2">
              <Plus className="w-4 h-4" /> Nueva Venta
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <>
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-zinc-400 py-8">No hay ventas registradas</TableCell>
                  </TableRow>
                ) : (
                  data?.data?.map((v) => (
                    <TableRow key={v.idVenta}>
                      <TableCell className="font-mono text-xs">{v.idVenta}</TableCell>
                      <TableCell>{new Date(v.fechaVenta).toLocaleDateString()}</TableCell>
                      <TableCell>{v.empleado?.persona?.pNombre} {v.empleado?.persona?.pApellido}</TableCell>
                      <TableCell className="text-zinc-500">{v.idUsuario || '—'}</TableCell>
                      <TableCell className="text-right font-semibold">${Number(v.total).toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/ventas/${v.idVenta}`}>
                          <Button variant="ghost" size="sm" className="cursor-pointer">Ver</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="cursor-pointer">Anterior</Button>
              <span className="text-xs text-zinc-500 font-medium">Página {page} de {totalPages}</span>
              <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)} className="cursor-pointer">Siguiente</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
