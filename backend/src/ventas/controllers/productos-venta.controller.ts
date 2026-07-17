import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductosVentaService } from '../services/productos-venta.service';
import { CreateProductoVentaDto } from '../dto/create-producto-venta.dto';
import { UpdateProductoVentaDto } from '../dto/update-producto-venta.dto';

@ApiTags('productos-venta')
@Controller('productos-venta')
export class ProductosVentaController {
  constructor(private readonly service: ProductosVentaService) {}

  @Get()
  @ApiOperation({ summary: 'List all sale products' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a product' })
  create(@Body() dto: CreateProductoVentaDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoVentaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
