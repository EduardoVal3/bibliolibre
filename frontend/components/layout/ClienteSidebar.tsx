'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Monitor,
  BookCopy,
  Bookmark,
  Download,
  CreditCard,
  User,
  LogOut,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { getStoredUser, clearTokens } from '@/lib/auth/auth';

const clientNavItems = [
  { href: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { href: '/catalogo/digitales', label: 'Catálogo digital', icon: Monitor },
  { href: '/mis-prestamos', label: 'Mis préstamos', icon: BookCopy },
  { href: '/mis-reservas', label: 'Mis reservas', icon: Bookmark },
  { href: '/mis-descargas', label: 'Mis descargas', icon: Download },
  { href: '/membresias', label: 'Membresía', icon: CreditCard },
  { href: '/perfil', label: 'Perfil', icon: User },
];

export function ClienteSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getStoredUser());
  }, [pathname]);

  if (!mounted || !user || user.tipo !== 'usuario') return null;

  const handleLogout = () => {
    clearTokens();
    setUser(null);
    router.push('/');
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2 px-4 py-2 font-heading text-lg font-bold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          Biblioteca
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {clientNavItems.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton render={<Link href={item.href} />} isActive={active}>
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
