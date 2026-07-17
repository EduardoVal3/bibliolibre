import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class MarcarAsistenciaDto {
  @ApiProperty({ example: 'Sí', enum: ['Sí', 'No', 'Pendiente'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Sí', 'No', 'Pendiente'])
  asistencia: string;
}
