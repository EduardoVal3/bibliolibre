import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsISBN,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateLibroDto {
  @ApiProperty({ example: 'Cien años de soledad' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: '9780307474728', required: false })
  @IsISBN()
  @IsOptional()
  isbn?: string;

  @ApiProperty({ example: 1967 })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  anioPublicacion: number;

  @ApiProperty({ example: '1ra' })
  @IsString()
  @IsNotEmpty()
  edicion: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  idEditorial: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  idCategoria: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  idIdioma: number;

  @ApiProperty({ example: [1], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  autores: number[];

  @ApiProperty({ example: [1], type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  palabrasClave: number[];
}
