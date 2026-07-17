'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import type { OrdenCompra } from '@/types/proveedores.types';

interface OrdenCompraTableProps {
  ordenes: OrdenCompra[];
}

export function OrdenCompraTable({ ordenes }: OrdenCompraTableProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Proveedor</TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordenes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-zinc-400">No se encontraron órdenes de compra.</TableCell>
            </TableRow>
          ) : (
            ordenes.map((o) => (
              <TableRow key={o.idOrdenCompra} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <TableCell className="font-mono text-xs text-zinc-500">#{o.idOrdenCompra}</TableCell>
                <TableCell className="text-zinc-700 dark:text-zinc-200">{new Date(o.fechaOrden).toLocaleDateString()}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{o.proveedor?.nombreEmpresa || '—'}</TableCell>
                <TableCell className="text-right font-mono text-zinc-700 dark:text-zinc-200">
                  ${Number(o.totalOrden).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/ordenes-compra/${o.idOrdenCompra}`}>
                    <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                      <Eye className="w-4 h-4 text-zinc-500" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
