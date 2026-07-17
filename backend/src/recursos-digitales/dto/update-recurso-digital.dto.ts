import { PartialType } from '@nestjs/swagger';
import { CreateRecursoDigitalDto } from './create-recurso-digital.dto';

export class UpdateRecursoDigitalDto extends PartialType(CreateRecursoDigitalDto) {}
