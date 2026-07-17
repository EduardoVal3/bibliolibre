'use client';

import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMarcarAsistencia } from '@/hooks/use-eventos';
import { Loader2 } from 'lucide-react';
import type { AsistenciaEvento } from '@/types/eventos.types';

interface AsistenciaTableProps {
  asistencias: AsistenciaEvento[];
}

const opciones = ['Sí', 'No', 'Pendiente'] as const;

function AsistenciaBadge({ value }: { value: string }) {
  if (value === 'Sí') return <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">{value}</Badge>;
  if (value === 'No') return <Badge variant="destructive">{value}</Badge>;
  return <Badge variant="secondary">{value}</Badge>;
}

export function AsistenciaTable({ asistencias }: AsistenciaTableProps) {
  const { mutate, isPending } = useMarcarAsistencia();

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Usuario</TableHead>
            <TableHead className="font-semibold">Registro</TableHead>
            <TableHead className="font-semibold">Asistencia</TableHead>
            <TableHead className="font-semibold text-right">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {asistencias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-zinc-400">No hay inscripciones</TableCell>
            </TableRow>
          ) : (
            asistencias.map((a) => (
              <TableRow key={a.idAsistencia}>
                <TableCell className="font-medium">
                  {a.usuario?.persona
                    ? `${a.usuario.persona.pNombre} ${a.usuario.persona.pApellido}`
                    : `Usuario #${a.idUsuario}`}
                </TableCell>
                <TableCell className="text-xs">{new Date(a.fechaRegistro).toLocaleDateString()}</TableCell>
                <TableCell><AsistenciaBadge value={a.asistencia} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    {opciones.map((o) => (
                      <Button
                        key={o}
                        size="sm"
                        variant={a.asistencia === o ? 'default' : 'outline'}
                        disabled={isPending}
                        onClick={() => mutate({ idEvento: a.idEvento, idUsuario: a.idUsuario, data: { asistencia: o } })}
                        className="h-8 text-xs cursor-pointer"
                      >
                        {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : o}
                      </Button>
                    ))}
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
