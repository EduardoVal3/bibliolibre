import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, ArrayNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreatePrestamoDto {
  @ApiProperty({ example: '2026-07-16' })
  @IsDateString()
  @IsOptional()
  fechaPrestamo?: string;

  @ApiProperty({ example: '2026-08-16' })
  @IsDateString()
  fechaLimiteDevolucion: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  idsEdicionVolumen: number[];
}
