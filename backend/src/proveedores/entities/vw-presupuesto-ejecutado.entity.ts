import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_presupuesto_ejecutado',
  synchronize: false,
})
export class VwPresupuestoEjecutado {
  @ViewColumn({ name: 'idpresupuesto' })
  idPresupuesto: number;

  @ViewColumn({ name: 'anio' })
  anio: number;

  @ViewColumn({ name: 'montoasignado' })
  montoAsignado: number;

  @ViewColumn({ name: 'montoejecutado' })
  montoEjecutado: number;

  @ViewColumn({ name: 'montodisponible' })
  montoDisponible: number;
}
