'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CupoBadge } from './CupoBadge';
import { useDeleteEvento } from '@/hooks/use-eventos';
import { Pencil, Trash2, ClipboardCheck } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Evento } from '@/types/eventos.types';

interface EventoTableProps {
  eventos: Evento[];
}

export function EventoTable({ eventos }: EventoTableProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { mutate, isPending } = useDeleteEvento();

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Nombre</TableHead>
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="font-semibold">Lugar</TableHead>
              <TableHead className="font-semibold">Cupo</TableHead>
              <TableHead className="font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eventos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-zinc-400">No hay eventos</TableCell>
              </TableRow>
            ) : (
              eventos.map((e) => (
                <TableRow key={e.idEvento}>
                  <TableCell className="font-medium">{e.nombreEvento}</TableCell>
                  <TableCell className="text-xs">{new Date(e.fechaEvento).toLocaleDateString()}</TableCell>
                  <TableCell className="text-zinc-500">{e.lugar || '—'}</TableCell>
                  <TableCell><CupoBadge capacidadMaxima={e.capacidadMaxima} inscritos={0} /></TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/eventos/${e.idEvento}/asistencia`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" title="Marcar asistencia">
                          <ClipboardCheck className="w-4 h-4 text-zinc-500" />
                        </Button>
                      </Link>
                      <Link href={`/eventos/editar/${e.idEvento}`}>
                        <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                          <Pencil className="w-4 h-4 text-zinc-500" />
                        </Button>
                      </Link>
                      <Button size="icon" variant="ghost" className="h-8 w-8 hover:text-red-600 cursor-pointer" onClick={() => setDeleteId(e.idEvento)}>
                        <Trash2 className="w-4 h-4 text-zinc-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar evento?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && mutate(deleteId)}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              {isPending ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
