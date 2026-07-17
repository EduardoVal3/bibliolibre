'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { RecursoDigital } from '@/types/recursos-digitales.types';

const schema = z.object({
  titulo: z.string().min(1, 'El título es obligatorio'),
  tipoRecurso: z.string().optional(),
  formato: z.string().optional(),
  urlAcceso: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RecursoDigitalFormProps {
  initialValues?: Partial<RecursoDigital>;
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function RecursoDigitalForm({ initialValues, onSubmit, isSubmitting }: RecursoDigitalFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      titulo: initialValues?.titulo || '',
      tipoRecurso: initialValues?.tipoRecurso || '',
      formato: initialValues?.formato || '',
      urlAcceso: initialValues?.urlAcceso || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="titulo">Título *</Label>
        <Input id="titulo" {...register('titulo')} />
        {errors.titulo && <p className="text-xs text-rose-500">{errors.titulo.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipoRecurso">Tipo de recurso</Label>
        <Input id="tipoRecurso" placeholder="Ej: Libro electrónico, Video, Audio" {...register('tipoRecurso')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="formato">Formato</Label>
        <Input id="formato" placeholder="Ej: PDF, EPUB, MP4" {...register('formato')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="urlAcceso">URL de acceso</Label>
        <Input id="urlAcceso" placeholder="https://..." {...register('urlAcceso')} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {initialValues ? 'Actualizar' : 'Crear'} Recurso
      </Button>
    </form>
  );
}
