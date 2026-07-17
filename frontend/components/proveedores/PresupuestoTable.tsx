'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useDeletePresupuesto } from '@/hooks/use-proveedores';
import type { Presupuesto } from '@/types/proveedores.types';

interface PresupuestoTableProps {
  presupuestos: Presupuesto[];
}

export function PresupuestoTable({ presupuestos }: PresupuestoTableProps) {
  const deleteMutation = useDeletePresupuesto();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Año</TableHead>
            <TableHead className="font-semibold text-right">Monto Asignado</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {presupuestos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-zinc-400">No se encontraron presupuestos.</TableCell>
            </TableRow>
          ) : (
            presupuestos.map((p) => (
              <TableRow key={p.idPresupuesto} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">{p.anio}</TableCell>
                <TableCell className="text-right font-mono text-zinc-700 dark:text-zinc-200">
                  ${Number(p.montoAsignado).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Link href={`/presupuestos/editar/${p.idPresupuesto}`}>
                      <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                        <Pencil className="w-4 h-4 text-zinc-500" />
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 cursor-pointer"
                      onClick={() => { if (confirm(`¿Eliminar presupuesto ${p.anio}?`)) deleteMutation.mutate(p.idPresupuesto); }}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
