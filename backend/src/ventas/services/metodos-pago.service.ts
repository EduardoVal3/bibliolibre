import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetodoPago } from '../entities/metodo-pago.entity';
import { CreateMetodoPagoDto } from '../dto/create-metodo-pago.dto';
import { UpdateMetodoPagoDto } from '../dto/update-metodo-pago.dto';

@Injectable()
export class MetodosPagoService {
  constructor(
    @InjectRepository(MetodoPago)
    private readonly repository: Repository<MetodoPago>,
  ) {}

  findAll() {
    return this.repository.find({ order: { nombreMetodo: 'ASC' } });
  }

  async findOne(id: number) {
    const item = await this.repository.findOneBy({ idMetodoPago: id });
    if (!item) throw new NotFoundException(`Payment method with ID ${id} not found`);
    return item;
  }

  create(dto: CreateMetodoPagoDto) {
    const item = this.repository.create(dto);
    return this.repository.save(item);
  }

  async update(id: number, dto: UpdateMetodoPagoDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.remove(item);
    return { message: `Payment method "${item.nombreMetodo}" deleted` };
  }
}
