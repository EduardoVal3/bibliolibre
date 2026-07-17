import { MigrationInterface, QueryRunner } from 'typeorm';

export class VentasDbObjects1715000000400 implements MigrationInterface {
  name = 'VentasDbObjects1715000000400';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_validar_stock_venta()
      RETURNS trigger AS $$
      DECLARE v_stock int;
      BEGIN
          SELECT stockdisponible INTO v_stock FROM productos_venta WHERE idproducto = new.idproducto;
          IF v_stock < new.cantidad THEN
              RAISE EXCEPTION 'Stock insuficiente para el producto %', new.idproducto;
          END IF;
          UPDATE productos_venta SET stockdisponible = stockdisponible - new.cantidad WHERE idproducto = new.idproducto;
          RETURN new;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER trg_validar_stock_venta
      BEFORE INSERT ON detalles_venta
      FOR EACH ROW EXECUTE FUNCTION fn_validar_stock_venta();
    `);

    await queryRunner.query(`
      CREATE OR REPLACE PROCEDURE sp_registrar_venta(
          p_idusuario int, p_idempleado int,
          p_productos int[], p_cantidades int[], p_idmetodopago int,
          INOUT p_idventa int DEFAULT null
      )
      LANGUAGE plpgsql AS $$
      DECLARE v_total numeric(10,2) := 0; v_precio numeric(10,2); i int;
      BEGIN
          INSERT INTO ventas(idusuario, idempleado, total) VALUES (p_idusuario, p_idempleado, 0)
          RETURNING idventa INTO p_idventa;

          FOR i IN 1 .. array_length(p_productos, 1) LOOP
              SELECT precio INTO v_precio FROM productos_venta WHERE idproducto = p_productos[i];
              INSERT INTO detalles_venta(idventa, idproducto, cantidad, preciounitario, subtotal)
              VALUES (p_idventa, p_productos[i], p_cantidades[i], v_precio, v_precio * p_cantidades[i]);
              v_total := v_total + (v_precio * p_cantidades[i]);
          END LOOP;

          UPDATE ventas SET total = v_total WHERE idventa = p_idventa;
          INSERT INTO pagos_ventas(idventa, idmetodopago, monto) VALUES (p_idventa, p_idmetodopago, v_total);
      END;
      $$;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_ventas_por_empleado AS
      SELECT emp.idempleado, per.pnombre || ' ' || per.papellido AS empleado,
             COUNT(v.idventa) AS total_ventas, COALESCE(SUM(v.total), 0) AS monto_total
      FROM empleados emp
      JOIN persona per ON per.idpersona = emp.idpersona
      LEFT JOIN ventas v ON v.idempleado = emp.idempleado
      GROUP BY emp.idempleado, per.pnombre, per.papellido;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS vw_ventas_por_empleado;`);
    await queryRunner.query(`DROP PROCEDURE IF EXISTS sp_registrar_venta;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trg_validar_stock_venta ON detalles_venta;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_validar_stock_venta();`);
  }
}
