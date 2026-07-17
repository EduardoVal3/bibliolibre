import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTurnoDto {
  @ApiProperty({ example: 'Matutino' })
  @IsString()
  @IsNotEmpty()
  nombreTurno: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  @IsNotEmpty()
  horaInicio: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  @IsNotEmpty()
  horaFin: string;
}
