'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Hand, Undo } from 'lucide-react';
import Link from 'next/link';
import { DispositivoEstadoBadge } from './DispositivoEstadoBadge';
import { useDevolverDispositivo } from '@/hooks/use-recursos-digitales';
import type { DispositivoPrestado } from '@/types/recursos-digitales.types';

interface DispositivoTableProps {
  dispositivos: DispositivoPrestado[];
}

export function DispositivoTable({ dispositivos }: DispositivoTableProps) {
  const devolverMutation = useDevolverDispositivo();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Dispositivo</TableHead>
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="font-semibold">Serie</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dispositivos.length === 0 ? (
            <TableRow><TableCell colSpan={5} className="text-center py-8 text-zinc-400">No hay dispositivos registrados.</TableCell></TableRow>
          ) : (
            dispositivos.map((d) => (
              <TableRow key={d.idDispositivo} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">{d.nombreDispositivo}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{d.tipoDispositivo || '—'}</TableCell>
                <TableCell className="font-mono text-xs text-zinc-500">{d.numeroSerie || '—'}</TableCell>
                <TableCell><DispositivoEstadoBadge estado={d.estado} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    {d.estado === 'Prestado' && (
                      <Button size="sm" variant="ghost" className="h-8 cursor-pointer gap-1 text-xs"
                        onClick={() => devolverMutation.mutate(d.idDispositivo)}>
                        <Undo className="w-3.5 h-3.5" /> Devolver
                      </Button>
                    )}
                    <Link href={`/dispositivos/${d.idDispositivo}`}>
                      <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer"><Eye className="w-4 h-4 text-zinc-500" /></Button>
                    </Link>
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
