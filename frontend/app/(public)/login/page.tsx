'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/usuarios/LoginForm';
import { BookCopy } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <div className="bg-indigo-100 dark:bg-indigo-950/50 p-3 rounded-full">
                <BookCopy className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Iniciar sesión</h1>
            <p className="text-sm text-zinc-500">Ingresa tus credenciales para acceder al sistema</p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-zinc-500">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
