import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RolEmpleado } from '../entities/rol-empleado.entity';
import { CreateRolEmpleadoDto } from '../dto/create-rol-empleado.dto';
import { UpdateRolEmpleadoDto } from '../dto/update-rol-empleado.dto';

@Injectable()
export class RolesEmpleadoService {
  constructor(
    @InjectRepository(RolEmpleado)
    private readonly repository: Repository<RolEmpleado>,
    private readonly dataSource: DataSource,
  ) {}

  findAll() {
    return this.repository.find({ order: { nombreRol: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idRol: id });
    if (!item) throw new NotFoundException(`Role with ID ${id} not found`);
    return item;
  }

  create(dto: CreateRolEmpleadoDto) {
    const item = this.repository.create(dto);
    return this.repository.save(item);
  }

  async update(id: number, dto: UpdateRolEmpleadoDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Role "${item.nombreRol}" deleted` };
  }

  async assignPermiso(idRol: number, idPermiso: number) {
    await this.dataSource.query(
      `INSERT INTO rol_permiso (idrol, idpermiso) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [idRol, idPermiso],
    );
    return { message: 'Permission assigned to role' };
  }
}
