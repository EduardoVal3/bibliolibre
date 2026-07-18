"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { VwCatalogoLibro } from "@/types/catalogo.types";
import Link from "next/link";
import { Edit, Trash, Eye } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogoApi } from "@/lib/api/catalogo.api";
import { toast } from "sonner";

interface LibroTableProps {
  libros: VwCatalogoLibro[];
}

export function LibroTable({ libros }: LibroTableProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => catalogoApi.deleteLibro(id),
    onSuccess: (data) => {
      toast.success(data.message || "Libro eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["catalogo"] });
      queryClient.invalidateQueries({ queryKey: ["libros"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Error al eliminar el libro");
    },
  });

  const handleDelete = (id: number, titulo: string) => {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar el libro "${titulo}" y todos sus ejemplares?`,
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Título</TableHead>
            <TableHead className="font-semibold">Autores</TableHead>
            <TableHead className="font-semibold">Categoría</TableHead>
            <TableHead className="font-semibold">Editorial</TableHead>
            <TableHead className="font-semibold text-center">Edición</TableHead>
            <TableHead className="font-semibold text-center">Año</TableHead>
            <TableHead className="font-semibold text-center">Copias</TableHead>
            <TableHead className="font-semibold text-center">Disp.</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {libros.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-zinc-400">
                No se encontraron libros en el inventario.
              </TableCell>
            </TableRow>
          ) : (
            libros.map((libro) => (
              <TableRow
                key={libro.idLibro}
                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
              >
                <TableCell className="font-medium text-zinc-900 dark:text-zinc-50">
                  {libro.titulo}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {libro.autores || "-"}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {libro.categoria}
                </TableCell>
                <TableCell className="text-zinc-600 dark:text-zinc-300">
                  {libro.editorial}
                </TableCell>
                <TableCell className="text-center text-zinc-600 dark:text-zinc-300">
                  {libro.edicion}
                </TableCell>
                <TableCell className="text-center text-zinc-600 dark:text-zinc-300">
                  {libro.anioPublicacion}
                </TableCell>
                <TableCell className="text-center font-semibold text-zinc-700 dark:text-zinc-200">
                  {libro.totalEjemplares}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={`font-semibold ${Number(libro.ejemplaresDisponibles) > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}
                  >
                    {libro.ejemplaresDisponibles}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Link href={`/catalogo-admin/${libro.idLibro}`} passHref>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Eye className="w-4 h-4 text-zinc-500" />
                      </Button>
                    </Link>
                    <Link
                      href={`/catalogo-admin/editar/${libro.idLibro}`}
                      passHref
                    >
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Edit className="w-4 h-4 text-zinc-500" />
                      </Button>
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                      onClick={() => handleDelete(libro.idLibro, libro.titulo)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
