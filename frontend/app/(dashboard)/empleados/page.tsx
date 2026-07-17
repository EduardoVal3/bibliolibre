'use client';

import { useState } from 'react';
import { useEmpleados, useCreateEmpleado, useDeleteEmpleado, useRolesEmpleado, useTurnos } from '@/hooks/use-ventas';
import { EmpleadoTable } from '@/components/ventas/EmpleadoTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, RefreshCw, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function EmpleadosPage() {
  const { data: empleados, isLoading, refetch, isFetching } = useEmpleados();
  const { data: roles } = useRolesEmpleado();
  const { data: turnos } = useTurnos();
  const createEmpleado = useCreateEmpleado();
  const deleteEmpleado = useDeleteEmpleado();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ idPersona: '', idRol: '', idTurno: '', fechaContratacion: '' });

  const handleCreate = () => {
    if (!form.idPersona || !form.idRol) { toast.warning('ID Persona y Rol son requeridos'); return; }
    createEmpleado.mutate(
      {
        idPersona: Number(form.idPersona),
        idRol: Number(form.idRol),
        idTurno: form.idTurno ? Number(form.idTurno) : undefined,
        fechaContratacion: form.fechaContratacion || undefined,
      },
      { onSuccess: () => { setOpen(false); setForm({ idPersona: '', idRol: '', idTurno: '', fechaContratacion: '' }); } },
    );
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Empleados</h1>
          <p className="text-zinc-500 text-sm">Gestión de empleados del sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualizar
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer gap-2">
                <Plus className="w-4 h-4" /> Nuevo Empleado
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader><DialogTitle>Nuevo Empleado</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input type="number" placeholder="ID Persona *" value={form.idPersona} onChange={(e) => setForm({ ...form, idPersona: e.target.value })} />
                <NativeSelect value={form.idRol} onChange={(e) => setForm({ ...form, idRol: e.target.value })}>
                  <option value="">Seleccionar Rol *</option>
                  {roles?.map((r) => <option key={r.idRol} value={r.idRol}>{r.nombreRol}</option>)}
                </NativeSelect>
                <NativeSelect value={form.idTurno} onChange={(e) => setForm({ ...form, idTurno: e.target.value })}>
                  <option value="">Seleccionar Turno</option>
                  {turnos?.map((t) => <option key={t.idTurno} value={t.idTurno}>{t.nombreTurno}</option>)}
                </NativeSelect>
                <Input type="date" placeholder="Fecha contratación" value={form.fechaContratacion} onChange={(e) => setForm({ ...form, fechaContratacion: e.target.value })} />
                <Button onClick={handleCreate} disabled={createEmpleado.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                  {createEmpleado.isPending ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creando...</> : 'Crear Empleado'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <EmpleadoTable empleados={empleados || []} onDelete={(id) => deleteEmpleado.mutate(id)} deleting={deleteEmpleado.isPending ? undefined : null} />
      )}
    </div>
  );
}
