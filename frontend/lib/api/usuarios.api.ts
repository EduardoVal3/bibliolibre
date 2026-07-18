import { apiClient } from './client';
import type {
  LoginRequest,
  LoginResponse,
  RegistroRequest,
  Usuario,
  VwUsuarioCompleto,
  Membresia,
  TipoUsuario,
  HistorialMembresia,
  PaginatedResponse,
  CrearOrdenResponse,
} from '@/types/usuarios.types';

export const usuariosApi = {
  auth: {
    login(data: LoginRequest) {
      return apiClient.post<LoginResponse>('/auth/login', data);
    },
    refresh(refreshToken: string) {
      return apiClient.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
    },
    registro(data: RegistroRequest) {
      return apiClient.post<Usuario>('/auth/registro', data);
    },
  },
  usuarios: {
    getMe() {
      return apiClient.get<Usuario>('/usuarios/me');
    },
    getAll(params?: { page?: number; pageSize?: number }) {
      return apiClient.get<PaginatedResponse<VwUsuarioCompleto>>('/usuarios', { params });
    },
    getById(id: number) {
      return apiClient.get<Usuario>(`/usuarios/${id}`);
    },
    update(id: number, data: Partial<Usuario>) {
      return apiClient.patch<Usuario>(`/usuarios/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/usuarios/${id}`);
    },
    getMembresias(id: number) {
      return apiClient.get<HistorialMembresia[]>(`/usuarios/${id}/membresias`);
    },
    addMembresia(id: number, idMembresia: number) {
      return apiClient.post<HistorialMembresia>(`/usuarios/${id}/membresias`, { idMembresia });
    },
  },
  membresias: {
    getAll() {
      return apiClient.get<Membresia[]>('/membresias');
    },
    getById(id: number) {
      return apiClient.get<Membresia>(`/membresias/${id}`);
    },
    create(data: Partial<Membresia>) {
      return apiClient.post<Membresia>('/membresias', data);
    },
    update(id: number, data: Partial<Membresia>) {
      return apiClient.put<Membresia>(`/membresias/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/membresias/${id}`);
    },
  },
  pagos: {
    getDisponibles() {
      return apiClient.get<Membresia[]>('/membresias/disponibles');
    },
    crearOrden(idMembresia: number) {
      return apiClient.post<CrearOrdenResponse>('/pagos-membresias/orden', { idMembresia });
    },
    capturarOrden(idOrdenExterna: string) {
      return apiClient.post<{ status: string; id: string }>(`/pagos-membresias/${idOrdenExterna}/capturar`);
    },
  },
  tiposUsuario: {
    getAll() {
      return apiClient.get<TipoUsuario[]>('/tipos-usuario');
    },
    getById(id: number) {
      return apiClient.get<TipoUsuario>(`/tipos-usuario/${id}`);
    },
    create(data: Partial<TipoUsuario>) {
      return apiClient.post<TipoUsuario>('/tipos-usuario', data);
    },
    update(id: number, data: Partial<TipoUsuario>) {
      return apiClient.put<TipoUsuario>(`/tipos-usuario/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/tipos-usuario/${id}`);
    },
  },
};
