import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateDescargaAccesoDto {
  @ApiProperty({ example: 'Descarga', enum: ['Descarga', 'Visualización'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Descarga', 'Visualización'])
  tipoAccion: string;
}
