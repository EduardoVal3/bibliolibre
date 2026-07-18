'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getStoredUser, clearTokens } from '@/lib/auth/auth';

export function PublicNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<ReturnType<typeof getStoredUser>>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getStoredUser());
  }, [pathname]);

  const handleLogout = () => {
    clearTokens();
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {mounted && user && <SidebarTrigger />}
        <Link href="/" className="flex items-center gap-2 font-heading text-xl font-bold text-foreground">
          <BookOpen className="h-6 w-6 text-primary" />
          Biblioteca
        </Link>
      </div>
      <div>
        {!mounted ? null : user ? (
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        ) : (
          <Button variant="default" render={<Link href="/login" />}>
            <LogIn className="mr-2 h-4 w-4" />
            Iniciar sesión
          </Button>
        )}
      </div>
    </header>
  );
}
