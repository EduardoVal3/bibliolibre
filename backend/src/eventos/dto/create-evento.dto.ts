import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsDateString } from 'class-validator';

export class CreateEventoDto {
  @ApiProperty({ example: 'Feria del Libro 2026' })
  @IsString()
  @IsNotEmpty()
  nombreEvento: string;

  @ApiProperty({ example: 'Evento anual de promoción de la lectura', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: '2026-08-15' })
  @IsDateString()
  fechaEvento: string;

  @ApiProperty({ example: 200, required: false })
  @IsInt()
  @Min(1)
  @IsOptional()
  capacidadMaxima?: number;

  @ApiProperty({ example: 'Salón Principal', required: false })
  @IsString()
  @IsOptional()
  lugar?: string;
}
