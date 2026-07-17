import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRecursoDigitalDto {
  @ApiProperty({ example: 'Historia Universal Vol. 1' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Libro electrónico', required: false })
  @IsString()
  @IsOptional()
  tipoRecurso?: string;

  @ApiProperty({ example: 'PDF', required: false })
  @IsString()
  @IsOptional()
  formato?: string;

  @ApiProperty({ example: 'https://biblioteca.ejemplo/recursos/1', required: false })
  @IsString()
  @IsOptional()
  urlAcceso?: string;
}
