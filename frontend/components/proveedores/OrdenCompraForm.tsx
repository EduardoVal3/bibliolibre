'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Loader2, Plus, Trash } from 'lucide-react';
import { useProveedores } from '@/hooks/use-proveedores';
import type { Proveedor } from '@/types/proveedores.types';

const detalleSchema = z.object({
  cantidad: z.coerce.number().int().min(1, 'Mínimo 1'),
  precioUnitario: z.coerce.number().min(0.01, 'Debe ser > 0'),
});

const schema = z.object({
  idProveedor: z.coerce.number().int().min(1, 'Seleccione un proveedor'),
  idPresupuesto: z.coerce.number().int().optional().or(z.literal(0)),
  detalles: z.array(detalleSchema).min(1, 'Agregue al menos un detalle'),
});

type FormValues = z.infer<typeof schema>;

interface OrdenCompraFormProps {
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
}

export function OrdenCompraForm({ onSubmit, isSubmitting }: OrdenCompraFormProps) {
  const { data: proveedoresData } = useProveedores();
  const proveedores = (proveedoresData?.data || []) as Proveedor[];

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { idProveedor: undefined as any, idPresupuesto: 0, detalles: [{ cantidad: 1, precioUnitario: 0 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'detalles' });
  const detalles = watch('detalles');
  const total = (detalles || []).reduce((sum, d) => sum + (d.cantidad || 0) * (d.precioUnitario || 0), 0);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="idProveedor">Proveedor *</Label>
        <NativeSelect id="idProveedor" {...register('idProveedor')}>
          <option value="">Seleccione un proveedor</option>
          {proveedores.map((p) => (
            <option key={p.idProveedor} value={p.idProveedor}>{p.nombreEmpresa}</option>
          ))}
        </NativeSelect>
        {errors.idProveedor && <p className="text-xs text-rose-500">{errors.idProveedor.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Detalles *</Label>
          <Button type="button" size="sm" variant="outline" onClick={() => append({ cantidad: 1, precioUnitario: 0 })} className="cursor-pointer gap-1">
            <Plus className="w-3 h-3" /> Agregar fila
          </Button>
        </div>
        {errors.detalles && <p className="text-xs text-rose-500">{errors.detalles.message || errors.detalles.root?.message}</p>}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                <th className="text-left px-3 py-2 font-medium text-zinc-500">Cantidad</th>
                <th className="text-left px-3 py-2 font-medium text-zinc-500">Precio Unitario</th>
                <th className="text-right px-3 py-2 font-medium text-zinc-500">Subtotal</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {fields.map((field, i) => {
                const sub = (watch(`detalles.${i}.cantidad`) || 0) * (watch(`detalles.${i}.precioUnitario`) || 0);
                return (
                  <tr key={field.id} className="border-t border-zinc-100 dark:border-zinc-800">
                    <td className="px-2 py-1">
                      <Input type="number" min={1} className="h-9" {...register(`detalles.${i}.cantidad`)} />
                    </td>
                    <td className="px-2 py-1">
                      <Input type="number" step="0.01" min={0} className="h-9" {...register(`detalles.${i}.precioUnitario`)} />
                    </td>
                    <td className="px-3 py-1 text-right font-mono text-zinc-600">${sub.toFixed(2)}</td>
                    <td className="px-1 py-1">
                      {fields.length > 1 && (
                        <Button type="button" size="icon" variant="ghost" className="h-8 w-8 cursor-pointer" onClick={() => remove(i)}>
                          <Trash className="w-3.5 h-3.5 text-rose-500" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="text-right text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          Total: ${total.toFixed(2)}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="cursor-pointer gap-2">
        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
        Crear Orden de Compra
      </Button>
    </form>
  );
}
