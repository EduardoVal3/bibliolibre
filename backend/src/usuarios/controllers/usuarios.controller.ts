import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Post,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateHistorialMembresiaDto } from '../dto/create-historial-membresia.dto';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile (requires JWT)' })
  findMe() {
    // ponytail: hardcoded idUsuario until a @CurrentUser decorator is built
    return this.usuariosService.findMe(1);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all users with pagination (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findAll(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    return this.usuariosService.findAll({ page, pageSize });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (admin)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, any>) {
    return this.usuariosService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (admin)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }

  @Get(':id/membresias')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get membership history for a user' })
  findMembresias(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findMembresiasHistory(id);
  }

  @Post(':id/membresias')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a membership to a user (renewal)' })
  addMembresia(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateHistorialMembresiaDto,
  ) {
    return this.usuariosService.addMembresia(id, dto.idMembresia);
  }
}
