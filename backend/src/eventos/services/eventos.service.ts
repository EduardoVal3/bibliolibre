import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Evento } from '../entities/evento.entity';
import { AsistenciaEvento } from '../entities/asistencia-evento.entity';
import { VwEventosConCupo } from '../entities/vw-eventos-con-cupo.entity';
import { CreateEventoDto } from '../dto/create-evento.dto';
import { UpdateEventoDto } from '../dto/update-evento.dto';

@Injectable()
export class EventosService {
  constructor(
    @InjectRepository(Evento)
    private readonly repository: Repository<Evento>,
    @InjectRepository(AsistenciaEvento)
    private readonly asistenciaRepository: Repository<AsistenciaEvento>,
    @InjectRepository(VwEventosConCupo)
    private readonly viewRepository: Repository<VwEventosConCupo>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(page = 1, pageSize = 20) {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { fechaEvento: 'DESC', idEvento: 'ASC' },
    });
    return { data, meta: { total, page, pageSize } };
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idEvento: id });
    if (!item) throw new NotFoundException(`Evento with ID ${id} not found`);
    return item;
  }

  create(createDto: CreateEventoDto) {
    const item = this.repository.create(createDto);
    return this.repository.save(item);
  }

  async update(id: number, updateDto: UpdateEventoDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Evento "${item.nombreEvento}" deleted` };
  }

  async findCupo(id: number) {
    await this.findOne(id);
    const row = await this.viewRepository.findOneBy({ idEvento: id });
    return row;
  }

  async inscribir(idEvento: number, idUsuario: number) {
    const evento = await this.findOne(idEvento);

    const existente = await this.asistenciaRepository.findOne({
      where: { idEvento, idUsuario },
    });
    if (existente) {
      throw new ConflictException('El usuario ya está inscrito en este evento');
    }

    try {
      const item = this.asistenciaRepository.create({
        idEvento,
        idUsuario,
        fechaRegistro: new Date().toISOString().split('T')[0],
        asistencia: 'Pendiente',
      });
      return await this.asistenciaRepository.save(item);
    } catch (err) {
      if (err.message?.includes('capacidad máxima')) {
        throw new ConflictException('El evento alcanzó su capacidad máxima');
      }
      throw err;
    }
  }

  async findAsistenciasByEvento(idEvento: number) {
    return this.asistenciaRepository.find({
      where: { idEvento },
      relations: { usuario: { persona: true } },
      order: { fechaRegistro: 'ASC' },
    });
  }

  async marcarAsistencia(idEvento: number, idUsuario: number, asistencia: string) {
    await this.findOne(idEvento);

    const item = await this.asistenciaRepository.findOne({
      where: { idEvento, idUsuario },
    });
    if (!item) {
      throw new NotFoundException('El usuario no está inscrito en este evento');
    }

    item.asistencia = asistencia;
    return this.asistenciaRepository.save(item);
  }
}
