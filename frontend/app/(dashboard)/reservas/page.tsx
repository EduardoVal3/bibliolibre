'use client';

import { useState } from 'react';
import { useReservas, useCancelReserva } from '@/hooks/use-prestamos';
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
import { Loader2, RefreshCw, Trash } from 'lucide-react';

export default function ReservasPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch, isFetching } = useReservas({ page, pageSize: 10 });
  const cancelReserva = useCancelReserva();
  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 10) : 1;

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Reservas</h1>
          <p className="text-zinc-500 text-sm">Todas las reservas del sistema</p>
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
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Usuario</TableHead>
                  <TableHead className="font-semibold">Ejemplar</TableHead>
                  <TableHead className="font-semibold">Libro</TableHead>
                  <TableHead className="font-semibold">Fecha</TableHead>
                  <TableHead className="font-semibold">Estado</TableHead>
                  <TableHead className="font-semibold text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!data?.data || data.data.length === 0) ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-zinc-400">
                      No hay reservas registradas.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((r) => (
                    <TableRow key={r.idReserva} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                        {r.usuario?.persona
                          ? `${r.usuario.persona.pNombre} ${r.usuario.persona.pApellido}`
                          : `Usuario #${r.idUsuario}`}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.edicionVolumen?.codigoBarras || `ID: ${r.idEdicionVolumen}`}</TableCell>
                      <TableCell className="text-sm">{r.edicionVolumen?.libro?.titulo || '-'}</TableCell>
                      <TableCell className="text-xs">{new Date(r.fechaReserva).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={r.estadoReserva === 'Activa' ? 'default' : 'secondary'} className="text-xs">
                          {r.estadoReserva || 'Activa'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {r.estadoReserva === 'Activa' && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 cursor-pointer"
                            onClick={() => { if (confirm('¿Cancelar esta reserva?')) cancelReserva.mutate(r.idReserva); }}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
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
