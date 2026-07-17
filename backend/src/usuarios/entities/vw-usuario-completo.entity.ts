import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'vw_usuarios_completos', synchronize: false })
export class VwUsuarioCompleto {
  @ViewColumn({ name: 'idusuario' })
  idUsuario: number;

  @ViewColumn({ name: 'nombrecompleto' })
  nombreCompleto: string;

  @ViewColumn({ name: 'correo' })
  correo: string;

  @ViewColumn({ name: 'telefono' })
  telefono: string;

  @ViewColumn({ name: 'tipousuario' })
  tipoUsuario: string;

  @ViewColumn({ name: 'fecharegistro' })
  fechaRegistro: string;

  @ViewColumn({ name: 'nombremembresia' })
  nombreMembresia: string;

  @ViewColumn({ name: 'membresia_vence' })
  membresiaVence: string;
}
