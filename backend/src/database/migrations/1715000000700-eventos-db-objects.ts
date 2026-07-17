import { MigrationInterface, QueryRunner } from 'typeorm';

export class EventosDbObjects1715000000700 implements MigrationInterface {
  name = 'EventosDbObjects1715000000700';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_validar_capacidad_evento()
      RETURNS trigger AS $$
      DECLARE v_capacidad int; v_inscritos int;
      BEGIN
          SELECT capacidadmaxima INTO v_capacidad FROM eventos WHERE idevento = new.idevento;
          IF v_capacidad IS NOT NULL THEN
              SELECT COUNT(*) INTO v_inscritos FROM asistencias_eventos WHERE idevento = new.idevento;
              IF v_inscritos >= v_capacidad THEN
                  RAISE EXCEPTION 'El evento % alcanzó su capacidad máxima', new.idevento;
              END IF;
          END IF;
          RETURN new;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_validar_capacidad_evento
      BEFORE INSERT ON asistencias_eventos
      FOR EACH ROW EXECUTE FUNCTION fn_validar_capacidad_evento();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_eventos_con_cupo AS
      SELECT e.idevento, e.nombreevento, e.fechaevento, e.capacidadmaxima,
             COUNT(ae.idasistencia) AS inscritos,
             CASE WHEN e.capacidadmaxima IS NULL THEN NULL ELSE e.capacidadmaxima - COUNT(ae.idasistencia) END AS cupos_disponibles
      FROM eventos e
      LEFT JOIN asistencias_eventos ae ON ae.idevento = e.idevento
      GROUP BY e.idevento;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS vw_eventos_con_cupo;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_validar_capacidad_evento ON asistencias_eventos;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_validar_capacidad_evento();`);
  }
}
