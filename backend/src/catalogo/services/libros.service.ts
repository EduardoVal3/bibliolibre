import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Libro } from '../entities/libro.entity';
import { VwCatalogoLibro } from '../entities/vw-catalogo-libro.entity';
import { EdicionVolumen } from '../entities/edicion-volumen.entity';
import { CreateLibroDto } from '../dto/create-libro.dto';
import { UpdateLibroDto } from '../dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
    @InjectRepository(VwCatalogoLibro)
    private readonly vwCatalogoRepository: Repository<VwCatalogoLibro>,
    @InjectRepository(EdicionVolumen)
    private readonly edicionRepository: Repository<EdicionVolumen>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: {
    page?: number;
    pageSize?: number;
    categoria?: number;
    idioma?: number;
    editorial?: number;
    autor?: number;
    palabraClave?: number;
    disponibilidad?: string;
    q?: string;
  }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const qb = this.libroRepository.createQueryBuilder('libro')
      .leftJoinAndSelect('libro.editorial', 'editorial')
      .leftJoinAndSelect('libro.categoria', 'categoria')
      .leftJoinAndSelect('libro.idioma', 'idioma')
      .leftJoinAndSelect('libro.autores', 'autor')
      .leftJoinAndSelect('libro.palabrasClave', 'palabraClave')
      .leftJoinAndSelect('libro.ejemplares', 'ejemplar');

    if (query.categoria) {
      qb.andWhere('libro.idcategoria = :categoria', { categoria: query.categoria });
    }
    if (query.idioma) {
      qb.andWhere('libro.ididioma = :idioma', { idioma: query.idioma });
    }
    if (query.editorial) {
      qb.andWhere('libro.ideditorial = :editorial', { editorial: query.editorial });
    }
    if (query.autor) {
      qb.andWhere((sub) => {
        const subQuery = sub.subQuery()
          .select('la.idlibro')
          .from('libro_autor', 'la')
          .where('la.idautor = :autorId', { autorId: query.autor })
          .getQuery();
        return `libro.idlibro IN ${subQuery}`;
      });
    }
    if (query.palabraClave) {
      qb.andWhere((sub) => {
        const subQuery = sub.subQuery()
          .select('lpc.idlibro')
          .from('libro_palabra_clave', 'lpc')
          .where('lpc.idpalabraclave = :pcId', { pcId: query.palabraClave })
          .getQuery();
        return `libro.idlibro IN ${subQuery}`;
      });
    }
    if (query.disponibilidad) {
      qb.andWhere((sub) => {
        const subQuery = sub.subQuery()
          .select('ev.idlibro')
          .from('edicion_volumen', 'ev')
          .where('ev.disponibilidad = :disp', { disp: query.disponibilidad })
          .getQuery();
        return `libro.idlibro IN ${subQuery}`;
      });
    }
    if (query.q) {
      qb.andWhere('(libro.titulo ILIKE :q OR libro.isbn ILIKE :q)', { q: `%${query.q}%` });
    }

    const [data, total] = await qb
      .skip(skip)
      .take(pageSize)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
      },
    };
  }

  async findCatalogoCompleto(query: { page?: number; pageSize?: number }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.vwCatalogoRepository.findAndCount({
      skip,
      take: pageSize,
    });

    return {
      data,
      meta: {
        total,
        page,
        pageSize,
      },
    };
  }

  async findOne(id: number) {
    const libro = await this.libroRepository.findOne({
      where: { idLibro: id },
      relations: {
        editorial: true,
        categoria: true,
        idioma: true,
        autores: true,
        palabrasClave: true,
        ejemplares: {
          ubicacion: true,
        },
      },
    });

    if (!libro) {
      throw new NotFoundException(`Libro with ID ${id} not found`);
    }

    return libro;
  }

  async create(createLibroDto: CreateLibroDto) {
    const {
      titulo,
      isbn,
      anioPublicacion,
      edicion,
      idEditorial,
      idCategoria,
      idIdioma,
      autores,
      palabrasClave,
    } = createLibroDto;

    const result = await this.dataSource.query(
      `CALL sp_registrar_libro_completo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        titulo,
        isbn || null,
        anioPublicacion,
        edicion,
        idEditorial,
        idCategoria,
        idIdioma,
        autores,
        palabrasClave,
        null,
      ],
    );

    const createdId = result[0]?.p_idlibro;
    if (!createdId) {
      throw new BadRequestException('Failed to create book using stored procedure');
    }

    return this.findOne(createdId);
  }

  async update(id: number, updateLibroDto: UpdateLibroDto) {
    const libro = await this.findOne(id);
    const { autores, palabrasClave, ...rest } = updateLibroDto;

    Object.assign(libro, rest);

    if (autores) {
      libro.autores = autores.map(id => ({ idAutor: id } as any));
    }
    if (palabrasClave) {
      libro.palabrasClave = palabrasClave.map(id => ({ idPalabraClave: id } as any));
    }

    return this.libroRepository.save(libro);
  }

  async remove(id: number) {
    const libro = await this.findOne(id);

    const activeLoans = await this.edicionRepository.count({
      where: {
        idLibro: id,
        disponibilidad: 'Prestado',
      },
    });

    if (activeLoans > 0) {
      throw new BadRequestException(
        `Cannot delete book "${libro.titulo}" because it has copies currently on loan`
      );
    }

    await this.dataSource.transaction(async (manager) => {
      await manager.query('DELETE FROM libro_autor WHERE idlibro = $1', [id]);
      await manager.query('DELETE FROM libro_palabra_clave WHERE idlibro = $1', [id]);
      await manager.query('DELETE FROM edicion_volumen WHERE idlibro = $1', [id]);
      await manager.delete(Libro, id);
    });

    return { message: `Book "${libro.titulo}" and its copies have been deleted` };
  }

  async findKeywords() {
    return this.dataSource.query('SELECT idpalabraclave as "idPalabraClave", palabra FROM palabras_clave');
  }
}
