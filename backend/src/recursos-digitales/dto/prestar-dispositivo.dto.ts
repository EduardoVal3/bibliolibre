import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsDateString } from 'class-validator';

export class PrestarDispositivoDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ example: '2026-07-30', required: false })
  @IsDateString()
  @IsOptional()
  fechaLimiteDevolucion?: string;
}
