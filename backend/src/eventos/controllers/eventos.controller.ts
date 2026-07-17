import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, ParseIntPipe, DefaultValuePipe, Req, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { EventosService } from '../services/eventos.service';
import { CreateEventoDto } from '../dto/create-evento.dto';
import { UpdateEventoDto } from '../dto/update-evento.dto';
import { MarcarAsistenciaDto } from '../dto/marcar-asistencia.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('eventos')
@Controller('eventos')
export class EventosController {
  constructor(private readonly service: EventosService) {}

  @Get()
  @ApiOperation({ summary: 'List all events (public)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ) {
    return this.service.findAll(page, pageSize);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single event' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get(':id/cupo')
  @ApiOperation({ summary: 'Get event capacity info from view' })
  findCupo(@Param('id', ParseIntPipe) id: number) {
    return this.service.findCupo(id);
  }

  @Get(':id/asistencias')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all registrations for an event' })
  findAsistencias(@Param('id', ParseIntPipe) id: number) {
    return this.service.findAsistenciasByEvento(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new event' })
  create(@Body() createDto: CreateEventoDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an event' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateEventoDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an event' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/inscripcion')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register current user for an event, returns 409 if full' })
  inscribir(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.service.inscribir(id, req.user.idUsuario);
  }

  @Patch(':idEvento/asistencia/:idUsuario')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark attendance for a user (Sí/No/Pendiente)' })
  marcarAsistencia(
    @Param('idEvento', ParseIntPipe) idEvento: number,
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Body() dto: MarcarAsistenciaDto,
  ) {
    return this.service.marcarAsistencia(idEvento, idUsuario, dto.asistencia);
  }
}
