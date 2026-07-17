'use client';

import Link from 'next/link';
import { RegistroForm } from '@/components/usuarios/RegistroForm';
import { BookCopy } from 'lucide-react';

export default function RegistroPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-indigo-100 dark:bg-indigo-950/50 p-3 rounded-full">
                <BookCopy className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Crear cuenta</h1>
            <p className="text-sm text-zinc-500">Regístrate para acceder a la biblioteca</p>
          </div>
          <RegistroForm />
          <p className="text-center text-sm text-zinc-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
