'use client';

import { useState, useMemo } from 'react';
import {
  useRolesEmpleado, usePermisos, useCreateRolEmpleado, useDeleteRolEmpleado,
  useCreatePermiso, useDeletePermiso, useAssignPermiso,
} from '@/hooks/use-ventas';
import { PermisosMatrix } from '@/components/ventas/PermisosMatrix';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, RefreshCw, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RolesEmpleadoPage() {
  const { data: roles, isLoading: loadingRoles, refetch: refetchRoles, isFetching: fetchingRoles } = useRolesEmpleado();
  const { data: permisos, isLoading: loadingPermisos } = usePermisos();
  const createRol = useCreateRolEmpleado();
  const deleteRol = useDeleteRolEmpleado();
  const createPermiso = useCreatePermiso();
  const deletePermiso = useDeletePermiso();
  const assignPermiso = useAssignPermiso();

  const [openRol, setOpenRol] = useState(false);
  const [openPermiso, setOpenPermiso] = useState(false);
  const [rolForm, setRolForm] = useState({ nombreRol: '', descripcion: '' });
  const [permisoForm, setPermisoForm] = useState({ nombrePermiso: '', descripcion: '' });

  const handleTogglePermiso = async (idRol: number, idPermiso: number) => {
    await assignPermiso.mutateAsync({ idRol, idPermiso });
  };

  const isLoading = loadingRoles || loadingPermisos;

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Roles y Permisos</h1>
          <p className="text-zinc-500 text-sm">Asignación de permisos a roles de empleados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetchRoles()} disabled={fetchingRoles} className="cursor-pointer gap-2">
            <RefreshCw className={`w-4 h-4 ${fetchingRoles ? 'animate-spin' : ''}`} /> Actualizar
          </Button>
          <Dialog open={openRol} onOpenChange={setOpenRol}>
            <DialogTrigger>
              <Button size="sm" variant="outline" className="cursor-pointer gap-2"><Plus className="w-4 h-4" /> Nuevo Rol</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader><DialogTitle>Nuevo Rol</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Nombre del rol *" value={rolForm.nombreRol} onChange={(e) => setRolForm({ ...rolForm, nombreRol: e.target.value })} />
                <Input placeholder="Descripción" value={rolForm.descripcion} onChange={(e) => setRolForm({ ...rolForm, descripcion: e.target.value })} />
                <Button onClick={() => { if (!rolForm.nombreRol) { toast.warning('El nombre es requerido'); return; } createRol.mutate(rolForm, { onSuccess: () => { setOpenRol(false); setRolForm({ nombreRol: '', descripcion: '' }); } }); }} disabled={createRol.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">Crear Rol</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={openPermiso} onOpenChange={setOpenPermiso}>
            <DialogTrigger>
              <Button size="sm" variant="outline" className="cursor-pointer gap-2"><Plus className="w-4 h-4" /> Nuevo Permiso</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader><DialogTitle>Nuevo Permiso</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Nombre del permiso *" value={permisoForm.nombrePermiso} onChange={(e) => setPermisoForm({ ...permisoForm, nombrePermiso: e.target.value })} />
                <Input placeholder="Descripción" value={permisoForm.descripcion} onChange={(e) => setPermisoForm({ ...permisoForm, descripcion: e.target.value })} />
                <Button onClick={() => { if (!permisoForm.nombrePermiso) { toast.warning('El nombre es requerido'); return; } createPermiso.mutate(permisoForm, { onSuccess: () => { setOpenPermiso(false); setPermisoForm({ nombrePermiso: '', descripcion: '' }); } }); }} disabled={createPermiso.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">Crear Permiso</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader><CardTitle className="text-lg">Matriz de Permisos</CardTitle></CardHeader>
            <CardContent>
              <PermisosMatrix
                roles={roles || []}
                permisos={permisos || []}
                asignaciones={{}}
                onToggle={handleTogglePermiso}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader><CardTitle className="text-lg">Roles</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {roles?.length === 0 && <p className="text-sm text-zinc-400">Sin roles</p>}
              {roles?.map((r) => (
                <div key={r.idRol} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{r.nombreRol}</p>
                    {r.descripcion && <p className="text-xs text-zinc-500">{r.descripcion}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteRol.mutate(r.idRol)} className="text-red-500 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader><CardTitle className="text-lg">Permisos</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {permisos?.length === 0 && <p className="text-sm text-zinc-400">Sin permisos</p>}
              {permisos?.map((p) => (
                <div key={p.idPermiso} className="flex items-center justify-between p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{p.nombrePermiso}</p>
                    {p.descripcion && <p className="text-xs text-zinc-500">{p.descripcion}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deletePermiso.mutate(p.idPermiso)} className="text-red-500 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
