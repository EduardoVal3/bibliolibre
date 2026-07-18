'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/api/catalogo.api';
import { useRouter } from 'next/navigation';
import { LibroForm } from '@/components/catalogo/LibroForm';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NuevoLibroPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: any) => catalogoApi.createLibro(values),
    onSuccess: () => {
      toast.success('Libro registrado con éxito');
      queryClient.invalidateQueries({ queryKey: ['libros'] });
      router.push('/catalogo');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Error al registrar el libro');
    },
  });

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Regresar al catálogo
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Registrar Nuevo Libro</h1>
        <p className="text-zinc-500 text-sm">Ingrese los metadatos del libro para darlo de alta en el catálogo</p>
      </div>

      <LibroForm
        onSubmit={(values) => mutation.mutate(values)}
        isSubmitting={mutation.isPending}
      />
    </div>
  );
}
