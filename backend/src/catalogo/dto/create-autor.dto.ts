import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAutorDto {
  @ApiProperty({ example: 'Gabriel García Márquez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'Colombia', required: false })
  @IsString()
  @IsOptional()
  nacionalidad?: string;

  @ApiProperty({ example: 'Escritor colombiano, Premio Nobel de Literatura.', required: false })
  @IsString()
  @IsOptional()
  biografia?: string;
}
