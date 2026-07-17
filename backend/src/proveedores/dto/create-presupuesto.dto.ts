import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreatePresupuestoDto {
  @ApiProperty({ example: 2025 })
  @IsInt()
  @Min(2000)
  anio: number;

  @ApiProperty({ example: 500000.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoAsignado: number;
}
