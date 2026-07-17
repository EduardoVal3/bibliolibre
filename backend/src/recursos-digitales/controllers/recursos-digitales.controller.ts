import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards, ParseIntPipe, DefaultValuePipe, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RecursosDigitalesService } from '../services/recursos-digitales.service';
import { CreateRecursoDigitalDto } from '../dto/create-recurso-digital.dto';
import { UpdateRecursoDigitalDto } from '../dto/update-recurso-digital.dto';
import { CreateDescargaAccesoDto } from '../dto/create-descarga-acceso.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('recursos-digitales')
@Controller('recursos-digitales')
export class RecursosDigitalesController {
  constructor(private readonly service: RecursosDigitalesService) {}

  @Get()
  @ApiOperation({ summary: 'List all digital resources (public)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 20 })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(20), ParseIntPipe) pageSize: number,
  ) {
    return this.service.findAll(page, pageSize);
  }

  @Get('mas-descargados')
  @ApiOperation({ summary: 'Most downloaded resources' })
  findMasDescargados() {
    return this.service.findMasDescargados();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single digital resource' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a digital resource' })
  create(@Body() createDto: CreateRecursoDigitalDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a digital resource' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateRecursoDigitalDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a digital resource' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/acceso')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register access (download/view) to a resource, validates active membership' })
  registrarAcceso(
    @Param('id', ParseIntPipe) id: number,
    @Body() createDto: CreateDescargaAccesoDto,
    @Req() req: any,
  ) {
    return this.service.registrarAcceso(id, req.user.idUsuario, createDto);
  }
}
