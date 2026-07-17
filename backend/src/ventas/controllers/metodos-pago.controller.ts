import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MetodosPagoService } from '../services/metodos-pago.service';
import { CreateMetodoPagoDto } from '../dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from '../dto/update-metodo-pago.dto';

@ApiTags('metodos-pago')
@Controller('metodos-pago')
export class MetodosPagoController {
  constructor(private readonly service: MetodosPagoService) {}

  @Get()
  @ApiOperation({ summary: 'List all payment methods' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single payment method' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a payment method' })
  create(@Body() dto: CreateMetodoPagoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a payment method' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMetodoPagoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment method' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
