import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsuariosDbObjects1715000000200 implements MigrationInterface {
  name = 'UsuariosDbObjects1715000000200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE VIEW vw_usuarios_completos AS
      SELECT
          u.idusuario,
          p.pnombre || ' ' || COALESCE(p.snombre || ' ', '') || p.papellido || ' ' || COALESCE(p.sapellido, '') AS nombrecompleto,
          p.correo, p.telefono, tu.nombretipo AS tipousuario, u.fecharegistro,
          hm.nombremembresia, hm.fechafin AS membresia_vence
      FROM usuarios u
      JOIN persona p ON p.idpersona = u.idpersona
      JOIN tipos_usuario tu ON tu.idtipousuario = u.idtipousuario
      LEFT JOIN LATERAL (
          SELECT m.nombremembresia, h.fechafin
          FROM historial_membresias h JOIN membresias m ON m.idmembresia = h.idmembresia
          WHERE h.idusuario = u.idusuario ORDER BY h.fechainicio DESC LIMIT 1
      ) hm ON true;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION fn_membresia_activa(p_idusuario int)
      RETURNS boolean AS $$
          SELECT EXISTS (
              SELECT 1 FROM historial_membresias
              WHERE idusuario = p_idusuario
                AND fechainicio <= CURRENT_DATE
                AND (fechafin IS NULL OR fechafin >= CURRENT_DATE)
          );
      $$ LANGUAGE sql STABLE;
    `);

    await queryRunner.query(`
      CREATE OR REPLACE PROCEDURE sp_registrar_usuario_completo(
          p_pnombre varchar, p_snombre varchar, p_papellido varchar, p_sapellido varchar,
          p_correo varchar, p_telefono varchar, p_direccion text,
          p_passwordhash varchar, p_idtipousuario int, p_idmembresia int,
          INOUT p_idusuario int DEFAULT null
      )
      LANGUAGE plpgsql AS $$
      DECLARE v_idpersona int;
      BEGIN
          INSERT INTO persona(pnombre, snombre, papellido, sapellido, correo, telefono, direccion)
          VALUES (p_pnombre, p_snombre, p_papellido, p_sapellido, p_correo, p_telefono, p_direccion)
          RETURNING idpersona INTO v_idpersona;

          INSERT INTO usuarios(passwordhash, idpersona, idtipousuario)
          VALUES (p_passwordhash, v_idpersona, p_idtipousuario)
          RETURNING idusuario INTO p_idusuario;

          INSERT INTO historial_membresias(idusuario, idmembresia, fechainicio)
          VALUES (p_idusuario, p_idmembresia, CURRENT_DATE);
      END;
      $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP PROCEDURE IF EXISTS sp_registrar_usuario_completo;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS fn_membresia_activa(int);`);
    await queryRunner.query(`DROP VIEW IF EXISTS vw_usuarios_completos;`);
  }
}
