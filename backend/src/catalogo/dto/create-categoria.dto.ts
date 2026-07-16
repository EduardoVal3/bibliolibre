import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Tecnología' })
  @IsString()
  @IsNotEmpty()
  nombreCategoria: string;

  @ApiProperty({ example: 'Libros sobre programación y computación', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
