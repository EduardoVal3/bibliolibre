import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Usuario } from './entities/usuario.entity';
import { Persona } from './entities/persona.entity';
import { TipoUsuario } from './entities/tipo-usuario.entity';
import { Membresia } from './entities/membresia.entity';
import { HistorialMembresia } from './entities/historial-membresia.entity';
import { PagoMembresia } from './entities/pago-membresia.entity';
import { VwUsuarioCompleto } from './entities/vw-usuario-completo.entity';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsuariosService } from './services/usuarios.service';
import { UsuariosController } from './controllers/usuarios.controller';
import { MembresiasService } from './services/membresias.service';
import { MembresiasPagoService } from './services/membresias-pago.service';
import { MembresiasController } from './controllers/membresias.controller';
import { PagosMembresiasController } from './controllers/pagos-membresias.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Persona,
      TipoUsuario,
      Membresia,
      HistorialMembresia,
      PagoMembresia,
      VwUsuarioCompleto,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d') as any },
      }),
    }),
  ],
  controllers: [AuthController, UsuariosController, MembresiasController, PagosMembresiasController],
  providers: [AuthService, UsuariosService, MembresiasService, MembresiasPagoService, JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class UsuariosModule {}
