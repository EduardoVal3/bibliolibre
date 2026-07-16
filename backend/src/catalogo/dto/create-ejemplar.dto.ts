import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEjemplarDto {
  @ApiProperty({ example: 'LIB0001' })
  @IsString()
  @IsNotEmpty()
  codigoBarras: string;

  @ApiProperty({ example: 'Excelente' })
  @IsString()
  @IsNotEmpty()
  estadoFisico: string;

  @ApiProperty({ example: 'Disponible', required: false })
  @IsString()
  @IsOptional()
  disponibilidad?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  idLibro: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  idUbicacion?: number;
}
