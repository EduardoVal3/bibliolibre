import { MigrationInterface, QueryRunner } from 'typeorm';

export class PrestamosDbObjects1715000000300 implements MigrationInterface {
  name = 'PrestamosDbObjects1715000000300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_marcar_prestado()
      RETURNS trigger AS $$
      BEGIN
          UPDATE edicion_volumen SET disponibilidad = 'Prestado' WHERE idedicionvolumen = new.idedicionvolumen;
          RETURN new;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_marcar_prestado
      AFTER INSERT ON detalles_prestamo
      FOR EACH ROW EXECUTE FUNCTION fn_marcar_prestado();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_procesar_devolucion()
      RETURNS trigger AS $$
      DECLARE v_idusuario int; v_fechaprestamo date;
      BEGIN
          SELECT p.idusuario, p.fechaprestamo INTO v_idusuario, v_fechaprestamo
          FROM detalles_prestamo dp JOIN prestamos p ON p.idprestamo = dp.idprestamo
          WHERE dp.idedicionvolumen = new.idedicionvolumen
          ORDER BY p.fechaprestamo DESC LIMIT 1;

          UPDATE edicion_volumen SET disponibilidad = 'Disponible' WHERE idedicionvolumen = new.idedicionvolumen;

          INSERT INTO historial_prestamos(idusuario, idedicionvolumen, fechaprestamo, fechadevolucion)
          VALUES (v_idusuario, new.idedicionvolumen, v_fechaprestamo, new.fechadevolucion);
          RETURN new;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_procesar_devolucion
      AFTER INSERT ON devoluciones
      FOR EACH ROW EXECUTE FUNCTION fn_procesar_devolucion();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_prestamos_activos AS
      SELECT p.idprestamo, p.idusuario, per.pnombre || ' ' || per.papellido AS usuario,
             l.titulo, ev.codigobarras, p.fechaprestamo, p.fechalimitedevolucion,
             (p.fechalimitedevolucion < CURRENT_DATE) AS vencido
      FROM prestamos p
      JOIN usuarios u ON u.idusuario = p.idusuario
      JOIN persona per ON per.idpersona = u.idpersona
      JOIN detalles_prestamo dp ON dp.idprestamo = p.idprestamo
      JOIN edicion_volumen ev ON ev.idedicionvolumen = dp.idedicionvolumen
      JOIN libros l ON l.idlibro = ev.idlibro
      WHERE NOT EXISTS (
          SELECT 1 FROM devoluciones d
          WHERE d.idedicionvolumen = dp.idedicionvolumen AND d.fechadevolucion >= p.fechaprestamo
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS vw_prestamos_activos;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_procesar_devolucion ON devoluciones;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_procesar_devolucion();`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_marcar_prestado ON detalles_prestamo;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_marcar_prestado();`);
  }
}
