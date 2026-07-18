'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { ClienteSidebar } from '@/components/layout/ClienteSidebar';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ClienteSidebar />
      <div className="flex min-h-screen w-full flex-col">
        <PublicNavbar />
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
    </SidebarProvider>
  );
}
