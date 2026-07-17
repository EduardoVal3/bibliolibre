import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { DispositivoPrestado } from '../entities/dispositivo-prestado.entity';
import { PrestamoDispositivo } from '../entities/prestamo-dispositivo.entity';
import { CreateDispositivoDto } from '../dto/create-dispositivo.dto';
import { UpdateDispositivoDto } from '../dto/update-dispositivo.dto';
import { PrestarDispositivoDto } from '../dto/prestar-dispositivo.dto';

@Injectable()
export class DispositivosService {
  constructor(
    @InjectRepository(DispositivoPrestado)
    private readonly repository: Repository<DispositivoPrestado>,
    @InjectRepository(PrestamoDispositivo)
    private readonly prestamoRepository: Repository<PrestamoDispositivo>,
    private readonly dataSource: DataSource,
  ) {}

  findAll() {
    return this.repository.find({ order: { idDispositivo: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idDispositivo: id });
    if (!item) throw new NotFoundException(`Dispositivo with ID ${id} not found`);
    return item;
  }

  create(createDto: CreateDispositivoDto) {
    const item = this.repository.create({ ...createDto, estado: createDto.estado || 'Disponible' });
    return this.repository.save(item);
  }

  async update(id: number, updateDto: UpdateDispositivoDto) {
    const item = await this.findOne(id);
    Object.assign(item, updateDto);
    return this.repository.save(item);
  }

  async prestar(id: number, dto: PrestarDispositivoDto) {
    const dispositivo = await this.findOne(id);
    if (dispositivo.estado === 'Prestado') {
      throw new BadRequestException('El dispositivo ya está prestado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const prestamo = queryRunner.manager.create(PrestamoDispositivo, {
        idDispositivo: id,
        idUsuario: dto.idUsuario,
        fechaPrestamo: new Date().toISOString().split('T')[0],
        fechaLimiteDevolucion: dto.fechaLimiteDevolucion,
      });
      await queryRunner.manager.save(prestamo);

      await queryRunner.manager.update(DispositivoPrestado, id, { estado: 'Prestado' });

      await queryRunner.commitTransaction();
      return this.prestamoRepository.findOne({
        where: { idPrestamoDispositivo: prestamo.idPrestamoDispositivo },
        relations: { dispositivo: true, usuario: { persona: true } },
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async devolver(id: number) {
    const dispositivo = await this.findOne(id);

    const prestamoActivo = await this.prestamoRepository.findOne({
      where: { idDispositivo: id, fechaDevolucion: IsNull() },
      order: { fechaPrestamo: 'DESC' },
    });

    if (!prestamoActivo) {
      throw new BadRequestException('No hay préstamo activo para este dispositivo');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const hoy = new Date().toISOString().split('T')[0];
      await queryRunner.manager.update(PrestamoDispositivo, prestamoActivo.idPrestamoDispositivo, {
        fechaDevolucion: hoy,
      });
      await queryRunner.manager.update(DispositivoPrestado, id, { estado: 'Disponible' });

      await queryRunner.commitTransaction();
      return this.prestamoRepository.findOne({
        where: { idPrestamoDispositivo: prestamoActivo.idPrestamoDispositivo },
        relations: { dispositivo: true, usuario: { persona: true } },
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async prestamos(id: number) {
    await this.findOne(id);
    return this.prestamoRepository.find({
      where: { idDispositivo: id },
      relations: { usuario: { persona: true } },
      order: { fechaPrestamo: 'DESC' },
    });
  }
}
