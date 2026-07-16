import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EdicionVolumen } from '../entities/edicion-volumen.entity';
import { CreateEjemplarDto } from '../dto/create-ejemplar.dto';
import { UpdateEjemplarEstadoDto } from '../dto/update-ejemplar-estado.dto';

@Injectable()
export class EjemplaresService {
  constructor(
    @InjectRepository(EdicionVolumen)
    private readonly repository: Repository<EdicionVolumen>,
  ) {}

  async findByBarcode(barcode: string) {
    const copy = await this.repository.findOne({
      where: { codigoBarras: barcode },
      relations: {
        libro: true,
        ubicacion: true,
      },
    });
    if (!copy) {
      throw new NotFoundException(`Ejemplar with barcode "${barcode}" not found`);
    }
    return copy;
  }

  async findOne(id: number) {
    const copy = await this.repository.findOne({
      where: { idEdicionVolumen: id },
      relations: {
        libro: true,
        ubicacion: true,
      },
    });
    if (!copy) {
      throw new NotFoundException(`Ejemplar with ID ${id} not found`);
    }
    return copy;
  }

  async create(createDto: CreateEjemplarDto) {
    const existing = await this.repository.findOne({
      where: { codigoBarras: createDto.codigoBarras },
    });
    if (existing) {
      throw new BadRequestException(`Ejemplar with barcode "${createDto.codigoBarras}" already exists`);
    }

    const copy = this.repository.create({
      ...createDto,
      disponibilidad: createDto.disponibilidad || 'Disponible',
    });
    
    return this.repository.save(copy);
  }

  async updateEstado(id: number, updateDto: UpdateEjemplarEstadoDto) {
    const copy = await this.findOne(id);
    
    if (updateDto.estadoFisico) {
      copy.estadoFisico = updateDto.estadoFisico;
    }
    if (updateDto.disponibilidad) {
      copy.disponibilidad = updateDto.disponibilidad;
    }

    return this.repository.save(copy);
  }

  async findLocations() {
    return this.repository.manager.query('SELECT idubicacion as "idUbicacion", seccion, pasillo, estanteria FROM ubicaciones_fisicas');
  }
}
