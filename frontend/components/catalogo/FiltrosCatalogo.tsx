'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/api/catalogo.api';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { useState, useEffect } from 'react';

interface Filtros {
  q?: string;
  categoria?: number;
  editorial?: number;
  idioma?: number;
  autor?: number;
  disponibilidad?: string;
}

interface FiltrosCatalogoProps {
  onFiltersChange: (filtros: Filtros) => void;
}

export function FiltrosCatalogo({ onFiltersChange }: FiltrosCatalogoProps) {
  const [q, setQ] = useState('');
  const [categoria, setCategoria] = useState<number | undefined>(undefined);
  const [editorial, setEditorial] = useState<number | undefined>(undefined);
  const [idioma, setIdioma] = useState<number | undefined>(undefined);
  const [disponibilidad, setDisponibilidad] = useState<string | undefined>(undefined);

  const { data: categorias } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => catalogoApi.getCategorias(),
  });

  const { data: editoriales } = useQuery({
    queryKey: ['editoriales'],
    queryFn: () => catalogoApi.getEditoriales(),
  });

  const { data: idiomas } = useQuery({
    queryKey: ['idiomas'],
    queryFn: () => catalogoApi.getIdiomas(),
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onFiltersChange({
        q: q || undefined,
        categoria,
        editorial,
        idioma,
        disponibilidad: disponibilidad || undefined,
      });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [q, categoria, editorial, idioma, disponibilidad]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 shadow-sm">
      <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
        <label className="text-xs font-semibold text-zinc-500">Buscar libro</label>
        <Input
          placeholder="Título o ISBN..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500">Categoría</label>
        <NativeSelect
          value={categoria || ''}
          onChange={(e) => setCategoria(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas</option>
          {categorias?.map((cat) => (
            <option key={cat.idCategoria} value={cat.idCategoria}>
              {cat.nombreCategoria}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500">Editorial</label>
        <NativeSelect
          value={editorial || ''}
          onChange={(e) => setEditorial(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todas</option>
          {editoriales?.map((edit) => (
            <option key={edit.idEditorial} value={edit.idEditorial}>
              {edit.nombre}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500">Idioma</label>
        <NativeSelect
          value={idioma || ''}
          onChange={(e) => setIdioma(e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">Todos</option>
          {idiomas?.map((lang) => (
            <option key={lang.idIdioma} value={lang.idIdioma}>
              {lang.nombreIdioma}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-zinc-500">Disponibilidad</label>
        <NativeSelect
          value={disponibilidad || ''}
          onChange={(e) => setDisponibilidad(e.target.value)}
        >
          <option value="">Cualquiera</option>
          <option value="Disponible">Disponible</option>
          <option value="Prestado">Prestado</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </NativeSelect>
      </div>
    </div>
  );
}
