'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import type { OrdenCompra } from '@/types/proveedores.types';

interface OrdenCompraDetalleProps {
  orden: OrdenCompra;
}

export function OrdenCompraDetalle({ orden }: OrdenCompraDetalleProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-zinc-500">Proveedor:</span>
          <p className="font-medium text-zinc-900 dark:text-zinc-50">{orden.proveedor?.nombreEmpresa || '—'}</p>
          {orden.proveedor?.contacto && <p className="text-zinc-400">{orden.proveedor.contacto}</p>}
        </div>
        <div className="text-right">
          <span className="text-zinc-500">Fecha:</span>
          <p className="font-medium text-zinc-900 dark:text-zinc-50">{new Date(orden.fechaOrden).toLocaleDateString()}</p>
          <span className="text-zinc-500">Total:</span>
          <p className="font-mono font-bold text-lg">${Number(orden.totalOrden).toLocaleString('es-AR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">#</TableHead>
              <TableHead className="font-semibold text-right">Cantidad</TableHead>
              <TableHead className="font-semibold text-right">Precio Unitario</TableHead>
              <TableHead className="font-semibold text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orden.detalles?.map((d, i) => (
              <TableRow key={d.idDetalleOrden} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <TableCell className="text-zinc-500">{i + 1}</TableCell>
                <TableCell className="text-right font-mono">{d.cantidad}</TableCell>
                <TableCell className="text-right font-mono">${Number(d.precioUnitario).toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono">${(d.cantidad * Number(d.precioUnitario)).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
