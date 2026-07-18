import { MigrationInterface, QueryRunner } from 'typeorm';

export class MembresiasNivelYPagos1715000001100 implements MigrationInterface {
  name = 'MembresiasNivelYPagos1715000001100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE membresias ADD COLUMN IF NOT EXISTS nivel int NOT NULL DEFAULT 0;
    `);

    await queryRunner.query(`
      UPDATE membresias SET costo = 0.00,  nivel = 0 WHERE nombremembresia = 'Gratuita';
      UPDATE membresias SET costo = 13.00, nivel = 1 WHERE nombremembresia = 'Premium';
      UPDATE membresias SET costo = 45.00, nivel = 2 WHERE nombremembresia = 'Institucional';
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS pagos_membresias (
        idpagomembresia   SERIAL PRIMARY KEY,
        idusuario         INT NOT NULL REFERENCES usuarios(idusuario),
        idmembresia       INT NOT NULL REFERENCES membresias(idmembresia),
        proveedor         VARCHAR(30) NOT NULL DEFAULT 'PayPal',
        idordenexterna    VARCHAR(100) NOT NULL,
        monto             NUMERIC(10,2) NOT NULL,
        moneda            VARCHAR(10) NOT NULL DEFAULT 'USD',
        estado            VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
        fechacreacion     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fechaconfirmacion TIMESTAMP,
        UNIQUE (proveedor, idordenexterna)
      );
    `);

    await queryRunner.query(`
      CREATE OR REPLACE PROCEDURE sp_actualizar_membresia_pagada(p_idusuario INT, p_idmembresia INT)
      LANGUAGE plpgsql AS $$
      BEGIN
          UPDATE historial_membresias
             SET fechafin = CURRENT_DATE
           WHERE idusuario = p_idusuario
             AND (fechafin IS NULL OR fechafin >= CURRENT_DATE);

          INSERT INTO historial_membresias(idusuario, idmembresia, fechainicio)
          VALUES (p_idusuario, p_idmembresia, CURRENT_DATE);
      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP PROCEDURE IF EXISTS sp_actualizar_membresia_pagada;`);
    await queryRunner.query(`DROP TABLE IF EXISTS pagos_membresias;`);
    await queryRunner.query(`ALTER TABLE membresias DROP COLUMN IF EXISTS nivel;`);
  }
}
