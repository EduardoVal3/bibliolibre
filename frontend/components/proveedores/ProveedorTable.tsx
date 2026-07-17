'use client';

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import { useDeleteProveedor } from '@/hooks/use-proveedores';
import type { Proveedor } from '@/types/proveedores.types';

interface ProveedorTableProps {
  proveedores: Proveedor[];
}

export function ProveedorTable({ proveedores }: ProveedorTableProps) {
  const deleteMutation = useDeleteProveedor();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Empresa</TableHead>
            <TableHead className="font-semibold">Contacto</TableHead>
            <TableHead className="font-semibold">Teléfono</TableHead>
            <TableHead className="font-semibold">Correo</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proveedores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-zinc-400">No se encontraron proveedores.</TableCell>
            </TableRow>
          ) : (
            proveedores.map((p) => (
              <TableRow key={p.idProveedor} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">{p.nombreEmpresa}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{p.contacto || '—'}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{p.telefono || '—'}</TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">{p.correo || '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Link href={`/proveedores/editar/${p.idProveedor}`}>
                      <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                        <Pencil className="w-4 h-4 text-zinc-500" />
                      </Button>
                    </Link>
                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 cursor-pointer"
                      onClick={() => { if (confirm(`¿Eliminar proveedor ${p.nombreEmpresa}?`)) deleteMutation.mutate(p.idProveedor); }}>
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
