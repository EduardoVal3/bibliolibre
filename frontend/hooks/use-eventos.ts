'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventosApi } from '@/lib/api/eventos.api';
import { toast } from 'sonner';

export function useEventos(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['eventos', params],
    queryFn: () => eventosApi.getAll(params),
  });
}

export function useEvento(id: number) {
  return useQuery({
    queryKey: ['eventos', id],
    queryFn: () => eventosApi.getById(id),
    enabled: !!id,
  });
}

export function useCupo(id: number) {
  return useQuery({
    queryKey: ['eventos', id, 'cupo'],
    queryFn: () => eventosApi.getCupo(id),
    enabled: !!id,
  });
}

export function useCreateEvento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof eventosApi.create>[0]) => eventosApi.create(data),
    onSuccess: () => {
      toast.success('Evento creado');
      qc.invalidateQueries({ queryKey: ['eventos'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateEvento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof eventosApi.update>[1] }) =>
      eventosApi.update(id, data),
    onSuccess: () => {
      toast.success('Evento actualizado');
      qc.invalidateQueries({ queryKey: ['eventos'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteEvento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventosApi.remove(id),
    onSuccess: () => {
      toast.success('Evento eliminado');
      qc.invalidateQueries({ queryKey: ['eventos'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useInscribir() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => eventosApi.inscribir(id),
    onSuccess: () => {
      toast.success('Inscripción exitosa');
      qc.invalidateQueries({ queryKey: ['eventos'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useMarcarAsistencia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idEvento, idUsuario, data }: { idEvento: number; idUsuario: number; data: Parameters<typeof eventosApi.marcarAsistencia>[2] }) =>
      eventosApi.marcarAsistencia(idEvento, idUsuario, data),
    onSuccess: () => {
      toast.success('Asistencia marcada');
      qc.invalidateQueries({ queryKey: ['eventos'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
