import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EjemplaresService } from '../services/ejemplares.service';
import { CreateEjemplarDto } from '../dto/create-ejemplar.dto';
import { UpdateEjemplarEstadoDto } from '../dto/update-ejemplar-estado.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('ejemplares')
@Controller('ejemplares')
export class EjemplaresController {
  constructor(private readonly service: EjemplaresService) {}

  @Get('ubicaciones')
  @ApiOperation({ summary: 'Get list of all physical locations (public)' })
  findLocations() {
    return this.service.findLocations();
  }

  @Get(':codigobarras')
  @ApiOperation({ summary: 'Get a copy (ejemplar) by barcode (public)' })
  findByBarcode(@Param('codigobarras') codigobarras: string) {
    return this.service.findByBarcode(codigobarras);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new copy (ejemplar) (requires JWT)' })
  create(@Body() createDto: CreateEjemplarDto) {
    return this.service.create(createDto);
  }

  @Patch(':id/estado')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update physical state and/or availability of a copy (requires JWT)' })
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEjemplarEstadoDto,
  ) {
    return this.service.updateEstado(id, updateDto);
  }
}
