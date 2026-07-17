'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DevolucionModal } from './DevolucionModal';
import { Undo, Eye } from 'lucide-react';
import type { Prestamo } from '@/types/prestamos.types';

interface PrestamoTableProps {
  prestamos: Prestamo[];
}

export function PrestamoTable({ prestamos }: PrestamoTableProps) {
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);

  return (
    <>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Usuario</TableHead>
              <TableHead className="font-semibold">Ejemplares</TableHead>
              <TableHead className="font-semibold">Préstamo</TableHead>
              <TableHead className="font-semibold">Límite</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prestamos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-zinc-400">
                  No se encontraron préstamos.
                </TableCell>
              </TableRow>
            ) : (
              prestamos.map((p) => {
                const vencido = new Date(p.fechaLimiteDevolucion) < new Date();
                return (
                  <TableRow key={p.idPrestamo} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <TableCell className="font-mono text-xs">{p.idPrestamo}</TableCell>
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                      {p.usuario?.persona
                        ? `${p.usuario.persona.pNombre} ${p.usuario.persona.pApellido}`
                        : `Usuario #${p.idUsuario}`}
                    </TableCell>
                    <TableCell>{p.detalles?.length || 0}</TableCell>
                    <TableCell className="text-xs">{new Date(p.fechaPrestamo).toLocaleDateString()}</TableCell>
                    <TableCell className="text-xs">{new Date(p.fechaLimiteDevolucion).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {vencido ? (
                        <Badge variant="destructive" className="text-xs">Vencido</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">Activo</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button size="icon" variant="ghost" className="h-8 w-8 cursor-pointer">
                          <Eye className="w-4 h-4 text-zinc-500" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 cursor-pointer"
                          onClick={() => setSelectedPrestamo(p)}
                        >
                          <Undo className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedPrestamo && (
        <DevolucionModal
          prestamo={selectedPrestamo}
          open={!!selectedPrestamo}
          onClose={() => setSelectedPrestamo(null)}
        />
      )}
    </>
  );
}
