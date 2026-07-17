'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { Presupuesto } from '@/types/proveedores.types';

const schema = z.object({
  anio: z.coerce.number().int().min(2000, 'Año inválido'),
  montoAsignado: z.coerce.number().min(0, 'El monto debe ser positivo'),
});

type FormValues = z.infer<typeof schema>;

interface PresupuestoFormProps {
  initialValues?: Partial<Presupuesto>;
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function PresupuestoForm({ initialValues, onSubmit, isSubmitting }: PresupuestoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      anio: initialValues?.anio || new Date().getFullYear(),
      montoAsignado: initialValues?.montoAsignado || 0,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="anio">Año *</Label>
        <Input id="anio" type="number" {...register('anio')} />
        {errors.anio && <p className="text-xs text-rose-500">{errors.anio.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="montoAsignado">Monto Asignado *</Label>
        <Input id="montoAsignado" type="number" step="0.01" {...register('montoAsignado')} />
        {errors.montoAsignado && <p className="text-xs text-rose-500">{errors.montoAsignado.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        {initialValues ? 'Actualizar' : 'Crear'} Presupuesto
      </Button>
    </form>
  );
}
