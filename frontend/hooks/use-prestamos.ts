'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prestamosApi } from '@/lib/api/prestamos.api';
import { toast } from 'sonner';
import { getStoredUser } from '@/lib/auth/auth';

export function usePrestamos(params?: { page?: number; pageSize?: number; usuario?: number; vencido?: string }) {
  return useQuery({
    queryKey: ['prestamos', params],
    queryFn: () => prestamosApi.getPrestamos(params),
  });
}

export function usePrestamo(id: number) {
  return useQuery({
    queryKey: ['prestamos', id],
    queryFn: () => prestamosApi.getPrestamoById(id),
    enabled: !!id,
  });
}

export function useCreatePrestamo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof prestamosApi.createPrestamo>[0]) => prestamosApi.createPrestamo(data),
    onSuccess: () => {
      toast.success('Préstamo registrado');
      qc.invalidateQueries({ queryKey: ['prestamos'] });
      qc.invalidateQueries({ queryKey: ['libro'] });
    },
    onError: (e: any) => toast.error(e.message || 'Error al crear préstamo'),
  });
}

export function useVencidos(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['prestamos-vencidos', params],
    queryFn: () => prestamosApi.getVencidos(params),
  });
}

export function useCreateDevolucion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof prestamosApi.createDevolucion>[0]) => prestamosApi.createDevolucion(data),
    onSuccess: () => {
      toast.success('Devolución registrada');
      qc.invalidateQueries({ queryKey: ['prestamos'] });
      qc.invalidateQueries({ queryKey: ['prestamos-vencidos'] });
      qc.invalidateQueries({ queryKey: ['libro'] });
    },
    onError: (e: any) => toast.error(e.message || 'Error al registrar devolución'),
  });
}

export function useCreateReserva() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof prestamosApi.createReserva>[0]) => prestamosApi.createReserva(data),
    onSuccess: () => {
      toast.success('Reserva creada');
      qc.invalidateQueries({ queryKey: ['reservas'] });
    },
    onError: (e: any) => toast.error(e.message || 'Error al crear reserva'),
  });
}

export function useReservas(params?: { page?: number; pageSize?: number; usuario?: number }) {
  return useQuery({
    queryKey: ['reservas', params],
    queryFn: () => prestamosApi.getReservas(params),
  });
}

export function useCancelReserva() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => prestamosApi.cancelReserva(id),
    onSuccess: () => {
      toast.success('Reserva cancelada');
      qc.invalidateQueries({ queryKey: ['reservas'] });
    },
    onError: (e: any) => toast.error(e.message || 'Error al cancelar reserva'),
  });
}

export function useHistorial(idUsuario: number, params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['historial-prestamos', idUsuario, params],
    queryFn: () => prestamosApi.getHistorial(idUsuario, params),
    enabled: !!idUsuario,
  });
}

export function useMisPrestamos(params?: { page?: number; pageSize?: number }) {
  const user = getStoredUser();
  return useQuery({
    queryKey: ['prestamos', 'mis', params],
    queryFn: () => prestamosApi.getPrestamos({ ...params, usuario: user?.sub }),
    enabled: !!user?.sub,
  });
}

export function useMisReservas(params?: { page?: number; pageSize?: number }) {
  const user = getStoredUser();
  return useQuery({
    queryKey: ['reservas', 'mis', params],
    queryFn: () => prestamosApi.getReservas({ ...params, usuario: user?.sub }),
    enabled: !!user?.sub,
  });
}
