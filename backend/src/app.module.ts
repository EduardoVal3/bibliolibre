import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateEnv } from './config/env.config';
import { HealthController } from './health/health.controller';
import { CatalogoModule } from './catalogo/catalogo.module';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_DB'),
        entities: [join(__dirname, '**/*.entity.{ts,js}')],
        migrations: [join(__dirname, 'database/migrations/*.{ts,js}')],
        synchronize: false,
        migrationsRun: false,
      }),
    }),
    CatalogoModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
