import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRolEmpleadoDto {
  @ApiProperty({ example: 'Cajero' })
  @IsString()
  @IsNotEmpty()
  nombreRol: string;

  @ApiProperty({ example: 'Encargado de caja y ventas', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
