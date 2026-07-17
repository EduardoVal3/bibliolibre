'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Shield } from 'lucide-react';
import { getStoredUser, clearTokens } from '@/lib/auth/auth';

export function UserMenu() {
  const router = useRouter();
  const user = getStoredUser();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted || !user) return null;

  const initials = user.correo.charAt(0).toUpperCase();

  const handleLogout = () => {
    clearTokens();
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer rounded-full p-0.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-indigo-100 text-indigo-700 text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{user.correo}</p>
            <p className="text-xs text-zinc-500">
              {user.permisos?.length ? 'Staff' : 'Usuario'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/perfil')} className="cursor-pointer">
          <User className="w-4 h-4 mr-2" />
          Mi Perfil
        </DropdownMenuItem>
        {user.permisos?.length ? (
          <DropdownMenuItem onClick={() => router.push('/usuarios')} className="cursor-pointer">
            <Shield className="w-4 h-4 mr-2" />
            Admin Usuarios
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-rose-600 dark:text-rose-400">
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
