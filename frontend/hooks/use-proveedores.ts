'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proveedoresApi } from '@/lib/api/proveedores.api';
import { toast } from 'sonner';

export function useProveedores(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['proveedores', params],
    queryFn: () => proveedoresApi.proveedores.getAll(params),
  });
}

export function useProveedor(id: number) {
  return useQuery({
    queryKey: ['proveedores', id],
    queryFn: () => proveedoresApi.proveedores.getById(id),
    enabled: !!id,
  });
}

export function useCreateProveedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => proveedoresApi.proveedores.create(data),
    onSuccess: () => { toast.success('Proveedor creado'); qc.invalidateQueries({ queryKey: ['proveedores'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al crear'),
  });
}

export function useUpdateProveedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => proveedoresApi.proveedores.update(id, data),
    onSuccess: () => { toast.success('Proveedor actualizado'); qc.invalidateQueries({ queryKey: ['proveedores'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al actualizar'),
  });
}

export function useDeleteProveedor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => proveedoresApi.proveedores.delete(id),
    onSuccess: () => { toast.success('Proveedor eliminado'); qc.invalidateQueries({ queryKey: ['proveedores'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al eliminar'),
  });
}

export function usePresupuestos(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['presupuestos', params],
    queryFn: () => proveedoresApi.presupuestos.getAll(params),
  });
}

export function usePresupuesto(id: number) {
  return useQuery({
    queryKey: ['presupuestos', id],
    queryFn: () => proveedoresApi.presupuestos.getById(id),
    enabled: !!id,
  });
}

export function usePresupuestoEjecucion(id: number) {
  return useQuery({
    queryKey: ['presupuestos', id, 'ejecucion'],
    queryFn: () => proveedoresApi.presupuestos.getEjecucion(id),
    enabled: !!id,
  });
}

export function useCreatePresupuesto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => proveedoresApi.presupuestos.create(data),
    onSuccess: () => { toast.success('Presupuesto creado'); qc.invalidateQueries({ queryKey: ['presupuestos'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al crear'),
  });
}

export function useUpdatePresupuesto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => proveedoresApi.presupuestos.update(id, data),
    onSuccess: () => { toast.success('Presupuesto actualizado'); qc.invalidateQueries({ queryKey: ['presupuestos'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al actualizar'),
  });
}

export function useDeletePresupuesto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => proveedoresApi.presupuestos.delete(id),
    onSuccess: () => { toast.success('Presupuesto eliminado'); qc.invalidateQueries({ queryKey: ['presupuestos'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al eliminar'),
  });
}

export function useOrdenesCompra(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['ordenes-compra', params],
    queryFn: () => proveedoresApi.ordenesCompra.getAll(params),
  });
}

export function useOrdenCompra(id: number) {
  return useQuery({
    queryKey: ['ordenes-compra', id],
    queryFn: () => proveedoresApi.ordenesCompra.getById(id),
    enabled: !!id,
  });
}

export function useCreateOrdenCompra() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => proveedoresApi.ordenesCompra.create(data),
    onSuccess: () => { toast.success('Orden de compra creada'); qc.invalidateQueries({ queryKey: ['ordenes-compra'] }); },
    onError: (e: any) => toast.error(e.message || 'Error al crear orden'),
  });
}
