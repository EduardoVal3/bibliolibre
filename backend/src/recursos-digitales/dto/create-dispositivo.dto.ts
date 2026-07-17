import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDispositivoDto {
  @ApiProperty({ example: 'iPad Pro 11" Generación 3' })
  @IsString()
  @IsNotEmpty()
  nombreDispositivo: string;

  @ApiProperty({ example: 'Tablet', required: false })
  @IsString()
  @IsOptional()
  tipoDispositivo?: string;

  @ApiProperty({ example: 'SN-IPAD-001', required: false })
  @IsString()
  @IsOptional()
  numeroSerie?: string;

  @ApiProperty({ example: 'Disponible', required: false })
  @IsString()
  @IsOptional()
  estado?: string;
}
