import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: { sub: number; idRol?: number; permisos?: string[] }) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: payload.sub },
      relations: { persona: true },
    });
    if (!usuario) {
      throw new UnauthorizedException();
    }
    return {
      idUsuario: usuario.idUsuario,
      idPersona: usuario.idPersona,
      idTipoUsuario: usuario.idTipoUsuario,
      correo: usuario.persona.correo,
      idRol: payload.idRol,
      permisos: payload.permisos,
    };
  }
}
