import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateProveedorDto {
  @ApiProperty({ example: 'Distribuidora Cultural S.A.' })
  @IsString()
  @IsNotEmpty()
  nombreEmpresa: string;

  @ApiProperty({ example: 'Juan Pérez', required: false })
  @IsString()
  @IsOptional()
  contacto?: string;

  @ApiProperty({ example: '+54 11 5555-1234', required: false })
  @IsString()
  @IsOptional()
  telefono?: string;

  @ApiProperty({ example: 'contacto@distcultural.com', required: false })
  @IsEmail()
  @IsOptional()
  correo?: string;
}
