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
import { RolesEmpleadoService } from '../services/roles-empleado.service';
import { CreateRolEmpleadoDto } from '../dto/create-rol-empleado.dto';
import { UpdateRolEmpleadoDto } from '../dto/update-rol-empleado.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermisosGuard } from '../../common/guards/permisos.guard';
import { RequierePermiso } from '../../common/decorators/requiere-permiso.decorator';

@ApiTags('roles-empleado')
@Controller('roles-empleado')
export class RolesEmpleadoController {
  constructor(private readonly service: RolesEmpleadoService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all roles' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a single role' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @RequierePermiso('Gestionar_Roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a role' })
  create(@Body() dto: CreateRolEmpleadoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @RequierePermiso('Gestionar_Roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a role' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRolEmpleadoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @RequierePermiso('Gestionar_Roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a role' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Post(':id/permisos')
  @UseGuards(JwtAuthGuard, PermisosGuard)
  @RequierePermiso('Gestionar_Roles')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign a permission to a role' })
  assignPermiso(
    @Param('id', ParseIntPipe) idRol: number,
    @Body('idPermiso', ParseIntPipe) idPermiso: number,
  ) {
    return this.service.assignPermiso(idRol, idPermiso);
  }
}
