import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './entities/libro.entity';
import { Autor } from './entities/autor.entity';
import { Categoria } from './entities/categoria.entity';
import { Editorial } from './entities/editorial.entity';
import { Idioma } from './entities/idioma.entity';
import { PalabraClave } from './entities/palabra-clave.entity';
import { EdicionVolumen } from './entities/edicion-volumen.entity';
import { LibroAutor } from './entities/libro-autor.entity';
import { LibroPalabraClave } from './entities/libro-palabra-clave.entity';
import { UbicacionFisica } from './entities/ubicacion-fisica.entity';
import { VwCatalogoLibro } from './entities/vw-catalogo-libro.entity';
import { LibrosService } from './services/libros.service';
import { LibrosController } from './controllers/libros.controller';
import { AutoresService } from './services/autores.service';
import { AutoresController } from './controllers/autores.controller';
import { CategoriasService } from './services/categorias.service';
import { CategoriasController } from './controllers/categorias.controller';
import { EditorialesService } from './services/editoriales.service';
import { EditorialesController } from './controllers/editoriales.controller';
import { IdiomasService } from './services/idiomas.service';
import { IdiomasController } from './controllers/idiomas.controller';
import { EjemplaresService } from './services/ejemplares.service';
import { EjemplaresController } from './controllers/ejemplares.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Libro,
      Autor,
      Categoria,
      Editorial,
      Idioma,
      PalabraClave,
      EdicionVolumen,
      LibroAutor,
      LibroPalabraClave,
      UbicacionFisica,
      VwCatalogoLibro,
    ]),
  ],
  controllers: [
    LibrosController,
    AutoresController,
    CategoriasController,
    EditorialesController,
    IdiomasController,
    EjemplaresController,
  ],
  providers: [
    LibrosService,
    AutoresService,
    CategoriasService,
    EditorialesService,
    IdiomasService,
    EjemplaresService,
  ],
  exports: [TypeOrmModule],
})
export class CatalogoModule {}
