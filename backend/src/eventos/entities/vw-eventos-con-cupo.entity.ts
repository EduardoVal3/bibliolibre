import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_eventos_con_cupo',
  synchronize: false,
})
export class VwEventosConCupo {
  @ViewColumn({ name: 'idevento' })
  idEvento: number;

  @ViewColumn({ name: 'nombreevento' })
  nombreEvento: string;

  @ViewColumn({ name: 'fechaevento' })
  fechaEvento: string;

  @ViewColumn({ name: 'capacidadmaxima' })
  capacidadMaxima: number;

  @ViewColumn({ name: 'inscritos' })
  inscritos: number;

  @ViewColumn({ name: 'cupos_disponibles' })
  cuposDisponibles: number;
}
