import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';

export class RegistroDto {
  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @IsNotEmpty()
  pNombre: string;

  @ApiProperty({ example: 'Alberto', required: false })
  @IsString()
  @IsOptional()
  sNombre?: string;

  @ApiProperty({ example: 'Ramírez' })
  @IsString()
  @IsNotEmpty()
  pApellido: string;

  @ApiProperty({ example: 'López', required: false })
  @IsString()
  @IsOptional()
  sApellido?: string;

  @ApiProperty({ example: 'carlos.ramirez@gmail.com' })
  @IsEmail()
  correo: string;

  @ApiProperty({ example: '9999-1001', required: false })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({ example: 'Tegucigalpa', required: false })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  idTipoUsuario: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  idMembresia: number;
}
