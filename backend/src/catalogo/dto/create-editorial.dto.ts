import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEditorialDto {
  @ApiProperty({ example: 'Editorial Planeta' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'España', required: false })
  @IsString()
  @IsOptional()
  pais?: string;

  @ApiProperty({ example: 'contacto@planeta.es', required: false })
  @IsString()
  @IsOptional()
  contacto?: string;
}
