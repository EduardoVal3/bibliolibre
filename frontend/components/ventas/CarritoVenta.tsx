'use client';

import { Button } from '@/components/ui/button';
import { X, Minus, Plus } from 'lucide-react';
import type { ProductoVenta } from '@/types/ventas.types';

interface CartItem {
  producto: ProductoVenta;
  cantidad: number;
}

export function CarritoVenta({
  items, onUpdateCantidad, onRemove, onClear, disabled,
}: {
  items: CartItem[];
  onUpdateCantidad: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  const total = items.reduce((s, i) => s + Number(i.producto.precio) * i.cantidad, 0);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">Carrito ({items.length})</h3>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} disabled={disabled} className="text-xs text-red-500 cursor-pointer">
            Vaciar
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-8">Carrito vacío</p>
        ) : (
          items.map((item) => (
            <div key={item.producto.idProducto} className="flex items-center gap-3 p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{item.producto.nombre}</p>
                <p className="text-xs text-zinc-500">${Number(item.producto.precio).toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onUpdateCantidad(item.producto.idProducto, -1)} disabled={disabled || item.cantidad <= 1} className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer disabled:opacity-30">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                <button onClick={() => onUpdateCantidad(item.producto.idProducto, 1)} disabled={disabled} className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer disabled:opacity-30">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 w-16 text-right">
                ${(Number(item.producto.precio) * item.cantidad).toFixed(2)}
              </p>
              <button onClick={() => onRemove(item.producto.idProducto)} disabled={disabled} className="p-1 text-zinc-400 hover:text-red-500 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
        <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-zinc-900 dark:text-zinc-50">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
