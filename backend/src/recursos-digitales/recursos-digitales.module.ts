import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecursoDigital } from './entities/recurso-digital.entity';
import { DescargaAcceso } from './entities/descarga-acceso.entity';
import { DispositivoPrestado } from './entities/dispositivo-prestado.entity';
import { PrestamoDispositivo } from './entities/prestamo-dispositivo.entity';
import { VwRecursosMasDescargados } from './entities/vw-recursos-mas-descargados.entity';
import { RecursosDigitalesService } from './services/recursos-digitales.service';
import { DispositivosService } from './services/dispositivos.service';
import { RecursosDigitalesController } from './controllers/recursos-digitales.controller';
import { DispositivosController } from './controllers/dispositivos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecursoDigital,
      DescargaAcceso,
      DispositivoPrestado,
      PrestamoDispositivo,
      VwRecursosMasDescargados,
    ]),
  ],
  controllers: [RecursosDigitalesController, DispositivosController],
  providers: [RecursosDigitalesService, DispositivosService],
  exports: [TypeOrmModule],
})
export class RecursosDigitalesModule {}
