import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { RecursoDigital } from '../entities/recurso-digital.entity';
import { DescargaAcceso } from '../entities/descarga-acceso.entity';
import { VwRecursosMasDescargados } from '../entities/vw-recursos-mas-descargados.entity';
import { CreateRecursoDigitalDto } from '../dto/create-recurso-digital.dto';
import { UpdateRecursoDigitalDto } from '../dto/update-recurso-digital.dto';
import { CreateDescargaAccesoDto } from '../dto/create-descarga-acceso.dto';

@Injectable()
export class RecursosDigitalesService {
  constructor(
    @InjectRepository(RecursoDigital)
    private readonly repository: Repository<RecursoDigital>,
    @InjectRepository(DescargaAcceso)
    private readonly descargaRepository: Repository<DescargaAcceso>,
    @InjectRepository(VwRecursosMasDescargados)
    private readonly viewRepository: Repository<VwRecursosMasDescargados>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(page = 1, pageSize = 20) {
    const [data, total] = await this.repository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { idRecurso: 'ASC' },
    });
    return { data, meta: { total, page, pageSize } };
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idRecurso: id });
    if (!item) throw new NotFoundException(`Recurso digital with ID ${id} not found`);
    return item;
  }

  create(createDto: CreateRecursoDigitalDto) {
    const item = this.repository.create(createDto);
    return this.repository.save(item);
  }

  async update(id: number, updateDto: UpdateRecursoDigitalDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Recurso digital "${item.titulo}" deleted` };
  }

  async registrarAcceso(idRecurso: number, idUsuario: number, createDto: CreateDescargaAccesoDto) {
    const recurso = await this.findOne(idRecurso);

    const puedeAcceder = await this.dataSource.query(
      'SELECT fn_membresia_activa($1) as activa',
      [idUsuario],
    );
    const membresiaActiva = puedeAcceder[0]?.activa;

    if (!membresiaActiva) {
      throw new ForbiddenException('Se requiere membresía activa para acceder a recursos digitales');
    }

    const item = this.descargaRepository.create({
      idRecurso,
      idUsuario,
      tipoAccion: createDto.tipoAccion,
      fechaAcceso: new Date().toISOString(),
    });
    return this.descargaRepository.save(item);
  }

  findMasDescargados() {
    return this.viewRepository.find({ order: { totalDescargas: 'DESC' } });
  }
}
