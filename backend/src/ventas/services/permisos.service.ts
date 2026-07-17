import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permiso } from '../entities/permiso.entity';
import { CreatePermisoDto } from '../dto/create-permiso.dto';
import { UpdatePermisoDto } from '../dto/update-permiso.dto';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly repository: Repository<Permiso>,
  ) {}

  findAll() {
    return this.repository.find({ order: { nombrePermiso: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idPermiso: id });
    if (!item) throw new NotFoundException(`Permission with ID ${id} not found`);
    return item;
  }

  create(dto: CreatePermisoDto) {
    const item = this.repository.create(dto);
    return this.repository.save(item);
  }

  async update(id: number, dto: UpdatePermisoDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Permission "${item.nombrePermiso}" deleted` };
  }
}
