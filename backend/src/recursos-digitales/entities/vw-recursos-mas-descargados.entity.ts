import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_recursos_mas_descargados',
  synchronize: false,
})
export class VwRecursosMasDescargados {
  @ViewColumn({ name: 'idrecurso' })
  idRecurso: number;

  @ViewColumn({ name: 'titulo' })
  titulo: string;

  @ViewColumn({ name: 'tiporecurso' })
  tipoRecurso: string;

  @ViewColumn({ name: 'total_descargas' })
  totalDescargas: number;

  @ViewColumn({ name: 'total_visualizaciones' })
  totalVisualizaciones: number;
}
