import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrdenCompra } from '../entities/orden-compra.entity';
import { DetalleOrden } from '../entities/detalle-orden.entity';
import { CreateOrdenCompraDto } from '../dto/create-orden-compra.dto';

@Injectable()
export class OrdenesCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private readonly repository: Repository<OrdenCompra>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(page = 1, pageSize = 20) {
    const [data, total] = await this.repository.findAndCount({
      relations: { proveedor: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { idOrdenCompra: 'DESC' },
    });
    return { data, meta: { total, page, pageSize } };
  }

  async findOne(id: number) {
    const item = await this.repository.findOne({
      where: { idOrdenCompra: id },
      relations: { proveedor: true, presupuesto: true, detalles: true },
    });
    if (!item) throw new NotFoundException(`Orden de compra with ID ${id} not found`);
    return item;
  }

  async create(createDto: CreateOrdenCompraDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const total = createDto.detalles.reduce(
        (sum, d) => sum + d.cantidad * d.precioUnitario,
        0,
      );

      const orden = queryRunner.manager.create(OrdenCompra, {
        idProveedor: createDto.idProveedor,
        idPresupuesto: createDto.idPresupuesto,
        fechaOrden: new Date().toISOString().split('T')[0],
        totalOrden: total,
      });
      const saved = await queryRunner.manager.save(orden);

      for (const detalle of createDto.detalles) {
        const item = queryRunner.manager.create(DetalleOrden, {
          idOrdenCompra: saved.idOrdenCompra,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
        });
        await queryRunner.manager.save(item);
      }

      await queryRunner.commitTransaction();

      return this.findOne(saved.idOrdenCompra);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.message?.includes('excede el presupuesto')) {
        throw new BadRequestException(err.message);
      }
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
