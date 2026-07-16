import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from '../entities/autor.entity';
import { CreateAutorDto } from '../dto/create-autor.dto';
import { UpdateAutorDto } from '../dto/update-autor.dto';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor)
    private readonly autorRepository: Repository<Autor>,
  ) {}

  findAll() {
    return this.autorRepository.find();
  }

  async findOne(id: number) {
    const autor = await this.autorRepository.findOneBy({ idAutor: id });
    if (!autor) {
      throw new NotFoundException(`Autor with ID ${id} not found`);
    }
    return autor;
  }

  create(createAutorDto: CreateAutorDto) {
    const autor = this.autorRepository.create(createAutorDto);
    return this.autorRepository.save(autor);
  }

  async update(id: number, updateAutorDto: UpdateAutorDto) {
    const autor = await this.findOne(id);
    Object.assign(autor, updateAutorDto);
    return this.autorRepository.save(autor);
  }

  async remove(id: number) {
    const autor = await this.findOne(id);
    await this.autorRepository.remove(autor);
    return { message: `Autor "${autor.nombre}" has been deleted` };
  }
}
