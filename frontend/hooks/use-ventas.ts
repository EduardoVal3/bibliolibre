'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ventasApi } from '@/lib/api/ventas.api';
import { toast } from 'sonner';

export function useVentas(params?: { page?: number; pageSize?: number; empleado?: number }) {
  return useQuery({
    queryKey: ['ventas', params],
    queryFn: () => ventasApi.ventas.getAll(params),
  });
}

export function useVenta(id: number) {
  return useQuery({
    queryKey: ['ventas', id],
    queryFn: () => ventasApi.ventas.getById(id),
    enabled: !!id,
  });
}

export function useCreateVenta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof ventasApi.ventas.create>[0]) => ventasApi.ventas.create(data),
    onSuccess: () => {
      toast.success('Venta registrada');
      qc.invalidateQueries({ queryKey: ['ventas'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useProductosVenta() {
  return useQuery({
    queryKey: ['productos-venta'],
    queryFn: () => ventasApi.productosVenta.getAll(),
  });
}

export function useCreateProductoVenta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof ventasApi.productosVenta.create>[0]) => ventasApi.productosVenta.create(data),
    onSuccess: () => {
      toast.success('Producto creado');
      qc.invalidateQueries({ queryKey: ['productos-venta'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProductoVenta() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ventasApi.productosVenta.delete(id),
    onSuccess: () => {
      toast.success('Producto eliminado');
      qc.invalidateQueries({ queryKey: ['productos-venta'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useEmpleados() {
  return useQuery({
    queryKey: ['empleados'],
    queryFn: () => ventasApi.empleados.getAll(),
  });
}

export function useEmpleado(id: number) {
  return useQuery({
    queryKey: ['empleados', id],
    queryFn: () => ventasApi.empleados.getById(id),
    enabled: !!id,
  });
}

export function useCreateEmpleado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof ventasApi.empleados.create>[0]) => ventasApi.empleados.create(data),
    onSuccess: () => {
      toast.success('Empleado creado');
      qc.invalidateQueries({ queryKey: ['empleados'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteEmpleado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ventasApi.empleados.delete(id),
    onSuccess: () => {
      toast.success('Empleado eliminado');
      qc.invalidateQueries({ queryKey: ['empleados'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRolesEmpleado() {
  return useQuery({
    queryKey: ['roles-empleado'],
    queryFn: () => ventasApi.rolesEmpleado.getAll(),
  });
}

export function useCreateRolEmpleado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof ventasApi.rolesEmpleado.create>[0]) => ventasApi.rolesEmpleado.create(data),
    onSuccess: () => {
      toast.success('Rol creado');
      qc.invalidateQueries({ queryKey: ['roles-empleado'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteRolEmpleado() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ventasApi.rolesEmpleado.delete(id),
    onSuccess: () => {
      toast.success('Rol eliminado');
      qc.invalidateQueries({ queryKey: ['roles-empleado'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function usePermisos() {
  return useQuery({
    queryKey: ['permisos'],
    queryFn: () => ventasApi.permisos.getAll(),
  });
}

export function useCreatePermiso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof ventasApi.permisos.create>[0]) => ventasApi.permisos.create(data),
    onSuccess: () => {
      toast.success('Permiso creado');
      qc.invalidateQueries({ queryKey: ['permisos'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeletePermiso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ventasApi.permisos.delete(id),
    onSuccess: () => {
      toast.success('Permiso eliminado');
      qc.invalidateQueries({ queryKey: ['permisos'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useAssignPermiso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ idRol, idPermiso }: { idRol: number; idPermiso: number }) =>
      ventasApi.rolesEmpleado.assignPermiso(idRol, idPermiso),
    onSuccess: () => {
      toast.success('Permiso asignado al rol');
      qc.invalidateQueries({ queryKey: ['roles-empleado'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useMetodosPago() {
  return useQuery({
    queryKey: ['metodos-pago'],
    queryFn: () => ventasApi.metodosPago.getAll(),
  });
}

export function useTurnos() {
  return useQuery({
    queryKey: ['turnos'],
    queryFn: () => ventasApi.turnos.getAll(),
  });
}

export function useReporteVentasPorEmpleado() {
  return useQuery({
    queryKey: ['reportes', 'ventas-por-empleado'],
    queryFn: () => ventasApi.reportes.ventasPorEmpleado(),
  });
}
