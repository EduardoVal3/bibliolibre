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
import { EditorialesService } from '../services/editoriales.service';
import { CreateEditorialDto } from '../dto/create-editorial.dto';
import { UpdateEditorialDto } from '../dto/update-editorial.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('editoriales')
@Controller('editoriales')
export class EditorialesController {
  constructor(private readonly service: EditorialesService) {}

  @Get()
  @ApiOperation({ summary: 'Get list of all editoriales (public)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single editorial (public)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new editorial (requires JWT)' })
  create(@Body() createDto: CreateEditorialDto) {
    return this.service.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an editorial (requires JWT)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateEditorialDto,
  ) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an editorial (requires JWT)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
