import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

export function LandingHero() {
  return (
    <section className="flex flex-1 items-center justify-center px-4">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Tu biblioteca, siempre contigo
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          Explora nuestro catálogo, reserva libros, accede a recursos digitales y mucho más.
          Todo desde un solo lugar.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" render={<Link href="/catalogo" />}>Explorar catálogo</Button>
          <Button size="lg" variant="outline" render={<Link href="/registro" />}>Crear cuenta</Button>
        </div>
      </div>
    </section>
  );
}
