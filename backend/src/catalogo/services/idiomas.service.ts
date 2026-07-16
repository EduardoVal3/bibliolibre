import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idioma } from '../entities/idioma.entity';
import { CreateIdiomaDto } from '../dto/create-idioma.dto';
import { UpdateIdiomaDto } from '../dto/update-idioma.dto';

@Injectable()
export class IdiomasService {
  constructor(
    @InjectRepository(Idioma)
    private readonly repository: Repository<Idioma>,
  ) {}

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idIdioma: id });
    if (!item) {
      throw new NotFoundException(`Idioma with ID ${id} not found`);
    }
    return item;
  }

  create(createDto: CreateIdiomaDto) {
    const item = this.repository.create(createDto);
    return this.repository.save(item);
  }

  async update(id: number, updateDto: UpdateIdiomaDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Idioma "${item.nombreIdioma}" has been deleted` };
  }
}
