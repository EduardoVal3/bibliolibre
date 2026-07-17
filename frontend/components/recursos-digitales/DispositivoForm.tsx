'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { DispositivoPrestado } from '@/types/recursos-digitales.types';

const schema = z.object({
  nombreDispositivo: z.string().min(1, 'El nombre es obligatorio'),
  tipoDispositivo: z.string().optional(),
  numeroSerie: z.string().optional(),
  estado: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface DispositivoFormProps {
  initialValues?: Partial<DispositivoPrestado>;
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function DispositivoForm({ initialValues, onSubmit, isSubmitting }: DispositivoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombreDispositivo: initialValues?.nombreDispositivo || '',
      tipoDispositivo: initialValues?.tipoDispositivo || '',
      numeroSerie: initialValues?.numeroSerie || '',
      estado: initialValues?.estado || 'Disponible',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombreDispositivo">Nombre del dispositivo *</Label>
        <Input id="nombreDispositivo" {...register('nombreDispositivo')} />
        {errors.nombreDispositivo && <p className="text-xs text-rose-500">{errors.nombreDispositivo.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="tipoDispositivo">Tipo</Label>
        <Input id="tipoDispositivo" placeholder="Ej: Tablet, Laptop, Kindle" {...register('tipoDispositivo')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="numeroSerie">Número de serie</Label>
        <Input id="numeroSerie" {...register('numeroSerie')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="estado">Estado</Label>
        <Input id="estado" {...register('estado')} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {initialValues ? 'Actualizar' : 'Registrar'} Dispositivo
      </Button>
    </form>
  );
}
