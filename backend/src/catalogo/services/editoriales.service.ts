import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Editorial } from '../entities/editorial.entity';
import { CreateEditorialDto } from '../dto/create-editorial.dto';
import { UpdateEditorialDto } from '../dto/update-editorial.dto';

@Injectable()
export class EditorialesService {
  constructor(
    @InjectRepository(Editorial)
    private readonly repository: Repository<Editorial>,
  ) {}

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idEditorial: id });
    if (!item) {
      throw new NotFoundException(`Editorial with ID ${id} not found`);
    }
    return item;
  }

  create(createDto: CreateEditorialDto) {
    const item = this.repository.create(createDto);
    return this.repository.save(item);
  }

  async update(id: number, updateDto: UpdateEditorialDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Editorial "${item.nombre}" has been deleted` };
  }
}
