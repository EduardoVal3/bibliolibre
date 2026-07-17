import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Membresia } from '../entities/membresia.entity';
import { TipoUsuario } from '../entities/tipo-usuario.entity';
import { CreateMembresiaDto } from '../dto/create-membresia.dto';
import { UpdateMembresiaDto } from '../dto/update-membresia.dto';
import { CreateTipoUsuarioDto } from '../dto/create-tipo-usuario.dto';
import { UpdateTipoUsuarioDto } from '../dto/update-tipo-usuario.dto';

@Injectable()
export class MembresiasService {
  constructor(
    @InjectRepository(Membresia)
    private readonly membresiaRepository: Repository<Membresia>,
    @InjectRepository(TipoUsuario)
    private readonly tipoUsuarioRepository: Repository<TipoUsuario>,
  ) {}

  // Membresias
  async findAllMembresias() {
    return this.membresiaRepository.find();
  }

  async findMembresia(id: number) {
    const m = await this.membresiaRepository.findOne({ where: { idMembresia: id } });
    if (!m) throw new NotFoundException(`Membership with ID ${id} not found`);
    return m;
  }

  async createMembresia(dto: CreateMembresiaDto) {
    return this.membresiaRepository.save(dto as any);
  }

  async updateMembresia(id: number, dto: UpdateMembresiaDto) {
    const m = await this.findMembresia(id);
    Object.assign(m, dto);
    return this.membresiaRepository.save(m);
  }

  async deleteMembresia(id: number) {
    const m = await this.findMembresia(id);
    await this.membresiaRepository.remove(m);
    return { message: `Membership ${id} deleted` };
  }

  // Tipos de Usuario
  async findAllTiposUsuario() {
    return this.tipoUsuarioRepository.find();
  }

  async findTipoUsuario(id: number) {
    const t = await this.tipoUsuarioRepository.findOne({ where: { idTipoUsuario: id } });
    if (!t) throw new NotFoundException(`User type with ID ${id} not found`);
    return t;
  }

  async createTipoUsuario(dto: CreateTipoUsuarioDto) {
    return this.tipoUsuarioRepository.save(dto as any);
  }

  async updateTipoUsuario(id: number, dto: UpdateTipoUsuarioDto) {
    const t = await this.findTipoUsuario(id);
    Object.assign(t, dto);
    return this.tipoUsuarioRepository.save(t);
  }

  async deleteTipoUsuario(id: number) {
    const t = await this.findTipoUsuario(id);
    await this.tipoUsuarioRepository.remove(t);
    return { message: `User type ${id} deleted` };
  }
}
