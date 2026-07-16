import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from '../entities/categoria.entity';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private readonly repository: Repository<Categoria>,
  ) {}

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idCategoria: id });
    if (!item) {
      throw new NotFoundException(`Categoria with ID ${id} not found`);
    }
    return item;
  }

  create(createDto: CreateCategoriaDto) {
    const item = this.repository.create(createDto);
    return this.repository.save(item);
  }

  async update(id: number, updateDto: UpdateCategoriaDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Categoria "${item.nombreCategoria}" has been deleted` };
  }
}
