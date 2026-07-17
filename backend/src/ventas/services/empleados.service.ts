import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empleado } from '../entities/empleado.entity';
import { CreateEmpleadoDto } from '../dto/create-empleado.dto';
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto';

@Injectable()
export class EmpleadosService {
  constructor(
    @InjectRepository(Empleado)
    private readonly repository: Repository<Empleado>,
  ) {}

  findAll() {
    return this.repository.find({ relations: { persona: true, rol: true, turno: true } });
  }

  async findOne(id: number) {
    const item = await this.repository.findOne({
      where: { idEmpleado: id },
      relations: { persona: true, rol: true, turno: true },
    });
    if (!item) throw new NotFoundException(`Employee with ID ${id} not found`);
    return item;
  }

  create(dto: CreateEmpleadoDto) {
    const item = this.repository.create(dto);
    return this.repository.save(item);
  }

  async update(id: number, dto: UpdateEmpleadoDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Employee ${id} deleted` };
  }
}
