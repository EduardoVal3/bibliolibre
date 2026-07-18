'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/api/catalogo.api';
import { useRouter, useParams } from 'next/navigation';
import { LibroForm } from '@/components/catalogo/LibroForm';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditarLibroPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const id = Number(params.id);

  const { data: libro, isLoading, error } = useQuery({
    queryKey: ['libro', id],
    queryFn: () => catalogoApi.getLibroById(id),
  });

  const mutation = useMutation({
    mutationFn: (values: any) => catalogoApi.updateLibro(id, values),
    onSuccess: () => {
      toast.success('Libro actualizado con éxito');
      queryClient.invalidateQueries({ queryKey: ['libros'] });
      queryClient.invalidateQueries({ queryKey: ['libro', id] });
      router.push(`/catalogo/${id}`);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al actualizar el libro');
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 flex-1">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !libro) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-rose-500">Error al cargar libro</h2>
        <p className="text-zinc-500">El libro solicitado no existe o no se pudo cargar.</p>
        <Link href="/catalogo">
          <Button variant="outline">Regresar al catálogo</Button>
        </Link>
      </div>
    );
  }

  const initialValues = {
    titulo: libro.titulo,
    isbn: libro.isbn || '',
    anioPublicacion: libro.anioPublicacion,
    edicion: libro.edicion,
    idEditorial: libro.idEditorial,
    idCategoria: libro.idCategoria,
    idIdioma: libro.idIdioma,
    autores: libro.autores?.map((a) => a.idAutor) || [],
    palabrasClave: libro.palabrasClave?.map((pc) => pc.idPalabraClave) || [],
  };

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <Link href={`/catalogo/${id}`} className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Regresar al detalle del libro
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Editar Libro</h1>
        <p className="text-zinc-500 text-sm">Modifique los metadatos del libro en el catálogo</p>
      </div>

      <LibroForm
        initialValues={initialValues}
        onSubmit={(values) => mutation.mutate(values)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
