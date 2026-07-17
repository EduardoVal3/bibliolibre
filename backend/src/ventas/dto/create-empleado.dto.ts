import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsDateString } from 'class-validator';

export class CreateEmpleadoDto {
  @ApiProperty({ example: '2026-01-15', required: false })
  @IsDateString()
  @IsOptional()
  fechaContratacion?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  idPersona: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  idRol: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  idTurno?: number;
}
