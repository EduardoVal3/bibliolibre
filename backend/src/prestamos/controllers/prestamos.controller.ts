import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrestamosService } from '../services/prestamos.service';
import { CreatePrestamoDto } from '../dto/create-prestamo.dto';
import { CreateDevolucionDto } from '../dto/create-devolucion.dto';
import { CreateReservaDto } from '../dto/create-reserva.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('prestamos')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post('prestamos')
  @ApiOperation({ summary: 'Create a loan with 1..n copies' })
  createPrestamo(@Body() dto: CreatePrestamoDto) {
    return this.prestamosService.createPrestamo(dto);
  }

  @Get('prestamos')
  @ApiOperation({ summary: 'List loans with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'usuario', required: false, type: Number })
  @ApiQuery({ name: 'vencido', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('usuario') usuario?: number,
    @Query('vencido') vencido?: string,
  ) {
    return this.prestamosService.findAll({ page, pageSize, usuario, vencido });
  }

  @Get('prestamos/vencidos')
  @ApiOperation({ summary: 'List overdue loans using vw_prestamos_activos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findVencidos(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.prestamosService.findVencidos({ page, pageSize });
  }

  @Get('prestamos/:id')
  @ApiOperation({ summary: 'Get loan detail' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.findOne(id);
  }

  @Post('devoluciones')
  @ApiOperation({ summary: 'Register a return for a copy' })
  createDevolucion(@Body() dto: CreateDevolucionDto) {
    return this.prestamosService.createDevolucion(dto);
  }

  @Post('reservas')
  @ApiOperation({ summary: 'Create a reservation for a copy' })
  createReserva(@Body() dto: CreateReservaDto) {
    return this.prestamosService.createReserva(dto);
  }

  @Get('reservas')
  @ApiOperation({ summary: 'List reservations (own or all for staff)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'usuario', required: false, type: Number })
  findReservas(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('usuario') usuario?: number,
  ) {
    return this.prestamosService.findReservas({ page, pageSize, usuario });
  }

  @Delete('reservas/:id')
  @ApiOperation({ summary: 'Cancel a reservation' })
  cancelReserva(@Param('id', ParseIntPipe) id: number) {
    return this.prestamosService.cancelReserva(id);
  }

  @Get('usuarios/:id/historial-prestamos')
  @ApiOperation({ summary: 'Get loan history for a user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findHistorial(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.prestamosService.findHistorial(id, { page, pageSize });
  }
}
