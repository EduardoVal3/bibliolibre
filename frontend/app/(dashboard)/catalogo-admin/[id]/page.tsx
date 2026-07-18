'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/api/catalogo.api';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { DisponibilidadBadge } from '@/components/catalogo/DisponibilidadBadge';
import { ReservaButton } from '@/components/catalogo/ReservaButton';
import { ArrowLeft, Loader2, Plus, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LibroDetailPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  const [addCopyOpen, setAddCopyOpen] = useState(false);
  const [editCopyOpen, setEditCopyOpen] = useState(false);
  const [selectedCopyId, setSelectedCopyId] = useState<number | null>(null);

  const [newBarcode, setNewBarcode] = useState('');
  const [newPhysicalState, setNewPhysicalState] = useState('Bueno');
  const [newLocationId, setNewLocationId] = useState<number>(0);

  const [editPhysicalState, setEditPhysicalState] = useState('Bueno');
  const [editAvailability, setEditAvailability] = useState('Disponible');

  const { data: libro, isLoading, error } = useQuery({
    queryKey: ['libro', id],
    queryFn: () => catalogoApi.getLibroById(id),
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => catalogoApi.getUbicaciones(),
  });

  const addCopyMutation = useMutation({
    mutationFn: (data: { codigoBarras: string; estadoFisico: string; idLibro: number; idUbicacion?: number }) =>
      catalogoApi.createEjemplar(data),
    onSuccess: () => {
      toast.success('Ejemplar agregado correctamente');
      queryClient.invalidateQueries({ queryKey: ['libro', id] });
      setAddCopyOpen(false);
      setNewBarcode('');
      setNewPhysicalState('Bueno');
      setNewLocationId(0);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al agregar ejemplar');
    },
  });

  const updateCopyMutation = useMutation({
    mutationFn: ({ copyId, data }: { copyId: number; data: { estadoFisico?: string; disponibilidad?: string } }) =>
      catalogoApi.updateEjemplarEstado(copyId, data),
    onSuccess: () => {
      toast.success('Estado del ejemplar actualizado');
      queryClient.invalidateQueries({ queryKey: ['libro', id] });
      setEditCopyOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al actualizar el ejemplar');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 flex-1">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !libro) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-rose-500">Error al cargar libro</h2>
        <p className="text-zinc-500">El libro solicitado no existe o no se pudo cargar.</p>
        <Link href="/catalogo-admin">
          <Button variant="outline">Regresar al catálogo</Button>
        </Link>
      </div>
    );
  }

  const handleAddCopySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBarcode.trim()) {
      toast.warning('Ingrese un código de barras válido');
      return;
    }
    addCopyMutation.mutate({
      codigoBarras: newBarcode,
      estadoFisico: newPhysicalState,
      idLibro: id,
      idUbicacion: newLocationId ? Number(newLocationId) : undefined,
    });
  };

  const handleEditCopyClick = (copy: any) => {
    setSelectedCopyId(copy.idEdicionVolumen);
    setEditPhysicalState(copy.estadoFisico || 'Bueno');
    setEditAvailability(copy.disponibilidad || 'Disponible');
    setEditCopyOpen(true);
  };

  const handleEditCopySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCopyId) return;
    updateCopyMutation.mutate({
      copyId: selectedCopyId,
      data: {
        estadoFisico: editPhysicalState,
        disponibilidad: editAvailability,
      },
    });
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
              <Link href="/catalogo-admin" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Regresar al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <CardHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-semibold text-indigo-550 uppercase tracking-wider">{libro.categoria?.nombreCategoria}</span>
                <CardTitle className="text-2xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">{libro.titulo}</CardTitle>
              </div>
              <Link href={`/catalogo/editar/${libro.idLibro}`}>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 cursor-pointer">
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-zinc-400 block text-xs">ISBN</label>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{libro.isbn || '-'}</span>
              </div>
              <div>
                <label className="text-zinc-400 block text-xs">Año de Publicación</label>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{libro.anioPublicacion}</span>
              </div>
              <div>
                <label className="text-zinc-400 block text-xs">Edición</label>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{libro.edicion}</span>
              </div>
              <div>
                <label className="text-zinc-400 block text-xs">Idioma</label>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{libro.idioma?.nombreIdioma}</span>
              </div>
              <div className="col-span-2">
                <label className="text-zinc-400 block text-xs">Editorial</label>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">{libro.editorial?.nombre}</span>
              </div>
              <div className="col-span-2">
                <label className="text-zinc-400 block text-xs">Autores</label>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {libro.autores?.map((a) => a.nombre).join(', ') || '-'}
                </span>
              </div>
              <div className="col-span-2">
                <label className="text-zinc-400 block text-xs">Palabras Clave</label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {libro.palabrasClave?.map((pc) => (
                    <span key={pc.idPalabraClave} className="px-2 py-0.5 text-xs bg-zinc-100 text-zinc-705 dark:bg-zinc-800 dark:text-zinc-300 rounded-md">
                      {pc.palabra}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold">Estado de Inventario</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-zinc-150 dark:border-zinc-800">
              <span className="text-zinc-500">Ejemplares totales</span>
              <span className="font-bold text-lg text-zinc-900 dark:text-zinc-50">{libro.ejemplares?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-zinc-150 dark:border-zinc-800">
              <span className="text-zinc-500">Disponibles para préstamo</span>
              <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                {libro.ejemplares?.filter((e) => e.disponibilidad === 'Disponible').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-zinc-500">Prestados</span>
              <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                {libro.ejemplares?.filter((e) => e.disponibilidad === 'Prestado').length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Ejemplares Físicos</h2>
          <Button onClick={() => setAddCopyOpen(true)} className="h-8 px-3 gap-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium cursor-pointer border-0">
            <Plus className="w-4 h-4" />
            <span>Añadir Ejemplar</span>
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-505 font-semibold">
                <th className="p-4">Código de Barras</th>
                <th className="p-4">Estado Físico</th>
                <th className="p-4">Disponibilidad</th>
                <th className="p-4">Ubicación Física</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {!libro.ejemplares || libro.ejemplares.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-400">
                    Este libro no cuenta con ningún ejemplar registrado en inventario.
                  </td>
                </tr>
              ) : (
                libro.ejemplares.map((ejemplar) => (
                  <tr key={ejemplar.idEdicionVolumen} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4 font-mono font-medium">{ejemplar.codigoBarras || `ID: ${ejemplar.idEdicionVolumen}`}</td>
                    <td className="p-4">{ejemplar.estadoFisico || 'Bueno'}</td>
                    <td className="p-4">
                      <DisponibilidadBadge disponibilidad={ejemplar.disponibilidad} />
                    </td>
                    <td className="p-4 text-zinc-500">
                      {ejemplar.ubicacion
                        ? `Sección ${ejemplar.ubicacion.seccion || '-'}, Pasillo ${ejemplar.ubicacion.pasillo || '-'}, Estantería ${ejemplar.ubicacion.estanteria || '-'}`
                        : 'No asignada'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <ReservaButton idEdicionVolumen={ejemplar.idEdicionVolumen} disabled={ejemplar.disponibilidad !== 'Disponible'} />
                        <Button variant="outline" size="sm" onClick={() => handleEditCopyClick(ejemplar)} className="cursor-pointer">
                          Cambiar Estado
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={addCopyOpen} onOpenChange={setAddCopyOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleAddCopySubmit}>
            <DialogHeader>
              <DialogTitle>Añadir Ejemplar Físico</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Código de Barras *</label>
                <Input
                  placeholder="Ej. B001-A12"
                  value={newBarcode}
                  onChange={(e) => setNewBarcode(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Estado Físico</label>
                <NativeSelect value={newPhysicalState} onChange={(e) => setNewPhysicalState(e.target.value)}>
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="Malo">Malo</option>
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Ubicación Física</label>
                <NativeSelect value={newLocationId} onChange={(e) => setNewLocationId(Number(e.target.value))}>
                  <option value="0">Seleccionar ubicación...</option>
                  {locations?.map((loc) => (
                    <option key={loc.idUbicacion} value={loc.idUbicacion}>
                      Sección {loc.seccion}, Pasillo {loc.pasillo}, Estantería {loc.estanteria}
                    </option>
                  ))}
                </NativeSelect>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddCopyOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium border-0 cursor-pointer" disabled={addCopyMutation.isPending}>
                {addCopyMutation.isPending ? 'Guardando...' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editCopyOpen} onOpenChange={setEditCopyOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
          <form onSubmit={handleEditCopySubmit}>
            <DialogHeader>
              <DialogTitle>Actualizar Estado del Ejemplar</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Estado Físico</label>
                <NativeSelect value={editPhysicalState} onChange={(e) => setEditPhysicalState(e.target.value)}>
                  <option value="Bueno">Bueno</option>
                  <option value="Regular">Regular</option>
                  <option value="Malo">Malo</option>
                </NativeSelect>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Disponibilidad</label>
                <NativeSelect value={editAvailability} onChange={(e) => setEditAvailability(e.target.value)}>
                  <option value="Disponible">Disponible</option>
                  <option value="Prestado">Prestado</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Perdido">Perdido</option>
                </NativeSelect>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditCopyOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium border-0 cursor-pointer" disabled={updateCopyMutation.isPending}>
                {updateCopyMutation.isPending ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
