'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recursosDigitalesApi } from '@/lib/api/recursos-digitales.api';
import { toast } from 'sonner';

export function useRecursos(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['recursos-digitales', params],
    queryFn: () => recursosDigitalesApi.recursos.getAll(params),
  });
}

export function useRecurso(id: number) {
  return useQuery({
    queryKey: ['recursos-digitales', id],
    queryFn: () => recursosDigitalesApi.recursos.getById(id),
    enabled: !!id,
  });
}

export function useMasDescargados() {
  return useQuery({
    queryKey: ['recursos-digitales', 'mas-descargados'],
    queryFn: () => recursosDigitalesApi.recursos.getMasDescargados(),
  });
}

export function useRegistrarAcceso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { tipoAccion: string } }) =>
      recursosDigitalesApi.recursos.registrarAcceso(id, data),
    onSuccess: () => {
      toast.success('Acceso registrado');
      qc.invalidateQueries({ queryKey: ['recursos-digitales', 'mas-descargados'] });
    },
    onError: (e: any) => toast.error(e.message || 'Error al registrar acceso'),
  });
}

export function useCreateRecurso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => recursosDigitalesApi.recursos.create(data),
    onSuccess: () => { toast.success('Recurso creado'); qc.invalidateQueries({ queryKey: ['recursos-digitales'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al crear'),
  });
}

export function useUpdateRecurso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => recursosDigitalesApi.recursos.update(id, data),
    onSuccess: () => { toast.success('Recurso actualizado'); qc.invalidateQueries({ queryKey: ['recursos-digitales'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al actualizar'),
  });
}

export function useDeleteRecurso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => recursosDigitalesApi.recursos.delete(id),
    onSuccess: () => { toast.success('Recurso eliminado'); qc.invalidateQueries({ queryKey: ['recursos-digitales'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al eliminar'),
  });
}

export function useDispositivos() {
  return useQuery({
    queryKey: ['dispositivos'],
    queryFn: () => recursosDigitalesApi.dispositivos.getAll(),
  });
}

export function useDispositivo(id: number) {
  return useQuery({
    queryKey: ['dispositivos', id],
    queryFn: () => recursosDigitalesApi.dispositivos.getById(id),
    enabled: !!id,
  });
}

export function useCreateDispositivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => recursosDigitalesApi.dispositivos.create(data),
    onSuccess: () => { toast.success('Dispositivo registrado'); qc.invalidateQueries({ queryKey: ['dispositivos'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al crear'),
  });
}

export function useUpdateDispositivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => recursosDigitalesApi.dispositivos.update(id, data),
    onSuccess: () => { toast.success('Dispositivo actualizado'); qc.invalidateQueries({ queryKey: ['dispositivos'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al actualizar'),
  });
}

export function usePrestarDispositivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { idUsuario: number; fechaLimiteDevolucion?: string } }) =>
      recursosDigitalesApi.dispositivos.prestar(id, data),
    onSuccess: () => { toast.success('Dispositivo prestado'); qc.invalidateQueries({ queryKey: ['dispositivos'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al prestar'),
  });
}

export function useDevolverDispositivo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => recursosDigitalesApi.dispositivos.devolver(id),
    onSuccess: () => { toast.success('Dispositivo devuelto'); qc.invalidateQueries({ queryKey: ['dispositivos'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al devolver'),
  });
}

export function usePrestamosDispositivo(id: number) {
  return useQuery({
    queryKey: ['dispositivos', id, 'prestamos'],
    queryFn: () => recursosDigitalesApi.dispositivos.prestamos(id),
    enabled: !!id,
  });
}
