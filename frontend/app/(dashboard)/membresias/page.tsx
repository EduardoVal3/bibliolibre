'use client';

import { useMembresias } from '@/hooks/use-usuarios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CreditCard } from 'lucide-react';

export default function MembresiasPage() {
  const { data: membresias, isLoading } = useMembresias();

  const membs = Array.isArray(membresias) ? membresias : [];

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Membresías</h1>
        <p className="text-zinc-500 text-sm">Planes de membresía disponibles para los usuarios</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {membs.map((m) => (
            <Card key={m.idMembresia} className="border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  {m.nombreMembresia}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-zinc-500">{m.descripcion || 'Sin descripción'}</p>
                <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-sm text-zinc-500">Costo</span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    {Number(m.costo).toLocaleString('es-HN', { style: 'currency', currency: 'HNL' })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Duración</span>
                  <span className="font-medium">{m.duracionMeses} meses</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
