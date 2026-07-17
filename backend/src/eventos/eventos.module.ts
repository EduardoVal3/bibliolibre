import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { AsistenciaEvento } from './entities/asistencia-evento.entity';
import { VwEventosConCupo } from './entities/vw-eventos-con-cupo.entity';
import { EventosService } from './services/eventos.service';
import { EventosController } from './controllers/eventos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento, AsistenciaEvento, VwEventosConCupo]),
  ],
  controllers: [EventosController],
  providers: [EventosService],
  exports: [TypeOrmModule],
})
export class EventosModule {}
