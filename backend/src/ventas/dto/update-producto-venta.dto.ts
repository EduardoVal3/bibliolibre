import { PartialType } from '@nestjs/swagger';
import { CreateProductoVentaDto } from './create-producto-venta.dto';

export class UpdateProductoVentaDto extends PartialType(CreateProductoVentaDto) {}
