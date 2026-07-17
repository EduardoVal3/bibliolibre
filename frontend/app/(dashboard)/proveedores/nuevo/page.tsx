'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProveedorForm } from '@/components/proveedores/ProveedorForm';
import { useCreateProveedor } from '@/hooks/use-proveedores';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NuevoProveedorPage() {
  const router = useRouter();
  const createMutation = useCreateProveedor();

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/proveedores"><Button variant="ghost" size="icon" className="cursor-pointer"><ArrowLeft className="w-5 h-5" /></Button></Link>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Nuevo Proveedor</h1>
          <p className="text-zinc-500 text-sm">Registrar un nuevo proveedor</p>
        </div>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <ProveedorForm onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => router.push('/proveedores') })} isSubmitting={createMutation.isPending} />
      </div>
    </div>
  );
}
