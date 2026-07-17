import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from '../entities/turno.entity';
import { CreateTurnoDto } from '../dto/create-turno.dto';
import { UpdateTurnoDto } from '../dto/update-turno.dto';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly repository: Repository<Turno>,
  ) {}

  findAll() {
    return this.repository.find({ order: { nombreTurno: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idTurno: id });
    if (!item) throw new NotFoundException(`Shift with ID ${id} not found`);
    return item;
  }

  create(dto: CreateTurnoDto) {
    const item = this.repository.create(dto);
    return this.repository.save(item);
  }

  async update(id: number, dto: UpdateTurnoDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Shift "${item.nombreTurno}" deleted` };
  }
}
