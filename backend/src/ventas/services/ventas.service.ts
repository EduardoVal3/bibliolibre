import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from '../entities/venta.entity';
import { CreateVentaDto } from '../dto/create-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateVentaDto) {
    if (dto.productos.length !== dto.cantidades.length) {
      throw new BadRequestException('productos and cantidades arrays must have the same length');
    }

    const result = await this.dataSource.query(
      `CALL sp_registrar_venta($1, $2, $3, $4, $5, $6)`,
      [
        dto.idUsuario,
        dto.idEmpleado,
        dto.productos,
        dto.cantidades,
        dto.idMetodoPago,
        null,
      ],
    );

    const createdId = result[0]?.p_idventa;
    if (!createdId) {
      throw new BadRequestException('Sale registration failed');
    }

    return this.findOne(createdId);
  }

  async findAll(query: { page?: number; pageSize?: number; empleado?: number; fechaDesde?: string; fechaHasta?: string }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const qb = this.ventaRepository.createQueryBuilder('v')
      .leftJoinAndSelect('v.empleado', 'emp')
      .leftJoinAndSelect('emp.persona', 'per')
      .leftJoinAndSelect('v.detalles', 'd')
      .leftJoinAndSelect('d.producto', 'p')
      .leftJoinAndSelect('v.pagos', 'pg')
      .leftJoinAndSelect('pg.metodoPago', 'mp');

    if (query.empleado) {
      qb.andWhere('v.idempleado = :empleado', { empleado: query.empleado });
    }
    if (query.fechaDesde) {
      qb.andWhere('v.fechaventa >= :fechaDesde', { fechaDesde: query.fechaDesde });
    }
    if (query.fechaHasta) {
      qb.andWhere('v.fechaventa <= :fechaHasta', { fechaHasta: query.fechaHasta });
    }

    qb.orderBy('v.fechaventa', 'DESC');

    const [data, total] = await qb.skip(skip).take(pageSize).getManyAndCount();
    return { data, meta: { total, page, pageSize } };
  }

  async findOne(id: number) {
    const venta = await this.ventaRepository.findOne({
      where: { idVenta: id },
      relations: {
        empleado: { persona: true },
        detalles: { producto: true },
        pagos: { metodoPago: true },
      },
    });
    if (!venta) throw new NotFoundException(`Sale with ID ${id} not found`);
    return venta;
  }
}
