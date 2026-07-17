import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from '../entities/proveedor.entity';
import { CreateProveedorDto } from '../dto/create-proveedor.dto';
import { UpdateProveedorDto } from '../dto/update-proveedor.dto';

@Injectable()
export class ProveedoresService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly repository: Repository<Proveedor>,
  ) {}

  async findAll(page = 1, pageSize = 20) {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { idProveedor: 'ASC' },
    });
    return { data, meta: { total, page, pageSize } };
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idProveedor: id });
    if (!item) throw new NotFoundException(`Proveedor with ID ${id} not found`);
    return item;
  }

  create(createDto: CreateProveedorDto) {
    const item = this.repository.create(createDto);
    return this.repository.save(item);
  }

  async update(id: number, updateDto: UpdateProveedorDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Proveedor "${item.nombreEmpresa}" deleted` };
  }
}
