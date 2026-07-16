import { apiClient } from './client';
import {
  Libro,
  Autor,
  Categoria,
  Editorial,
  Idioma,
  EdicionVolumen,
  VwCatalogoLibro,
  PaginatedResponse,
  PalabraClave,
  UbicacionFisica,
} from '@/types/catalogo.types';

export const catalogoApi = {
  // Libros
  getLibros(params?: {
    page?: number;
    pageSize?: number;
    categoria?: number;
    idioma?: number;
    editorial?: number;
    autor?: number;
    palabraClave?: number;
    disponibilidad?: string;
    q?: string;
  }) {
    return apiClient.get<PaginatedResponse<Libro>>('/libros', { params });
  },

  getCatalogoCompleto(params?: { page?: number; pageSize?: number }) {
    return apiClient.get<PaginatedResponse<VwCatalogoLibro>>('/libros/catalogo-completo', { params });
  },

  getLibroById(id: number) {
    return apiClient.get<Libro>(`/libros/${id}`);
  },

  getPalabrasClave() {
    return apiClient.get<PalabraClave[]>('/libros/palabras-clave');
  },

  createLibro(data: any) {
    return apiClient.post<Libro>('/libros', data);
  },

  updateLibro(id: number, data: any) {
    return apiClient.put<Libro>(`/libros/${id}`, data);
  },

  deleteLibro(id: number) {
    return apiClient.delete<{ message: string }>(`/libros/${id}`);
  },

  // Autores
  getAutores() {
    return apiClient.get<Autor[]>('/autores');
  },

  createAutor(data: Partial<Autor>) {
    return apiClient.post<Autor>('/autores', data);
  },

  updateAutor(id: number, data: Partial<Autor>) {
    return apiClient.put<Autor>(`/autores/${id}`, data);
  },

  deleteAutor(id: number) {
    return apiClient.delete<{ message: string }>(`/autores/${id}`);
  },

  // Categorias
  getCategorias() {
    return apiClient.get<Categoria[]>('/categorias');
  },

  createCategoria(data: Partial<Categoria>) {
    return apiClient.post<Categoria>('/categorias', data);
  },

  updateCategoria(id: number, data: Partial<Categoria>) {
    return apiClient.put<Categoria>(`/categorias/${id}`, data);
  },

  deleteCategoria(id: number) {
    return apiClient.delete<{ message: string }>(`/categorias/${id}`);
  },

  // Editoriales
  getEditoriales() {
    return apiClient.get<Editorial[]>('/editoriales');
  },

  createEditorial(data: Partial<Editorial>) {
    return apiClient.post<Editorial>('/editoriales', data);
  },

  updateEditorial(id: number, data: Partial<Editorial>) {
    return apiClient.put<Editorial>(`/editoriales/${id}`, data);
  },

  deleteEditorial(id: number) {
    return apiClient.delete<{ message: string }>(`/editoriales/${id}`);
  },

  // Idiomas
  getIdiomas() {
    return apiClient.get<Idioma[]>('/idiomas');
  },

  createIdioma(data: Partial<Idioma>) {
    return apiClient.post<Idioma>('/idiomas', data);
  },

  updateIdioma(id: number, data: Partial<Idioma>) {
    return apiClient.put<Idioma>(`/idiomas/${id}`, data);
  },

  deleteIdioma(id: number) {
    return apiClient.delete<{ message: string }>(`/idiomas/${id}`);
  },

  // Ejemplares
  getEjemplarByBarcode(barcode: string) {
    return apiClient.get<EdicionVolumen>(`/ejemplares/${barcode}`);
  },

  createEjemplar(data: { codigoBarras: string; estadoFisico: string; idLibro: number; idUbicacion?: number }) {
    return apiClient.post<EdicionVolumen>('/ejemplares', data);
  },

  updateEjemplarEstado(id: number, data: { estadoFisico?: string; disponibilidad?: string }) {
    return apiClient.patch<EdicionVolumen>(`/ejemplares/${id}/estado`, data);
  },

  getUbicaciones() {
    return apiClient.get<UbicacionFisica[]>('/ejemplares/ubicaciones');
  },
};
