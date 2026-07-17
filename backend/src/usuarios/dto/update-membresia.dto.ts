import { PartialType } from '@nestjs/swagger';
import { CreateMembresiaDto } from './create-membresia.dto';

export class UpdateMembresiaDto extends PartialType(CreateMembresiaDto) {}
