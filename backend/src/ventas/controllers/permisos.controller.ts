import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermisosService } from '../services/permisos.service';
import { CreatePermisoDto } from '../dto/create-permiso.dto';
import { UpdatePermisoDto } from '../dto/update-permiso.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { RequierePermiso } from '../../common/decorators/requiere-permiso.decorator';

@ApiTags('permisos')
@Controller('permisos')
export class PermisosController {
  constructor(private readonly service: PermisosService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all permissions' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single permission' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @RequierePermiso('Gestionar_Permisos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a permission' })
  create(@Body() dto: CreatePermisoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @RequierePermiso('Gestionar_Permisos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a permission' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermisoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @RequierePermiso('Gestionar_Permisos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a permission' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
