import { MigrationInterface, QueryRunner } from 'typeorm';

export class RecursosDigitalesDbObjects1715000000600 implements MigrationInterface {
  name = 'RecursosDigitalesDbObjects1715000000600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS prestamos_dispositivos (
          idprestamodispositivo SERIAL PRIMARY KEY,
          iddispositivo         INT NOT NULL REFERENCES dispositivos_prestados ( iddispositivo ),
          idusuario             INT NOT NULL REFERENCES usuarios ( idusuario ),
          fechaprestamo         DATE NOT NULL DEFAULT CURRENT_DATE,
          fechalimitedevolucion DATE,
          fechadevolucion       DATE
      );
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_marcar_dispositivo_prestado()
      RETURNS trigger AS $$
      BEGIN
          UPDATE dispositivos_prestados SET estado = 'Prestado' WHERE iddispositivo = new.iddispositivo;
          RETURN new;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_marcar_dispositivo_prestado
      AFTER INSERT ON prestamos_dispositivos
      FOR EACH ROW EXECUTE FUNCTION fn_marcar_dispositivo_prestado();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_marcar_dispositivo_devuelto()
      RETURNS trigger AS $$
      BEGIN
          IF new.fechadevolucion IS NOT NULL AND old.fechadevolucion IS NULL THEN
              UPDATE dispositivos_prestados SET estado = 'Disponible' WHERE iddispositivo = new.iddispositivo;
          END IF;
          RETURN new;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_marcar_dispositivo_devuelto
      AFTER UPDATE ON prestamos_dispositivos
      FOR EACH ROW EXECUTE FUNCTION fn_marcar_dispositivo_devuelto();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_recursos_mas_descargados AS
      SELECT r.idrecurso, r.titulo, r.tiporecurso,
             COUNT(*) FILTER (WHERE d.tipoaccion = 'Descarga') AS total_descargas,
             COUNT(*) FILTER (WHERE d.tipoaccion = 'Visualización') AS total_visualizaciones
      FROM recursos_digitales r
      LEFT JOIN descargas_accesos d ON d.idrecurso = r.idrecurso
      GROUP BY r.idrecurso
      ORDER BY total_descargas DESC;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS vw_recursos_mas_descargados;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_marcar_dispositivo_devuelto ON prestamos_dispositivos;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_marcar_dispositivo_devuelto();`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_marcar_dispositivo_prestado ON prestamos_dispositivos;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_marcar_dispositivo_prestado();`);
    await queryRunner.query(`DROP TABLE IF EXISTS prestamos_dispositivos;`);
  }
}
