import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MembresiasService } from '../services/membresias.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateMembresiaDto } from '../dto/create-membresia.dto';
import { UpdateMembresiaDto } from '../dto/update-membresia.dto';
import { CreateTipoUsuarioDto } from '../dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from '../dto/update-tipo-usuario.dto';

@ApiTags('membresias')
@Controller()
export class MembresiasController {
  constructor(private readonly membresiasService: MembresiasService) {}

  // Membresias
  @Get('membresias')
  @ApiOperation({ summary: 'List all memberships' })
  findAllMembresias() {
    return this.membresiasService.findAllMembresias();
  }

  @Get('membresias/:id')
  @ApiOperation({ summary: 'Get membership by ID' })
  findMembresia(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.findMembresia(id);
  }

  @Post('membresias')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new membership (admin)' })
  createMembresia(@Body() dto: CreateMembresiaDto) {
    return this.membresiasService.createMembresia(dto);
  }

  @Put('membresias/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a membership (admin)' })
  updateMembresia(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMembresiaDto) {
    return this.membresiasService.updateMembresia(id, dto);
  }

  @Delete('membresias/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a membership (admin)' })
  deleteMembresia(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.deleteMembresia(id);
  }

  // Tipos de Usuario
  @Get('tipos-usuario')
  @ApiOperation({ summary: 'List all user types' })
  findAllTiposUsuario() {
    return this.membresiasService.findAllTiposUsuario();
  }

  @Get('tipos-usuario/:id')
  @ApiOperation({ summary: 'Get user type by ID' })
  findTipoUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.findTipoUsuario(id);
  }

  @Post('tipos-usuario')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new user type (admin)' })
  createTipoUsuario(@Body() dto: CreateTipoUsuarioDto) {
    return this.membresiasService.createTipoUsuario(dto);
  }

  @Put('tipos-usuario/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user type (admin)' })
  updateTipoUsuario(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTipoUsuarioDto) {
    return this.membresiasService.updateTipoUsuario(id, dto);
  }

  @Delete('tipos-usuario/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user type (admin)' })
  deleteTipoUsuario(@Param('id', ParseIntPipe) id: number) {
    return this.membresiasService.deleteTipoUsuario(id);
  }
}
