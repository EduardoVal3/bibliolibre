import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateHistorialMembresiaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  idMembresia: number;

  @ApiProperty({ example: '2026-07-16', required: false })
  @IsString()
  @IsOptional()
  fechaInicio?: string;
}
