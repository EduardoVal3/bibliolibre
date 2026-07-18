import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { LoginDto } from '../dto/login.dto';
import { RegistroDto } from '../dto/registro.dto';
import { CambiarPasswordDto } from '../dto/cambiar-password.dto';
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

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async persistRefreshToken(token: string, sub: number, tipo: string, userAgent?: string) {
    const hash = this.hashToken(token);
    const payload = this.jwtService.decode(token) as any;
    const exp = new Date((payload?.exp ?? Date.now() / 1000 + 7 * 86400) * 1000);
    const col = tipo === 'usuario' ? 'idusuario' : 'idempleado';
    await this.dataSource.query(
      `INSERT INTO refresh_tokens(tokenhash, ${col}, fechaemision, fechaexpiracion, useragent)
       VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4)`,
      [hash, sub, exp, userAgent || null],
    );
  }

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

    if (usuario) {
      const valid = await bcrypt.compare(loginDto.password, usuario.passwordHash);
      if (!valid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: usuario.idUsuario,
        tipo: 'usuario',
        idPersona: persona.idPersona,
        idTipoUsuario: usuario.idTipoUsuario,
        correo: persona.correo,
      };

      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      });

      await this.persistRefreshToken(refreshToken, usuario.idUsuario, 'usuario');

      return { accessToken, refreshToken, usuario: { ...payload } };
    }

    const emp = await this.dataSource.query(
      `SELECT idempleado, passwordhash, idrol, requierecambiopassword FROM empleados WHERE idpersona = $1`,
      [persona.idPersona],
    );

    if (emp.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(loginDto.password, emp[0].passwordhash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const perms = await this.dataSource.query(
      `SELECT p.nombrepermiso FROM permisos p
       JOIN rol_permiso rp ON rp.idpermiso = p.idpermiso
       WHERE rp.idrol = $1`,
      [emp[0].idrol],
    );
    const permisos = perms.map((p: { nombrepermiso: string }) => p.nombrepermiso);

    const payload = {
      sub: emp[0].idempleado,
      tipo: 'empleado',
      idPersona: persona.idPersona,
      idRol: emp[0].idrol,
      permisos,
      correo: persona.correo,
      requiereCambioPassword: emp[0].requierecambiopassword,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    await this.persistRefreshToken(refreshToken, emp[0].idempleado, 'empleado');

    return { accessToken, refreshToken, usuario: { ...payload } };
  }

  async refresh(refreshToken: string) {
    const hash = this.hashToken(refreshToken);
    const rows = await this.dataSource.query(
      `SELECT idrefreshtoken, tokenhash, idusuario, idempleado, fechaexpiracion
       FROM refresh_tokens WHERE tokenhash = $1 AND revocado = FALSE`,
      [hash],
    );
    if (rows.length === 0) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }
    const row = rows[0];

    if (new Date(row.fechaexpiracion) < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.dataSource.query(
      `UPDATE refresh_tokens SET revocado = TRUE, fecharevocacion = CURRENT_TIMESTAMP WHERE idrefreshtoken = $1`,
      [row.idrefreshtoken],
    );

    const tipo = row.idusuario ? 'usuario' : 'empleado';
    const sub = row.idusuario ?? row.idempleado;
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_SECRET'),
    }) as any;

    const newPayload: Record<string, any> = {
      sub,
      tipo,
      correo: payload.correo,
    };
    if (tipo === 'usuario') {
      newPayload.idPersona = payload.idPersona;
      newPayload.idTipoUsuario = payload.idTipoUsuario;
    } else {
      newPayload.idPersona = payload.idPersona;
      newPayload.idRol = payload.idRol;
      newPayload.permisos = payload.permisos;
      newPayload.requiereCambioPassword = payload.requiereCambioPassword;
    }

    const accessToken = this.jwtService.sign(newPayload);
    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '7d',
    });

    await this.persistRefreshToken(newRefreshToken, sub, tipo);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string, user: any) {
    const hash = this.hashToken(refreshToken);
    const col = user.tipo === 'usuario' ? 'idusuario' : 'idempleado';
    const result = await this.dataSource.query(
      `UPDATE refresh_tokens SET revocado = TRUE, fecharevocacion = CURRENT_TIMESTAMP
       WHERE tokenhash = $1 AND ${col} = $2 AND revocado = FALSE`,
      [hash, user.sub],
    );
    if (result[1] === 0) {
      throw new UnauthorizedException('Refresh token not found or already revoked');
    }
    return { message: 'Logged out successfully' };
  }

  async cambiarPassword(user: any, dto: CambiarPasswordDto) {
    if (user.tipo === 'usuario') {
      const usuario = await this.usuarioRepository.findOne({
        where: { idUsuario: user.sub },
      });
      if (!usuario) throw new UnauthorizedException();

      const valid = await bcrypt.compare(dto.currentPassword, usuario.passwordHash);
      if (!valid) throw new UnauthorizedException('Current password is incorrect');

      usuario.passwordHash = await bcrypt.hash(dto.newPassword, 10);
      await this.usuarioRepository.save(usuario);
      return { message: 'Password updated successfully' };
    }

    if (user.tipo === 'empleado') {
      const emp = await this.dataSource.query(
        `SELECT passwordhash FROM empleados WHERE idempleado = $1`,
        [user.sub],
      );
      if (emp.length === 0) throw new UnauthorizedException();

      const valid = await bcrypt.compare(dto.currentPassword, emp[0].passwordhash);
      if (!valid) throw new UnauthorizedException('Current password is incorrect');

      const newHash = await bcrypt.hash(dto.newPassword, 10);
      await this.dataSource.query(
        `UPDATE empleados SET passwordhash = $1, requierecambiopassword = false WHERE idempleado = $2`,
        [newHash, user.sub],
      );
      return { message: 'Password updated successfully' };
    }

    throw new UnauthorizedException();
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
