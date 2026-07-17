'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useDeleteRecurso } from '@/hooks/use-recursos-digitales';
import type { RecursoDigital } from '@/types/recursos-digitales.types';

interface RecursoDigitalTableProps {
  recursos: RecursoDigital[];
}

export function RecursoDigitalTable({ recursos }: RecursoDigitalTableProps) {
  const deleteMutation = useDeleteRecurso();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Título</TableHead>
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="font-semibold">Formato</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recursos.length === 0 ? (
            <TableRow><TableCell colSpan={4} className="text-center py-8 text-zinc-400">No se encontraron recursos.</TableCell></TableRow>
          ) : (
            recursos.map((r) => (
              <TableRow key={r.idRecurso} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">{r.titulo}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{r.tipoRecurso || '—'}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{r.formato || '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Link href={`/biblioteca-digital/editar/${r.idRecurso}`}>
                      <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer"><Pencil className="w-4 h-4 text-zinc-500" /></Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                      onClick={() => { if (confirm(`¿Eliminar "${r.titulo}"?`)) deleteMutation.mutate(r.idRecurso); }}>
                      <Trash className="w-4 h-4" />
                    </Button>
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
