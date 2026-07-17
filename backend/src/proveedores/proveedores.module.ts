import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { Presupuesto } from './entities/presupuesto.entity';
import { OrdenCompra } from './entities/orden-compra.entity';
import { DetalleOrden } from './entities/detalle-orden.entity';
import { VwPresupuestoEjecutado } from './entities/vw-presupuesto-ejecutado.entity';
import { ProveedoresService } from './services/proveedores.service';
import { PresupuestosService } from './services/presupuestos.service';
import { OrdenesCompraService } from './services/ordenes-compra.service';
import { ProveedoresController } from './controllers/proveedores.controller';
import { PresupuestosController } from './controllers/presupuestos.controller';
import { OrdenesCompraController } from './controllers/ordenes-compra.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Proveedor,
      Presupuesto,
      OrdenCompra,
      DetalleOrden,
      VwPresupuestoEjecutado,
    ]),
  ],
  controllers: [
    ProveedoresController,
    PresupuestosController,
    OrdenesCompraController,
  ],
  providers: [
    ProveedoresService,
    PresupuestosService,
    OrdenesCompraService,
  ],
  exports: [TypeOrmModule],
})
export class ProveedoresModule {}
