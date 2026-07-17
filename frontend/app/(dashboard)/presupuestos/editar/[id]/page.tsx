'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { PresupuestoForm } from '@/components/proveedores/PresupuestoForm';
import { usePresupuesto, useUpdatePresupuesto } from '@/hooks/use-proveedores';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function EditarPresupuestoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: presupuesto, isLoading } = usePresupuesto(Number(id));
  const updateMutation = useUpdatePresupuesto();

  if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/presupuestos"><Button variant="ghost" size="icon" className="cursor-pointer"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Editar Presupuesto</h1>
          <p className="text-zinc-500 text-sm">Año {presupuesto?.anio}</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <PresupuestoForm
          initialValues={presupuesto}
          onSubmit={(values) => updateMutation.mutate({ id: Number(id), data: values }, { onSuccess: () => router.push('/presupuestos') })}
          isSubmitting={updateMutation.isPending}
        />
      </div>
    </div>
  );
}
