import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CrearOrdenPagoDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @IsNotEmpty()
  idMembresia: number;
}
