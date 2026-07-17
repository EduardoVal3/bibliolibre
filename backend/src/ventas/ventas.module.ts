import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolEmpleado } from './entities/rol-empleado.entity';
import { Turno } from './entities/turno.entity';
import { Empleado } from './entities/empleado.entity';
import { Permiso } from './entities/permiso.entity';
import { RolPermiso } from './entities/rol-permiso.entity';
import { ProductoVenta } from './entities/producto-venta.entity';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { MetodoPago } from './entities/metodo-pago.entity';
import { PagoVenta } from './entities/pago-venta.entity';
import { VwVentasPorEmpleado } from './entities/vw-ventas-por-empleado.entity';
import { VentasService } from './services/ventas.service';
import { ProductosVentaService } from './services/productos-venta.service';
import { EmpleadosService } from './services/empleados.service';
import { RolesEmpleadoService } from './services/roles-empleado.service';
import { PermisosService } from './services/permisos.service';
import { TurnosService } from './services/turnos.service';
import { MetodosPagoService } from './services/metodos-pago.service';
import { VentasController } from './controllers/ventas.controller';
import { ProductosVentaController } from './controllers/productos-venta.controller';
import { EmpleadosController } from './controllers/empleados.controller';
import { RolesEmpleadoController } from './controllers/roles-empleado.controller';
import { PermisosController } from './controllers/permisos.controller';
import { TurnosController } from './controllers/turnos.controller';
import { MetodosPagoController } from './controllers/metodos-pago.controller';
import { ReportesController } from './controllers/reportes.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolEmpleado,
      Turno,
      Empleado,
      Permiso,
      RolPermiso,
      ProductoVenta,
      Venta,
      DetalleVenta,
      MetodoPago,
      PagoVenta,
      VwVentasPorEmpleado,
    ]),
  ],
  controllers: [
    VentasController,
    ProductosVentaController,
    EmpleadosController,
    RolesEmpleadoController,
    PermisosController,
    TurnosController,
    MetodosPagoController,
    ReportesController,
  ],
  providers: [
    VentasService,
    ProductosVentaService,
    EmpleadosService,
    RolesEmpleadoService,
    PermisosService,
    TurnosService,
    MetodosPagoService,
  ],
  exports: [TypeOrmModule],
})
export class VentasModule {}
