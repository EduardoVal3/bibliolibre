'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NativeSelect } from '@/components/ui/native-select';
import { useCreateDevolucion } from '@/hooks/use-prestamos';
import type { Prestamo } from '@/types/prestamos.types';

interface DevolucionModalProps {
  prestamo: Prestamo;
  open: boolean;
  onClose: () => void;
}

export function DevolucionModal({ prestamo, open, onClose }: DevolucionModalProps) {
  const [selectedCopyId, setSelectedCopyId] = useState<number>(0);
  const [estadoEntrega, setEstadoEntrega] = useState('Bueno');
  const devolucionMutation = useCreateDevolucion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCopyId) return;
    devolucionMutation.mutate(
      { idEdicionVolumen: selectedCopyId, estadoEntrega },
      { onSuccess: () => onClose() },
    );
  };

  const detallesDisponibles = prestamo.detalles?.filter((d) => d.edicionVolumen) || [];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Registrar Devolución</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-zinc-500">
              Préstamo #{prestamo.idPrestamo} — {new Date(prestamo.fechaPrestamo).toLocaleDateString()}
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Ejemplar a devolver</label>
              <NativeSelect value={selectedCopyId} onChange={(e) => setSelectedCopyId(Number(e.target.value))} required>
                <option value="0">Seleccionar ejemplar...</option>
                {detallesDisponibles.map((d) => (
                  <option key={d.idDetallePrestamo} value={d.idEdicionVolumen}>
                    {d.edicionVolumen?.codigoBarras || `ID: ${d.idEdicionVolumen}`}
                    {d.edicionVolumen?.libro ? ` — ${d.edicionVolumen.libro.titulo}` : ''}
                  </option>
                ))}
              </NativeSelect>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Estado de entrega</label>
              <NativeSelect value={estadoEntrega} onChange={(e) => setEstadoEntrega(e.target.value)}>
                <option value="Bueno">Bueno</option>
                <option value="Regular">Regular</option>
                <option value="Malo">Malo</option>
              </NativeSelect>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancelar
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium border-0 cursor-pointer" disabled={devolucionMutation.isPending || !selectedCopyId}>
              {devolucionMutation.isPending ? 'Registrando...' : 'Registrar Devolución'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
