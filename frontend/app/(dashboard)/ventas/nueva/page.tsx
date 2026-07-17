'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useProductosVenta, useMetodosPago, useCreateVenta } from '@/hooks/use-ventas';
import { ProductoSelector } from '@/components/ventas/ProductoSelector';
import { CarritoVenta } from '@/components/ventas/CarritoVenta';
import { MetodoPagoSelect } from '@/components/ventas/MetodoPagoSelect';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import type { ProductoVenta } from '@/types/ventas.types';

export default function NuevaVentaPage() {
  const router = useRouter();
  const { data: productos } = useProductosVenta();
  const { data: metodosPago } = useMetodosPago();
  const createVenta = useCreateVenta();

  const [cart, setCart] = useState<{ producto: ProductoVenta; cantidad: number }[]>([]);
  const [idEmpleado, setIdEmpleado] = useState('');
  const [idUsuario, setIdUsuario] = useState('');
  const [idMetodoPago, setIdMetodoPago] = useState('');

  const addToCart = (p: ProductoVenta) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.producto.idProducto === p.idProducto);
      if (existing) {
        if (existing.cantidad >= p.stockDisponible) {
          toast.warning('Stock insuficiente');
          return prev;
        }
        return prev.map((i) => i.producto.idProducto === p.idProducto ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { producto: p, cantidad: 1 }];
    });
  };

  const updateCantidad = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => {
        if (i.producto.idProducto !== id) return i;
        const nueva = i.cantidad + delta;
        if (nueva < 1) return i;
        if (nueva > i.producto.stockDisponible) {
          toast.warning('Stock insuficiente');
          return i;
        }
        return { ...i, cantidad: nueva };
      })
    );
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.producto.idProducto !== id));
  const clearCart = () => setCart([]);

  const handleSubmit = async () => {
    if (!idEmpleado || !idMetodoPago || cart.length === 0) {
      toast.warning('Completa todos los campos y agrega productos');
      return;
    }

    createVenta.mutate(
      {
        idUsuario: Number(idUsuario) || 0,
        idEmpleado: Number(idEmpleado),
        productos: cart.map((i) => i.producto.idProducto),
        cantidades: cart.map((i) => i.cantidad),
        idMetodoPago: Number(idMetodoPago),
      },
      { onSuccess: () => { clearCart(); router.push('/ventas'); } },
    );
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <Link href="/ventas" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> Volver a ventas
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Nueva Venta (POS)</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[600px]">
          {productos ? (
            <ProductoSelector productos={productos} onAgregar={addToCart} disabled={createVenta.isPending} />
          ) : (
            <div className="flex items-center justify-center h-full"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
          )}
        </div>

        <div className="h-[600px] flex flex-col gap-4">
          <div className="flex-1">
            <CarritoVenta items={cart} onUpdateCantidad={updateCantidad} onRemove={removeFromCart} onClear={clearCart} disabled={createVenta.isPending} />
          </div>

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardContent className="p-4 space-y-3">
              <Input type="number" placeholder="ID Empleado *" value={idEmpleado} onChange={(e) => setIdEmpleado(e.target.value)} />
              <Input type="number" placeholder="ID Usuario" value={idUsuario} onChange={(e) => setIdUsuario(e.target.value)} />
              <MetodoPagoSelect metodos={metodosPago || []} value={idMetodoPago} onChange={setIdMetodoPago} disabled={createVenta.isPending} />
              <Button onClick={handleSubmit} disabled={createVenta.isPending || cart.length === 0} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                {createVenta.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Procesando...</> : 'Completar Venta'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
