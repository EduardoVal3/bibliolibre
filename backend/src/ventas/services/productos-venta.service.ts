import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoVenta } from '../entities/producto-venta.entity';
import { CreateProductoVentaDto } from '../dto/create-producto-venta.dto';
import { UpdateProductoVentaDto } from '../dto/update-producto-venta.dto';

@Injectable()
export class ProductosVentaService {
  constructor(
    @InjectRepository(ProductoVenta)
    private readonly repository: Repository<ProductoVenta>,
  ) {}

  findAll() {
    return this.repository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idProducto: id });
    if (!item) throw new NotFoundException(`Product with ID ${id} not found`);
    return item;
  }

  create(dto: CreateProductoVentaDto) {
    const item = this.repository.create(dto);
    return this.repository.save(item);
  }

  async update(id: number, dto: UpdateProductoVentaDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Product "${item.nombre}" deleted` };
  }
}
