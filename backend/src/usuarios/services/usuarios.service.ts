import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { VwUsuarioCompleto } from '../entities/vw-usuario-completo.entity';
import { HistorialMembresia } from '../entities/historial-membresia.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(VwUsuarioCompleto)
    private readonly vwUsuarioRepository: Repository<VwUsuarioCompleto>,
    @InjectRepository(HistorialMembresia)
    private readonly historialRepository: Repository<HistorialMembresia>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: { page?: number; pageSize?: number }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.vwUsuarioRepository.findAndCount({
      skip,
      take: pageSize,
      order: { fechaRegistro: 'DESC' },
    });

    return { data, meta: { total, page, pageSize } };
  }

  async findMe(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      relations: { persona: true, tipoUsuario: true },
    });
    if (!usuario) throw new NotFoundException('User not found');
    return usuario;
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: id },
      relations: { persona: true, tipoUsuario: true },
    });
    if (!usuario) throw new NotFoundException(`User with ID ${id} not found`);
    return usuario;
  }

  async findMembresiasHistory(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });
    if (!usuario) throw new NotFoundException(`User with ID ${idUsuario} not found`);

    return this.historialRepository.find({
      where: { idUsuario },
      relations: { membresia: true },
      order: { fechaInicio: 'DESC' },
    });
  }

  async update(id: number, data: Partial<Usuario>) {
    const usuario = await this.findOne(id);
    Object.assign(usuario, data);
    return this.usuarioRepository.save(usuario);
  }

  async remove(id: number) {
    const usuario = await this.findOne(id);

    // Check if user has active loans
    const activeLoans = await this.dataSource.query(
      `SELECT COUNT(*) FROM prestamos p
       JOIN detalles_prestamo dp ON dp.idprestamo = p.idprestamo
       JOIN edicion_volumen ev ON ev.idedicionvolumen = dp.idedicionvolumen
       WHERE p.idusuario = $1 AND ev.disponibilidad = 'Prestado'`,
      [id],
    );

    if (parseInt(activeLoans[0].count, 10) > 0) {
      throw new BadRequestException('Cannot delete user with active loans');
    }

    await this.historialRepository.delete({ idUsuario: id });
    await this.usuarioRepository.delete(id);
    return { message: `User ${id} deleted` };
  }

  async addMembresia(idUsuario: number, idMembresia: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });
    if (!usuario) throw new NotFoundException(`User with ID ${idUsuario} not found`);

    const record = this.historialRepository.create({
      idUsuario,
      idMembresia,
      fechaInicio: new Date().toISOString().split('T')[0],
    });

    return this.historialRepository.save(record);
  }
}
