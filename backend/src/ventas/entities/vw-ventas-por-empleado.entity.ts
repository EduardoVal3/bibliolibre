import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vw_ventas_por_empleado', synchronize: false })
export class VwVentasPorEmpleado {
  @ViewColumn({ name: 'idempleado' })
  idEmpleado: number;

  @ViewColumn({ name: 'empleado' })
  empleado: string;

  @ViewColumn({ name: 'total_ventas' })
  totalVentas: number;

  @ViewColumn({ name: 'monto_total' })
  montoTotal: string;
}
