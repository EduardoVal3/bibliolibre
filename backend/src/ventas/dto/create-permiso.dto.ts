import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermisoDto {
  @ApiProperty({ example: 'Registrar_Venta' })
  @IsString()
  @IsNotEmpty()
  nombrePermiso: string;

  @ApiProperty({ example: 'Permite registrar una venta', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
