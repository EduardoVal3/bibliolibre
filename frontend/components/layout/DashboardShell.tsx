'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen, Users, CreditCard, Menu, X,
  LayoutDashboard, BookCopy, ShoppingCart, Truck, Globe, Calendar,
  Hand, Bookmark, Store, Shield, BarChart3, UserCheck,
  DollarSign, FileText, Monitor, Download, PartyPopper,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserMenu } from './UserMenu';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { href: '/prestamos', label: 'Préstamos', icon: Hand },
  { href: '/mis-prestamos', label: 'Mis Préstamos', icon: BookCopy },
  { href: '/reservas', label: 'Reservas', icon: Bookmark },
  { href: '/mis-reservas', label: 'Mis Reservas', icon: Bookmark },
  { href: '/ventas', label: 'Ventas', icon: Store },
  { href: '/empleados', label: 'Empleados', icon: UserCheck },
  { href: '/roles-empleado', label: 'Roles y Permisos', icon: Shield },
  { href: '/reportes/ventas', label: 'Reporte Ventas', icon: BarChart3 },
  { href: '/usuarios', label: 'Usuarios', icon: Users },
  { href: '/biblioteca-digital', label: 'Biblioteca Digital', icon: Monitor },
  { href: '/dispositivos', label: 'Dispositivos', icon: Globe },
  { href: '/mis-descargas', label: 'Mis Descargas', icon: Download },
  { href: '/proveedores', label: 'Proveedores', icon: Truck },
  { href: '/presupuestos', label: 'Presupuestos', icon: DollarSign },
  { href: '/eventos', label: 'Eventos', icon: PartyPopper },
  { href: '/ordenes-compra', label: 'Órdenes Compra', icon: FileText },
  { href: '/membresias', label: 'Membresías', icon: CreditCard },
  { href: '/perfil', label: 'Mi Perfil', icon: LayoutDashboard },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg text-zinc-900 dark:text-zinc-50">
            <BookCopy className="w-5 h-5 text-indigo-600" />
            Biblioteca
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-500 hover:text-zinc-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800',
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-500 hover:text-zinc-700 cursor-pointer">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <UserMenu />
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
