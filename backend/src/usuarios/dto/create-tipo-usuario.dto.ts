import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTipoUsuarioDto {
  @ApiProperty({ example: 'Estudiante' })
  @IsString()
  @IsNotEmpty()
  nombreTipo: string;

  @ApiProperty({ example: 'Usuarios matriculados en instituciones educativas.', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
