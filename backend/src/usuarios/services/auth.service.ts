import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { RegistroDto } from '../dto/registro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Persona } from '../entities/persona.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Persona)
    private readonly personaRepository: Repository<Persona>,
  ) {}

  async login(loginDto: LoginDto) {
    const persona = await this.personaRepository.findOne({
      where: { correo: loginDto.correo },
    });
    if (!persona) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { idPersona: persona.idPersona },
    });
    if (!usuario) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(loginDto.password, usuario.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is also an employee
    let idRol: number | undefined;
    let permisos: string[] | undefined;
    const emp = await this.dataSource.query(
      `SELECT idrol FROM empleados WHERE idpersona = $1`,
      [persona.idPersona],
    );
    if (emp.length > 0) {
      idRol = emp[0].idrol;
      const perms = await this.dataSource.query(
        `SELECT p.nombrepermiso FROM permisos p
         JOIN rol_permiso rp ON rp.idpermiso = p.idpermiso
         WHERE rp.idrol = $1`,
        [idRol],
      );
      permisos = perms.map((p: { nombrepermiso: string }) => p.nombrepermiso);
    }

    const payload = {
      sub: usuario.idUsuario,
      idPersona: persona.idPersona,
      idTipoUsuario: usuario.idTipoUsuario,
      correo: persona.correo,
      idRol,
      permisos,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    return { accessToken, refreshToken, usuario: { ...payload } };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const usuario = await this.usuarioRepository.findOne({
        where: { idUsuario: payload.sub },
        relations: { persona: true },
      });
      if (!usuario) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = {
        sub: usuario.idUsuario,
        idPersona: usuario.idPersona,
        idTipoUsuario: usuario.idTipoUsuario,
        correo: usuario.persona.correo,
      };
      const accessToken = this.jwtService.sign(newPayload);
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async registro(registroDto: RegistroDto) {
    const existing = await this.personaRepository.findOne({
      where: { correo: registroDto.correo },
    });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    const hash = await bcrypt.hash(registroDto.password, 10);

    const result = await this.dataSource.query(
      `CALL sp_registrar_usuario_completo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        registroDto.pNombre,
        registroDto.sNombre || null,
        registroDto.pApellido,
        registroDto.sApellido || null,
        registroDto.correo,
        registroDto.telefono || null,
        registroDto.direccion || null,
        hash,
        registroDto.idTipoUsuario,
        registroDto.idMembresia,
        null,
      ],
    );

    const createdId = result[0]?.p_idusuario;
    if (!createdId) {
      throw new BadRequestException('Registration failed');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: createdId },
      relations: { persona: true, tipoUsuario: true },
    });

    return usuario;
  }
}
