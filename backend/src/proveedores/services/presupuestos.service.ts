import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presupuesto } from '../entities/presupuesto.entity';
import { VwPresupuestoEjecutado } from '../entities/vw-presupuesto-ejecutado.entity';
import { CreatePresupuestoDto } from '../dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from '../dto/update-presupuesto.dto';

@Injectable()
export class PresupuestosService {
  constructor(
    @InjectRepository(Presupuesto)
    private readonly repository: Repository<Presupuesto>,
    @InjectRepository(VwPresupuestoEjecutado)
    private readonly viewRepository: Repository<VwPresupuestoEjecutado>,
  ) {}

  async findAll(page = 1, pageSize = 20) {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { anio: 'DESC', idPresupuesto: 'ASC' },
    });
    return { data, meta: { total, page, pageSize } };
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idPresupuesto: id });
    if (!item) throw new NotFoundException(`Presupuesto with ID ${id} not found`);
    return item;
  }

  create(createDto: CreatePresupuestoDto) {
    const item = this.repository.create(createDto);
    return this.repository.save(item);
  }

  async update(id: number, updateDto: UpdatePresupuestoDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Presupuesto for year ${item.anio} deleted` };
  }

  async findEjecucion(id: number) {
    const row = await this.viewRepository.findOneBy({ idPresupuesto: id });
    if (!row) throw new NotFoundException(`Presupuesto with ID ${id} not found`);
    return row;
  }
}
