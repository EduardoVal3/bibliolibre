import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsInt, IsOptional, Min } from 'class-validator';

export class CreateProductoVentaDto {
  @ApiProperty({ example: 'Lápiz HB' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Lápiz de grafito HB', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 1.5 })
  @IsNumber()
  precio: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  stockDisponible: number;
}
