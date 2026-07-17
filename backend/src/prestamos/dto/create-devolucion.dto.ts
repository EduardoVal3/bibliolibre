import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateDevolucionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  idEdicionVolumen: number;

  @ApiProperty({ example: '2026-07-20', required: false })
  @IsDateString()
  @IsOptional()
  fechaDevolucion?: string;

  @ApiProperty({ example: 'Bueno', required: false })
  @IsString()
  @IsOptional()
  estadoEntrega?: string;
}
