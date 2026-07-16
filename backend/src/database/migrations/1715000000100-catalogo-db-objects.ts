import { MigrationInterface, QueryRunner } from 'typeorm';

export class CatalogoDbObjects1715000000100 implements MigrationInterface {
  name = 'CatalogoDbObjects1715000000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_catalogo_libros AS
      SELECT
          l.idlibro, l.titulo, l.isbn, l.aniopublicacion, l.edicion,
          e.nombre AS editorial, c.nombrecategoria AS categoria, i.nombreidioma AS idioma,
          string_agg(distinct a.nombre, ', ') AS autores,
          count(distinct ev.idedicionvolumen) AS total_ejemplares,
          count(distinct ev.idedicionvolumen) filter (where ev.disponibilidad = 'Disponible') AS ejemplares_disponibles
      FROM libros l
      JOIN editoriales e ON e.ideditorial = l.ideditorial
      JOIN categorias c ON c.idcategoria = l.idcategoria
      JOIN idiomas i ON i.ididioma = l.ididioma
      LEFT JOIN libro_autor la ON la.idlibro = l.idlibro
      LEFT JOIN autores a ON a.idautor = la.idautor
      LEFT JOIN edicion_volumen ev ON ev.idlibro = l.idlibro
      GROUP BY l.idlibro, e.nombre, c.nombrecategoria, i.nombreidioma;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_buscar_libros_por_palabra_clave(p_palabra varchar)
      RETURNS SETOF libros AS $$
          SELECT l.* FROM libros l
          JOIN libro_palabra_clave lpc ON lpc.idlibro = l.idlibro
          JOIN palabras_clave pc ON pc.idpalabraclave = lpc.idpalabraclave
          WHERE pc.palabra ILIKE '%' || p_palabra || '%';
      $$ LANGUAGE sql STABLE;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE PROCEDURE sp_registrar_libro_completo(
          p_titulo varchar, p_isbn varchar, p_anio int, p_edicion varchar,
          p_ideditorial int, p_idcategoria int, p_ididioma int,
          p_autores int[], p_palabras_clave int[],
          INOUT p_idlibro int DEFAULT null
      )
      LANGUAGE plpgsql AS $$
      BEGIN
          INSERT INTO libros(titulo, isbn, aniopublicacion, edicion, ideditorial, idcategoria, ididioma)
          VALUES (p_titulo, p_isbn, p_anio, p_edicion, p_ideditorial, p_idcategoria, p_ididioma)
          RETURNING idlibro INTO p_idlibro;

          INSERT INTO libro_autor(idlibro, idautor)
          SELECT p_idlibro, unnest(p_autores) ON CONFLICT DO NOTHING;

          INSERT INTO libro_palabra_clave(idlibro, idpalabraclave)
          SELECT p_idlibro, unnest(p_palabras_clave) ON CONFLICT DO NOTHING;
      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP PROCEDURE IF EXISTS sp_registrar_libro_completo;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_buscar_libros_por_palabra_clave(varchar);`);
    await queryRunner.query(`DROP VIEW IF EXISTS vw_catalogo_libros;`);
  }
}
