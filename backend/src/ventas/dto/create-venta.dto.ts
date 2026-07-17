import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export class CreateVentaDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  idUsuario: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  idEmpleado: number;

  @ApiProperty({ example: [1, 2], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  productos: number[];

  @ApiProperty({ example: [2, 1], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  cantidades: number[];

  @ApiProperty({ example: 1 })
  @IsInt()
  idMetodoPago: number;
}
