'use client';

import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import type { Empleado } from '@/types/ventas.types';

export function EmpleadoTable({
  empleados, onDelete, deleting,
}: {
  empleados: Empleado[];
  onDelete: (id: number) => void;
  deleting?: number | null;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Turno</TableHead>
            <TableHead>Contratación</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {empleados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-zinc-400 py-8">No hay empleados registrados</TableCell>
            </TableRow>
          ) : (
            empleados.map((e) => (
              <TableRow key={e.idEmpleado}>
                <TableCell className="font-mono text-xs">{e.idEmpleado}</TableCell>
                <TableCell className="font-medium">{e.persona?.pNombre} {e.persona?.pApellido}</TableCell>
                <TableCell className="text-zinc-500">{e.persona?.correo}</TableCell>
                <TableCell>{e.rol?.nombreRol}</TableCell>
                <TableCell>{e.turno?.nombreTurno}</TableCell>
                <TableCell>{e.fechaContratacion}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(e.idEmpleado)} disabled={deleting === e.idEmpleado} className="text-red-500 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
