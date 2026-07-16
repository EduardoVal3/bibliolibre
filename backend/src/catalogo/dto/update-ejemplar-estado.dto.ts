import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEjemplarEstadoDto {
  @ApiProperty({ example: 'Regular', required: false })
  @IsString()
  @IsOptional()
  estadoFisico?: string;

  @ApiProperty({ example: 'Disponible', required: false })
  @IsString()
  @IsOptional()
  disponibilidad?: string;
}
