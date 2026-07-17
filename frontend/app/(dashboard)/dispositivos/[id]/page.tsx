'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDispositivo, usePrestamosDispositivo, usePrestarDispositivo } from '@/hooks/use-recursos-digitales';
import { DispositivoEstadoBadge } from '@/components/recursos-digitales/DispositivoEstadoBadge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DispositivoDetallePage() {
  const { id } = useParams<{ id: string }>();
  const { data: dispositivo, isLoading } = useDispositivo(Number(id));
  const { data: prestamos, isLoading: loadingPrestamos } = usePrestamosDispositivo(Number(id));
  const prestarMutation = usePrestarDispositivo();
  const [userId, setUserId] = useState('');

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  if (!dispositivo) return <div className="flex justify-center py-24 text-zinc-400">Dispositivo no encontrado</div>;

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dispositivos"><Button variant="ghost" size="icon" className="cursor-pointer"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{dispositivo.nombreDispositivo}</h1>
          <p className="text-zinc-500 text-sm">Serie: {dispositivo.numeroSerie || '—'} · <DispositivoEstadoBadge estado={dispositivo.estado} /></p>
        </div>
      </div>

      {dispositivo.estado === 'Disponible' && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm space-y-3">
          <h3 className="font-semibold text-sm">Prestar dispositivo</h3>
          <div className="flex gap-3 items-end">
            <div className="space-y-1">
              <Label htmlFor="userId">ID Usuario</Label>
              <Input id="userId" type="number" className="w-32" value={userId} onChange={(e) => setUserId(e.target.value)} />
            </div>
            <Button size="sm" disabled={!userId || prestarMutation.isPending} className="cursor-pointer"
              onClick={() => prestarMutation.mutate(
                { id: Number(id), data: { idUsuario: Number(userId) } },
                { onSuccess: () => setUserId('') },
              )}>
              Prestar
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-zinc-500">Historial de préstamos</h3>
        {loadingPrestamos ? (
          <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Usuario</TableHead>
                  <TableHead className="font-semibold">Préstamo</TableHead>
                  <TableHead className="font-semibold">Límite</TableHead>
                  <TableHead className="font-semibold">Devolución</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(!prestamos || prestamos.length === 0) ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-zinc-400">Sin préstamos registrados.</TableCell></TableRow>
                ) : (
                  prestamos.map((p) => (
                    <TableRow key={p.idPrestamoDispositivo}>
                      <TableCell className="text-zinc-700 dark:text-zinc-200">
                        {p.usuario?.persona ? `${p.usuario.persona.pnombre} ${p.usuario.persona.papellido}` : `#${p.idUsuario}`}
                      </TableCell>
                      <TableCell className="text-zinc-600">{new Date(p.fechaPrestamo).toLocaleDateString()}</TableCell>
                      <TableCell className="text-zinc-600">{p.fechaLimiteDevolucion ? new Date(p.fechaLimiteDevolucion).toLocaleDateString() : '—'}</TableCell>
                      <TableCell className="text-zinc-600">{p.fechaDevolucion ? new Date(p.fechaDevolucion).toLocaleDateString() : <span className="text-amber-500 font-medium">Pendiente</span>}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
