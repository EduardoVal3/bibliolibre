import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt } from 'class-validator';

export class CreateMembresiaDto {
  @ApiProperty({ example: 'Premium' })
  @IsString()
  @IsNotEmpty()
  nombreMembresia: string;

  @ApiProperty({ example: 'Mayor cantidad de préstamos y acceso digital.', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 350.00, required: false })
  @IsNumber()
  @IsOptional()
  costo?: number;

  @ApiProperty({ example: 12, required: false })
  @IsInt()
  @IsOptional()
  duracionMeses?: number;
}
