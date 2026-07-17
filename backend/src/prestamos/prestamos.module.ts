import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './entities/prestamo.entity';
import { DetallePrestamo } from './entities/detalle-prestamo.entity';
import { Devolucion } from './entities/devolucion.entity';
import { Reserva } from './entities/reserva.entity';
import { HistorialPrestamo } from './entities/historial-prestamo.entity';
import { VwPrestamoActivo } from './entities/vw-prestamo-activo.entity';
import { EdicionVolumen } from '../catalogo/entities/edicion-volumen.entity';
import { PrestamosService } from './services/prestamos.service';
import { PrestamosController } from './controllers/prestamos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Prestamo,
      DetallePrestamo,
      Devolucion,
      Reserva,
      HistorialPrestamo,
      VwPrestamoActivo,
      EdicionVolumen,
    ]),
  ],
  controllers: [PrestamosController],
  providers: [PrestamosService],
  exports: [TypeOrmModule],
})
export class PrestamosModule {}
