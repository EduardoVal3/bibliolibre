import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VwCatalogoLibro } from "@/types/catalogo.types";
import Link from "next/link";
import { Book, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LibroCardProps {
  libro: VwCatalogoLibro;
}

export function LibroCard({ libro }: LibroCardProps) {
  const total = Number(libro.totalEjemplares) || 0;
  const disponibles = Number(libro.ejemplaresDisponibles) || 0;

  return (
    <Card className="flex flex-col h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-5 pb-3">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Badge
            variant="secondary"
            className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 font-medium"
          >
            {libro.categoria}
          </Badge>
          <span className="text-xs text-zinc-400 font-mono">{libro.isbn}</span>
        </div>
        <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50 line-clamp-2 min-h-[3.5rem] flex items-start gap-2">
          <Book className="w-5 h-5 mt-0.5 text-indigo-500 shrink-0" />
          <span>{libro.titulo}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-0 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {libro.autores || "Autor Desconocido"}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-400">
            <span>
              Edición:{" "}
              <strong className="text-zinc-600 dark:text-zinc-300">
                {libro.edicion}
              </strong>
            </span>
            <span>
              Año:{" "}
              <strong className="text-zinc-600 dark:text-zinc-300">
                {libro.anioPublicacion}
              </strong>
            </span>
          </div>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 my-4 pt-3 flex justify-between text-sm items-center">
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
            <Layers className="w-4 h-4 text-zinc-400" />
            <span>Copias Totales</span>
          </div>
          <span className="font-semibold text-zinc-700 dark:text-zinc-200">
            {total}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 flex justify-between items-center gap-3">
        <div className="text-xs">
          {total > 0 ? (
            disponibles > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                ● {disponibles} disponibles
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                No disponible (en préstamo)
              </span>
            )
          ) : (
            <span className="text-zinc-400">Sin ejemplares</span>
          )}
        </div>
        <Link href={`/catalogo-admin/${libro.idLibro}`} passHref>
          <Button
            size="sm"
            variant="outline"
            className="border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
          >
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
