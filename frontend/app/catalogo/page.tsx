'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/api/catalogo.api';
import { FiltrosCatalogo } from '@/components/catalogo/FiltrosCatalogo';
import { LibroCard } from '@/components/catalogo/LibroCard';
import { LibroTable } from '@/components/catalogo/LibroTable';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, Grid, List } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { VwCatalogoLibro } from '@/types/catalogo.types';

export default function CatalogoPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<any>({});

  const { data, isLoading } = useQuery({
    queryKey: ['libros', { page, ...filters }],
    queryFn: () =>
      catalogoApi.getLibros({
        page,
        pageSize: 12,
        ...filters,
      }),
  });

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
    setPage(1);
  };

  const mappedLibros: VwCatalogoLibro[] = data?.data?.map((libro) => ({
    idLibro: libro.idLibro,
    titulo: libro.titulo,
    isbn: libro.isbn || '',
    anioPublicacion: libro.anioPublicacion || 0,
    edicion: libro.edicion || '',
    editorial: libro.editorial?.nombre || '',
    categoria: libro.categoria?.nombreCategoria || '',
    idioma: libro.idioma?.nombreIdioma || '',
    autores: libro.autores?.map((a) => a.nombre).join(', ') || '',
    totalEjemplares: libro.ejemplares?.length || 0,
    ejemplaresDisponibles: libro.ejemplares?.filter((e) => e.disponibilidad === 'Disponible').length || 0,
  })) || [];

  const totalPages = data?.meta?.total ? Math.ceil(data.meta.total / 12) : 1;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Catálogo de Libros</h1>
          <p className="text-zinc-500 text-sm">Gestiona el inventario y consulta disponibilidad de libros</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 flex bg-white dark:bg-zinc-900 shadow-sm">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              className="h-8 px-3 gap-1.5 cursor-pointer"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
              <span>Tarjeta</span>
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              className="h-8 px-3 gap-1.5 cursor-pointer"
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4" />
              <span>Tabla</span>
            </Button>
          </div>
          <Link href="/catalogo/nuevo" passHref>
            <Button className="h-9 px-4 gap-1.5 bg-indigo-655 hover:bg-indigo-700 text-white font-medium shadow-sm cursor-pointer border-0">
              <Plus className="w-4 h-4" />
              <span>Nuevo Libro</span>
            </Button>
          </Link>
        </div>
      </div>

      <FiltrosCatalogo onFiltersChange={handleFiltersChange} />

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : viewMode === 'grid' ? (
        mappedLibros.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 text-zinc-400">
            No se encontraron libros con los filtros seleccionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mappedLibros.map((libro) => (
              <LibroCard key={libro.idLibro} libro={libro} />
            ))}
          </div>
        )
      ) : (
        <LibroTable libros={mappedLibros} />
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer"
          >
            Anterior
          </Button>
          <span className="text-xs text-zinc-500 font-medium">
            Página {page} de {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
