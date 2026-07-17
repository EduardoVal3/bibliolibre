import { PartialType } from '@nestjs/swagger';
import { CreateRolEmpleadoDto } from './create-rol-empleado.dto';

export class UpdateRolEmpleadoDto extends PartialType(CreateRolEmpleadoDto) {}
