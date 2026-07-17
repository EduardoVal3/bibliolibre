import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsArray, ArrayNotEmpty, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class DetalleOrdenItemDto {
  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  cantidad: number;

  @ApiProperty({ example: 150.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioUnitario: number;
}

export class CreateOrdenCompraDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  idProveedor: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  idPresupuesto?: number;

  @ApiProperty({
    type: [DetalleOrdenItemDto],
    example: [{ cantidad: 10, precioUnitario: 150.00 }],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DetalleOrdenItemDto)
  detalles: DetalleOrdenItemDto[];
}
