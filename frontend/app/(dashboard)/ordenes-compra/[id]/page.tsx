'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useOrdenCompra } from '@/hooks/use-proveedores';
import { OrdenCompraDetalle } from '@/components/proveedores/OrdenCompraDetalle';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function OrdenCompraDetallePage() {
  const { id } = useParams<{ id: string }>();
  const { data: orden, isLoading } = useOrdenCompra(Number(id));

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!orden) return <div className="flex justify-center py-24 text-zinc-400">Orden de compra no encontrada</div>;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/ordenes-compra"><Button variant="ghost" size="icon" className="cursor-pointer"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Orden de Compra #{orden.idOrdenCompra}</h1>
          <p className="text-zinc-500 text-sm">{orden.proveedor?.nombreEmpresa}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <OrdenCompraDetalle orden={orden} />
      </div>
    </div>
  );
}
