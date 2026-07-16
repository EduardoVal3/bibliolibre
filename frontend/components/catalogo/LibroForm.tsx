'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/api/catalogo.api';
import { Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const schema = z.object({
  titulo: z.string().min(1, 'El título es obligatorio'),
  isbn: z.string().refine((val) => {
    if (!val) return true;
    const clean = val.replace(/[- ]/g, '');
    return clean.length === 10 || clean.length === 13;
  }, 'El ISBN debe tener 10 o 13 dígitos'),
  anioPublicacion: z.number().int().min(1000, 'Año inválido').max(new Date().getFullYear(), 'El año no puede ser en el futuro'),
  edicion: z.string().min(1, 'La edición es obligatoria'),
  idEditorial: z.number().int().min(1, 'Seleccione una editorial'),
  idCategoria: z.number().int().min(1, 'Seleccione una categoría'),
  idIdioma: z.number().int().min(1, 'Seleccione un idioma'),
  autores: z.array(z.number()).min(1, 'Debe seleccionar al menos un autor'),
  palabrasClave: z.array(z.number()).min(1, 'Debe seleccionar al menos una palabra clave'),
});

type FormValues = z.infer<typeof schema>;

interface LibroFormProps {
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function LibroForm({ initialValues, onSubmit, isSubmitting }: LibroFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: initialValues?.titulo || '',
      isbn: initialValues?.isbn || '',
      anioPublicacion: initialValues?.anioPublicacion || new Date().getFullYear(),
      edicion: initialValues?.edicion || '',
      idEditorial: initialValues?.idEditorial || 0,
      idCategoria: initialValues?.idCategoria || 0,
      idIdioma: initialValues?.idIdioma || 0,
      autores: initialValues?.autores || [],
      palabrasClave: initialValues?.palabrasClave || [],
    },
  });

  const { data: categorias } = useQuery({ queryKey: ['categorias'], queryFn: () => catalogoApi.getCategorias() });
  const { data: editoriales } = useQuery({ queryKey: ['editoriales'], queryFn: () => catalogoApi.getEditoriales() });
  const { data: idiomas } = useQuery({ queryKey: ['idiomas'], queryFn: () => catalogoApi.getIdiomas() });
  const { data: autores } = useQuery({ queryKey: ['autores'], queryFn: () => catalogoApi.getAutores() });
  const { data: palabrasClave } = useQuery({ queryKey: ['palabrasClave'], queryFn: () => catalogoApi.getPalabrasClave() });

  const selectedAutores = watch('autores') || [];
  const selectedPalabrasClave = watch('palabrasClave') || [];

  const handleToggleAutor = (id: number) => {
    if (selectedAutores.includes(id)) {
      setValue('autores', selectedAutores.filter((aId) => aId !== id), { shouldValidate: true });
    } else {
      setValue('autores', [...selectedAutores, id], { shouldValidate: true });
    }
  };

  const handleTogglePalabra = (id: number) => {
    if (selectedPalabrasClave.includes(id)) {
      setValue('palabrasClave', selectedPalabrasClave.filter((pId) => pId !== id), { shouldValidate: true });
    } else {
      setValue('palabrasClave', [...selectedPalabrasClave, id], { shouldValidate: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Título del Libro *</label>
          <Input placeholder="Ej. Don Quijote de la Mancha" {...register('titulo')} />
          {errors.titulo && <span className="text-xs text-rose-500">{errors.titulo.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">ISBN</label>
          <Input placeholder="Ej. 9788491050297" {...register('isbn')} />
          {errors.isbn && <span className="text-xs text-rose-500">{errors.isbn.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Año de Publicación *</label>
          <Input type="number" placeholder="Ej. 1605" {...register('anioPublicacion', { valueAsNumber: true })} />
          {errors.anioPublicacion && <span className="text-xs text-rose-500">{errors.anioPublicacion.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Edición *</label>
          <Input placeholder="Ej. Conmemorativa" {...register('edicion')} />
          {errors.edicion && <span className="text-xs text-rose-500">{errors.edicion.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Idioma *</label>
          <NativeSelect {...register('idIdioma', { valueAsNumber: true })}>
            <option value="0">Seleccionar idioma...</option>
            {idiomas?.map((i) => (
              <option key={i.idIdioma} value={i.idIdioma}>{i.nombreIdioma}</option>
            ))}
          </NativeSelect>
          {errors.idIdioma && <span className="text-xs text-rose-500">{errors.idIdioma.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Categoría *</label>
          <NativeSelect {...register('idCategoria', { valueAsNumber: true })}>
            <option value="0">Seleccionar categoría...</option>
            {categorias?.map((c) => (
              <option key={c.idCategoria} value={c.idCategoria}>{c.nombreCategoria}</option>
            ))}
          </NativeSelect>
          {errors.idCategoria && <span className="text-xs text-rose-500">{errors.idCategoria.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Editorial *</label>
          <NativeSelect {...register('idEditorial', { valueAsNumber: true })}>
            <option value="0">Seleccionar editorial...</option>
            {editoriales?.map((e) => (
              <option key={e.idEditorial} value={e.idEditorial}>{e.nombre}</option>
            ))}
          </NativeSelect>
          {errors.idEditorial && <span className="text-xs text-rose-500">{errors.idEditorial.message}</span>}
        </div>

        {/* Autores selector */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Autores *</label>
          <div className="flex flex-wrap gap-1.5 p-2 min-h-10 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-850/10">
            {selectedAutores.length === 0 ? (
              <span className="text-sm text-zinc-400 self-center">Haz clic en los autores de abajo para asociarlos</span>
            ) : (
              selectedAutores.map((id) => {
                const autor = autores?.find((a) => a.idAutor === id);
                return (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1 bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                    {autor?.nombre || `Autor #${id}`}
                    <X className="w-3.5 h-3.5 cursor-pointer text-zinc-400 hover:text-zinc-650" onClick={() => handleToggleAutor(id)} />
                  </Badge>
                );
              })
            )}
          </div>
          <div className="max-h-36 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 flex flex-wrap gap-1.5">
            {autores?.map((autor) => {
              const isSelected = selectedAutores.includes(autor.idAutor);
              return (
                <button
                  type="button"
                  key={autor.idAutor}
                  onClick={() => handleToggleAutor(autor.idAutor)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  {autor.nombre}
                </button>
              );
            })}
          </div>
          {errors.autores && <span className="text-xs text-rose-500">{errors.autores.message}</span>}
        </div>

        {/* Palabras Clave selector */}
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Palabras Clave *</label>
          <div className="flex flex-wrap gap-1.5 p-2 min-h-10 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-850/10">
            {selectedPalabrasClave.length === 0 ? (
              <span className="text-sm text-zinc-400 self-center">Haz clic en las palabras clave de abajo para asociarlas</span>
            ) : (
              selectedPalabrasClave.map((id) => {
                const palabra = palabrasClave?.find((p) => p.idPalabraClave === id);
                return (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1 bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                    {palabra?.palabra || `Palabra #${id}`}
                    <X className="w-3.5 h-3.5 cursor-pointer text-zinc-400 hover:text-zinc-650" onClick={() => handleTogglePalabra(id)} />
                  </Badge>
                );
              })
            )}
          </div>
          <div className="max-h-36 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg p-2 flex flex-wrap gap-1.5">
            {palabrasClave?.map((palabra) => {
              const isSelected = selectedPalabrasClave.includes(palabra.idPalabraClave);
              return (
                <button
                  type="button"
                  key={palabra.idPalabraClave}
                  onClick={() => handleTogglePalabra(palabra.idPalabraClave)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  {palabra.palabra}
                </button>
              );
            })}
          </div>
          {errors.palabrasClave && <span className="text-xs text-rose-500">{errors.palabrasClave.message}</span>}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="min-w-28 bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </div>
    </form>
  );
}
