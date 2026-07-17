import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VentasService } from '../services/ventas.service';
import { CreateVentaDto } from '../dto/create-venta.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('ventas')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post('ventas')
  @ApiOperation({ summary: 'Register a sale using sp_registrar_venta' })
  create(@Body() dto: CreateVentaDto) {
    return this.ventasService.create(dto);
  }

  @Get('ventas')
  @ApiOperation({ summary: 'List sales with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'empleado', required: false, type: Number })
  @ApiQuery({ name: 'fechaDesde', required: false, type: String })
  @ApiQuery({ name: 'fechaHasta', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('empleado') empleado?: number,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
  ) {
    return this.ventasService.findAll({ page, pageSize, empleado, fechaDesde, fechaHasta });
  }

  @Get('ventas/:id')
  @ApiOperation({ summary: 'Get sale detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }
}
