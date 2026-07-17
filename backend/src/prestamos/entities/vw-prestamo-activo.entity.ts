import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vw_prestamos_activos', synchronize: false })
export class VwPrestamoActivo {
  @ViewColumn({ name: 'idprestamo' })
  idPrestamo: number;

  @ViewColumn({ name: 'idusuario' })
  idUsuario: number;

  @ViewColumn({ name: 'usuario' })
  usuario: string;

  @ViewColumn({ name: 'titulo' })
  titulo: string;

  @ViewColumn({ name: 'codigobarras' })
  codigoBarras: string;

  @ViewColumn({ name: 'fechaprestamo' })
  fechaPrestamo: string;

  @ViewColumn({ name: 'fechalimitedevolucion' })
  fechaLimiteDevolucion: string;

  @ViewColumn({ name: 'vencido' })
  vencido: boolean;
}
