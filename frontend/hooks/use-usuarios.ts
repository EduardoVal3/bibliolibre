'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '@/lib/api/usuarios.api';
import { toast } from 'sonner';

export function useUsuarios(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['usuarios', params],
    queryFn: () => usuariosApi.usuarios.getAll(params),
  });
}

export function useUsuario(id: number) {
  return useQuery({
    queryKey: ['usuarios', id],
    queryFn: () => usuariosApi.usuarios.getById(id),
    enabled: !!id,
  });
}

export function useDeleteUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usuariosApi.usuarios.delete(id),
    onSuccess: () => {
      toast.success('Usuario eliminado');
      qc.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (e: any) => toast.error(e.message || 'Error al eliminar'),
  });
}

export function useMembresias() {
  return useQuery({
    queryKey: ['membresias'],
    queryFn: () => usuariosApi.membresias.getAll(),
  });
}

export function useTiposUsuario() {
  return useQuery({
    queryKey: ['tipos-usuario'],
    queryFn: () => usuariosApi.tiposUsuario.getAll(),
  });
}

export function useHistorialMembresias(idUsuario: number) {
  return useQuery({
    queryKey: ['usuarios', idUsuario, 'membresias'],
    queryFn: () => usuariosApi.usuarios.getMembresias(idUsuario),
    enabled: !!idUsuario,
  });
}
