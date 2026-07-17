'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import type { ProductoVenta } from '@/types/ventas.types';

export function ProductoSelector({
  productos, onAgregar, disabled,
}: {
  productos: ProductoVenta[];
  onAgregar: (p: ProductoVenta) => void;
  disabled?: boolean;
}) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) && p.stockDisponible > 0
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input
            placeholder="Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtrados.length === 0 ? (
          <p className="text-sm text-zinc-400 text-center py-8">
            {busqueda ? 'Sin resultados' : 'No hay productos disponibles'}
          </p>
        ) : (
          filtrados.map((p) => (
            <div key={p.idProducto} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <div className="min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{p.nombre}</p>
                <p className="text-xs text-zinc-500">${Number(p.precio).toFixed(2)} · Stock: {p.stockDisponible}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onAgregar(p)} disabled={disabled} className="cursor-pointer shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
