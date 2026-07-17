import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DispositivosService } from '../services/dispositivos.service';
import { CreateDispositivoDto } from '../dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from '../dto/update-dispositivo.dto';
import { PrestarDispositivoDto } from '../dto/prestar-dispositivo.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('dispositivos')
@Controller('dispositivos')
export class DispositivosController {
  constructor(private readonly service: DispositivosService) {}

  @Get()
  @ApiOperation({ summary: 'List all devices' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single device' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get(':id/prestamos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get loan history for a device' })
  prestamos(@Param('id', ParseIntPipe) id: number) {
    return this.service.prestamos(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new device' })
  create(@Body() createDto: CreateDispositivoDto) {
    return this.service.create(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update device info or state' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateDispositivoDto) {
    return this.service.update(id, updateDto);
  }

  @Post(':id/prestar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lend a device to a user' })
  prestar(@Param('id', ParseIntPipe) id: number, @Body() dto: PrestarDispositivoDto) {
    return this.service.prestar(id, dto);
  }

  @Post(':id/devolver')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return a loaned device' })
  devolver(@Param('id', ParseIntPipe) id: number) {
    return this.service.devolver(id);
  }
}
