'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash, Eye } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '@/lib/api/usuarios.api';
import { toast } from 'sonner';
import { MembresiaBadge } from './MembresiaBadge';
import type { VwUsuarioCompleto } from '@/types/usuarios.types';

interface UsuarioTableProps {
  usuarios: VwUsuarioCompleto[];
}

export function UsuarioTable({ usuarios }: UsuarioTableProps) {
  const qc = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usuariosApi.usuarios.delete(id),
    onSuccess: () => {
      toast.success('Usuario eliminado');
      qc.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (e: any) => toast.error(e.message || 'Error al eliminar'),
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Correo</TableHead>
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="font-semibold">Membresía</TableHead>
            <TableHead className="font-semibold">Registro</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-zinc-400">
                No se encontraron usuarios.
              </TableCell>
            </TableRow>
          ) : (
            usuarios.map((u) => (
              <TableRow key={u.idUsuario} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                  {u.nombreCompleto}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{u.correo}</TableCell>
                <TableCell>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {u.tipoUsuario}
                  </span>
                </TableCell>
                <TableCell>
                  <MembresiaBadge nombre={u.nombreMembresia} vence={u.membresiaVence} />
                </TableCell>
                <TableCell className="text-xs text-zinc-400">
                  {new Date(u.fechaRegistro).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                      <Eye className="w-4 h-4 text-zinc-500" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 cursor-pointer"
                      onClick={() => { if (confirm(`¿Eliminar usuario ${u.nombreCompleto}?`)) deleteMutation.mutate(u.idUsuario); }}
                    >
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
