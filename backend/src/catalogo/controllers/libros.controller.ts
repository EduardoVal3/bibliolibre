import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LibrosService } from '../services/libros.service';
import { CreateLibroDto } from '../dto/create-libro.dto';
import { UpdateLibroDto } from '../dto/update-libro.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('libros')
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  @ApiOperation({ summary: 'Get paginated list of books with optional filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'categoria', required: false, type: Number })
  @ApiQuery({ name: 'idioma', required: false, type: Number })
  @ApiQuery({ name: 'editorial', required: false, type: Number })
  @ApiQuery({ name: 'autor', required: false, type: Number })
  @ApiQuery({ name: 'palabraClave', required: false, type: Number })
  @ApiQuery({ name: 'disponibilidad', required: false, type: String })
  @ApiQuery({ name: 'q', required: false, type: String })
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('categoria') categoria?: number,
    @Query('idioma') idioma?: number,
    @Query('editorial') editorial?: number,
    @Query('autor') autor?: number,
    @Query('palabraClave') palabraClave?: number,
    @Query('disponibilidad') disponibilidad?: string,
    @Query('q') q?: string,
  ) {
    return this.librosService.findAll({
      page,
      pageSize,
      categoria,
      idioma,
      editorial,
      autor,
      palabraClave,
      disponibilidad,
      q,
    });
  }

  @Get('catalogo-completo')
  @ApiOperation({ summary: 'Get paginated catalog list using consolidated view' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  findCatalogoCompleto(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.librosService.findCatalogoCompleto({ page, pageSize });
  }

  @Get('palabras-clave')
  @ApiOperation({ summary: 'Get list of all keywords (public)' })
  findKeywords() {
    return this.librosService.findKeywords();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get detailed information of a single book' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new book with its authors and keywords (requires JWT)' })
  create(@Body() createLibroDto: CreateLibroDto) {
    return this.librosService.create(createLibroDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update general information of a book (requires JWT)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLibroDto: UpdateLibroDto,
  ) {
    return this.librosService.update(id, updateLibroDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a book and its copies if no active loans exist (requires JWT)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.remove(id);
  }
}
