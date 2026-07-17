'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useVenta } from '@/hooks/use-ventas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function VentaDetallePage() {
  const { id } = useParams<{ id: string }>();
  const { data: venta, isLoading } = useVenta(Number(id));

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!venta) return <div className="text-center py-24 text-zinc-500">Venta no encontrada</div>;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <Link href="/ventas" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Volver a ventas
      </Link>

      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Venta #{venta.idVenta}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-zinc-500">Fecha:</span> <span className="font-medium">{new Date(venta.fechaVenta).toLocaleString()}</span></div>
            <div><span className="text-zinc-500">Empleado:</span> <span className="font-medium">{venta.empleado?.persona?.pNombre} {venta.empleado?.persona?.pApellido}</span></div>
            <div><span className="text-zinc-500">Usuario:</span> <span className="font-medium">{venta.idUsuario || '—'}</span></div>
            <div><span className="text-zinc-500">Total:</span> <span className="font-bold text-lg">${Number(venta.total).toFixed(2)}</span></div>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Detalle</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">Precio Unit.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venta.detalles?.map((d) => (
                  <TableRow key={d.idDetalleVenta}>
                    <TableCell>{d.producto?.nombre || `ID: ${d.idProducto}`}</TableCell>
                    <TableCell className="text-right">{d.cantidad}</TableCell>
                    <TableCell className="text-right">${Number(d.precioUnitario).toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${Number(d.subtotal).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Pagos</h3>
            {venta.pagos?.map((p) => (
              <div key={p.idPagoVenta} className="flex justify-between text-sm py-1">
                <span className="text-zinc-500">{p.metodoPago?.nombreMetodo}</span>
                <span className="font-medium">${Number(p.monto).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
