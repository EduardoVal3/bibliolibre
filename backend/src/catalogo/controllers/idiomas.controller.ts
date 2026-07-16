import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IdiomasService } from '../services/idiomas.service';
import { CreateIdiomaDto } from '../dto/create-idioma.dto';
import { UpdateIdiomaDto } from '../dto/update-idioma.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('idiomas')
@Controller('idiomas')
export class IdiomasController {
  constructor(private readonly service: IdiomasService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all idiomas (public)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single idioma (public)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new idioma (requires JWT)' })
  create(@Body() createDto: CreateIdiomaDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an idioma (requires JWT)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateIdiomaDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an idioma (requires JWT)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
