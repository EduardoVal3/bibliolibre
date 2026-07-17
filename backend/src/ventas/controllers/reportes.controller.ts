import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VwVentasPorEmpleado } from '../entities/vw-ventas-por-empleado.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('reportes')
@Controller('reportes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportesController {
  constructor(
    @InjectRepository(VwVentasPorEmpleado)
    private readonly repository: Repository<VwVentasPorEmpleado>,
  ) {}

  @Get('ventas-por-empleado')
  @ApiOperation({ summary: 'Sales by employee report using vw_ventas_por_empleado' })
  ventasPorEmpleado() {
    return this.repository.find();
  }
}
