import { Controller, Post, Get, Param, Body, Req, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MembresiasPagoService } from '../services/membresias-pago.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CrearOrdenPagoDto } from '../dto/crear-orden-pago.dto';

@ApiTags('pagos-membresias')
@Controller()
export class PagosMembresiasController {
  constructor(private readonly pagoService: MembresiasPagoService) {}

  @Get('membresias/disponibles')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List memberships with higher level than current user membership' })
  findDisponibles(@Req() req: any) {
    return this.pagoService.findDisponibles(req.user.sub);
  }

  @Post('pagos-membresias/orden')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a PayPal order for membership upgrade' })
  crearOrden(@Req() req: any, @Body() dto: CrearOrdenPagoDto) {
    return this.pagoService.crearOrden(req.user.sub, dto.idMembresia);
  }

  @Post('pagos-membresias/:idOrdenExterna/capturar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Capture a PayPal order after client approval' })
  capturarOrden(@Req() req: any, @Param('idOrdenExterna') idOrdenExterna: string) {
    return this.pagoService.capturarOrden(idOrdenExterna, req.user.sub);
  }

  @Post('pagos-membresias/webhook')
  @ApiOperation({ summary: 'PayPal webhook for async payment confirmation' })
  async webhook(@Body() body: any, @Headers() headers: Record<string, string>) {
    await this.pagoService.procesarWebhook(body, headers);
    return { received: true };
  }
}
