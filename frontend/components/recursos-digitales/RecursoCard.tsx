'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Film, Music, BookOpen } from 'lucide-react';
import { AccesoButton } from './AccesoButton';
import type { RecursoDigital } from '@/types/recursos-digitales.types';

interface RecursoCardProps {
  recurso: RecursoDigital;
}

const iconMap: Record<string, any> = {
  PDF: FileText,
  Video: Film,
  Audio: Music,
  EPUB: BookOpen,
};

export function RecursoCard({ recurso }: RecursoCardProps) {
  const Icon = iconMap[recurso.formato || ''] || FileText;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/30">
            <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold truncate">{recurso.titulo}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex gap-2 flex-wrap">
          {recurso.tipoRecurso && (
            <Badge variant="secondary" className="text-xs">{recurso.tipoRecurso}</Badge>
          )}
          {recurso.formato && (
            <Badge variant="outline" className="text-xs">{recurso.formato}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 gap-2">
        <AccesoButton idRecurso={recurso.idRecurso} tipoAccion="Descarga" urlAcceso={recurso.urlAcceso} />
        <AccesoButton idRecurso={recurso.idRecurso} tipoAccion="Visualización" urlAcceso={recurso.urlAcceso} />
      </CardFooter>
    </Card>
  );
}
