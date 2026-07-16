import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIdiomaDto {
  @ApiProperty({ example: 'Español' })
  @IsString()
  @IsNotEmpty()
  nombreIdioma: string;
}
