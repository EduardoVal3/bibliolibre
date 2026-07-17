'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Proveedor } from '@/types/proveedores.types';

const schema = z.object({
  nombreEmpresa: z.string().min(1, 'El nombre de la empresa es obligatorio'),
  contacto: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().email('Correo inválido').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface ProveedorFormProps {
  initialValues?: Partial<Proveedor>;
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function ProveedorForm({ initialValues, onSubmit, isSubmitting }: ProveedorFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombreEmpresa: initialValues?.nombreEmpresa || '',
      contacto: initialValues?.contacto || '',
      telefono: initialValues?.telefono || '',
      correo: initialValues?.correo || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombreEmpresa">Nombre de la empresa *</Label>
        <Input id="nombreEmpresa" {...register('nombreEmpresa')} />
        {errors.nombreEmpresa && <p className="text-xs text-rose-500">{errors.nombreEmpresa.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="contacto">Contacto</Label>
        <Input id="contacto" {...register('contacto')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input id="telefono" {...register('telefono')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="correo">Correo</Label>
        <Input id="correo" type="email" {...register('correo')} />
        {errors.correo && <p className="text-xs text-rose-500">{errors.correo.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {initialValues ? 'Actualizar' : 'Crear'} Proveedor
      </Button>
    </form>
  );
}
