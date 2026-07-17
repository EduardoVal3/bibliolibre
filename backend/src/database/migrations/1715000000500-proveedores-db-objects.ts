import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProveedoresDbObjects1715000000500 implements MigrationInterface {
  name = 'ProveedoresDbObjects1715000000500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_validar_presupuesto()
      RETURNS trigger AS $$
      DECLARE v_asignado numeric(12,2); v_ejecutado numeric(12,2);
      BEGIN
          IF new.idpresupuesto IS NULL THEN RETURN new; END IF;

          SELECT montoasignado INTO v_asignado FROM presupuestos WHERE idpresupuesto = new.idpresupuesto;
          SELECT COALESCE(SUM(totalorden), 0) INTO v_ejecutado FROM ordenes_compra
          WHERE idpresupuesto = new.idpresupuesto AND idordencompra <> COALESCE(new.idordencompra, -1);

          IF v_ejecutado + new.totalorden > v_asignado THEN
              RAISE EXCEPTION 'La orden excede el presupuesto disponible (asignado: %, ejecutado: %, orden: %)',
                  v_asignado, v_ejecutado, new.totalorden;
          END IF;
          RETURN new;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_validar_presupuesto
      BEFORE INSERT OR UPDATE ON ordenes_compra
      FOR EACH ROW EXECUTE FUNCTION fn_validar_presupuesto();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_presupuesto_ejecutado AS
      SELECT pr.idpresupuesto, pr.anio, pr.montoasignado,
             COALESCE(SUM(oc.totalorden), 0) AS montoejecutado,
             pr.montoasignado - COALESCE(SUM(oc.totalorden), 0) AS montodisponible
      FROM presupuestos pr
      LEFT JOIN ordenes_compra oc ON oc.idpresupuesto = pr.idpresupuesto
      GROUP BY pr.idpresupuesto;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS vw_presupuesto_ejecutado;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_validar_presupuesto ON ordenes_compra;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_validar_presupuesto();`);
  }
}
