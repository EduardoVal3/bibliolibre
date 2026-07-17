import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMetodoPagoDto {
  @ApiProperty({ example: 'Efectivo' })
  @IsString()
  @IsNotEmpty()
  nombreMetodo: string;
}
