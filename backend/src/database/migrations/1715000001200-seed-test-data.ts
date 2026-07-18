import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedTestData1715000001200 implements MigrationInterface {
  name = 'SeedTestData1715000001200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const userHash = await bcrypt.hash('test1234', 10);
    const empHash = await bcrypt.hash('admin1234', 10);

    // ── Personas 13-16 (usuarios de prueba) ──
    const p1 = await queryRunner.query(
      `INSERT INTO persona(pnombre, snombre, papellido, sapellido, correo, telefono, direccion)
       VALUES ('Juan', 'Carlos', 'Mendoza', 'López', 'juan.mendoza@test.com', '9999-2001', 'Tegucigalpa')
       RETURNING idpersona`,
    );
    const p2 = await queryRunner.query(
      `INSERT INTO persona(pnombre, snombre, papellido, sapellido, correo, telefono, direccion)
       VALUES ('Laura', 'Patricia', 'Zelaya', 'Rivera', 'laura.zelaya@test.com', '9999-2002', 'San Pedro Sula')
       RETURNING idpersona`,
    );
    const p3 = await queryRunner.query(
      `INSERT INTO persona(pnombre, snombre, papellido, sapellido, correo, telefono, direccion)
       VALUES ('Pedro', 'Antonio', 'Rivera', 'Mejía', 'pedro.rivera@test.com', '9999-2003', 'Comayagua')
       RETURNING idpersona`,
    );
    const p4 = await queryRunner.query(
      `INSERT INTO persona(pnombre, snombre, papellido, sapellido, correo, telefono, direccion)
       VALUES ('Carmen', 'Elena', 'Suazo', 'Pineda', 'carmen.suazo@test.com', '9999-2004', 'La Ceiba')
       RETURNING idpersona`,
    );

    const idP1 = p1[0]?.idpersona;
    const idP2 = p2[0]?.idpersona;
    const idP3 = p3[0]?.idpersona;
    const idP4 = p4[0]?.idpersona;

    // ── Usuarios con RETURNING ──
    const u1 = await queryRunner.query(
      `INSERT INTO usuarios(passwordhash, idpersona, idtipousuario) VALUES ($1, $2, 1) RETURNING idusuario`,
      [userHash, idP1],
    );
    const u2 = await queryRunner.query(
      `INSERT INTO usuarios(passwordhash, idpersona, idtipousuario) VALUES ($1, $2, 2) RETURNING idusuario`,
      [userHash, idP2],
    );
    const u3 = await queryRunner.query(
      `INSERT INTO usuarios(passwordhash, idpersona, idtipousuario) VALUES ($1, $2, 3) RETURNING idusuario`,
      [userHash, idP3],
    );
    const u4 = await queryRunner.query(
      `INSERT INTO usuarios(passwordhash, idpersona, idtipousuario) VALUES ($1, $2, 4) RETURNING idusuario`,
      [userHash, idP4],
    );

    const idU1 = u1[0]?.idusuario;
    const idU2 = u2[0]?.idusuario;
    const idU3 = u3[0]?.idusuario;
    const idU4 = u4[0]?.idusuario;

    // ── Historial membresías ──
    await queryRunner.query(
      `INSERT INTO historial_membresias(idusuario, idmembresia, fechainicio, fechafin)
       VALUES ($1, 1, CURRENT_DATE - interval '30 days', CURRENT_DATE + interval '335 days')`,
      [idU1],
    );
    await queryRunner.query(
      `INSERT INTO historial_membresias(idusuario, idmembresia, fechainicio)
       VALUES ($1, 2, CURRENT_DATE - interval '15 days')`,
      [idU2],
    );
    await queryRunner.query(
      `INSERT INTO historial_membresias(idusuario, idmembresia, fechainicio)
       VALUES ($1, 2, CURRENT_DATE - interval '5 days')`,
      [idU3],
    );
    await queryRunner.query(
      `INSERT INTO historial_membresias(idusuario, idmembresia, fechainicio)
       VALUES ($1, 3, CURRENT_DATE - interval '60 days')`,
      [idU4],
    );

    // ── Prestamos de prueba ──
    const pr1 = await queryRunner.query(
      `INSERT INTO prestamos(fechaprestamo, fechalimitedevolucion, idusuario)
       VALUES (CURRENT_DATE - interval '5 days', CURRENT_DATE + interval '10 days', $1) RETURNING idprestamo`,
      [idU1],
    );
    await queryRunner.query(
      `INSERT INTO detalles_prestamo(idprestamo, idedicionvolumen) VALUES ($1, 3)`,
      [pr1[0]?.idprestamo],
    );

    const pr2 = await queryRunner.query(
      `INSERT INTO prestamos(fechaprestamo, fechalimitedevolucion, idusuario)
       VALUES (CURRENT_DATE - interval '3 days', CURRENT_DATE + interval '12 days', $1) RETURNING idprestamo`,
      [idU2],
    );
    await queryRunner.query(
      `INSERT INTO detalles_prestamo(idprestamo, idedicionvolumen) VALUES ($1, 7)`,
      [pr2[0]?.idprestamo],
    );
    await queryRunner.query(
      `INSERT INTO detalles_prestamo(idprestamo, idedicionvolumen) VALUES ($1, 9)`,
      [pr2[0]?.idprestamo],
    );

    const pr3 = await queryRunner.query(
      `INSERT INTO prestamos(fechaprestamo, fechalimitedevolucion, idusuario)
       VALUES (CURRENT_DATE - interval '20 days', CURRENT_DATE - interval '5 days', $1) RETURNING idprestamo`,
      [idU3],
    );
    await queryRunner.query(
      `INSERT INTO detalles_prestamo(idprestamo, idedicionvolumen) VALUES ($1, 13)`,
      [pr3[0]?.idprestamo],
    );

    // ── Reservas de prueba ──
    await queryRunner.query(
      `INSERT INTO reservas(fechareserva, estadoreserva, idusuario, idedicionvolumen)
       VALUES (CURRENT_DATE - interval '1 day', 'Activa', $1, 5)`,
      [idU2],
    );
    await queryRunner.query(
      `INSERT INTO reservas(fechareserva, estadoreserva, idusuario, idedicionvolumen)
       VALUES (CURRENT_DATE, 'Activa', $1, 10)`,
      [idU4],
    );

    // ── Personas 17-18 (empleados de prueba) ──
    const e1 = await queryRunner.query(
      `INSERT INTO persona(pnombre, snombre, papellido, sapellido, correo, telefono, direccion)
       VALUES ('Oscar', 'Armando', 'Mejía', 'Ruiz', 'oscar.mejia@test.com', '9999-3001', 'Tegucigalpa')
       RETURNING idpersona`,
    );
    const e2 = await queryRunner.query(
      `INSERT INTO persona(pnombre, snombre, papellido, sapellido, correo, telefono, direccion)
       VALUES ('Silvia', 'Beatriz', 'Aguilar', 'Flores', 'silvia.aguilar@test.com', '9999-3002', 'San Pedro Sula')
       RETURNING idpersona`,
    );

    await queryRunner.query(
      `INSERT INTO empleados(passwordhash, fechacontratacion, idpersona, idrol, idturno)
       VALUES ($1, '2025-01-15', $2, 1, 1)`,
      [empHash, e1[0]?.idpersona],
    );
    await queryRunner.query(
      `INSERT INTO empleados(passwordhash, fechacontratacion, idpersona, idrol, idturno)
       VALUES ($1, '2025-06-01', $2, 2, 2)`,
      [empHash, e2[0]?.idpersona],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Delete in reverse dependency order
    await queryRunner.query(`DELETE FROM reservas WHERE idedicionvolumen IN (5,10) AND fechareserva >= CURRENT_DATE - interval '2 days'`);
    await queryRunner.query(`DELETE FROM detalles_prestamo WHERE idedicionvolumen IN (3,7,9,13) AND idprestamo > 8`);
    await queryRunner.query(`DELETE FROM prestamos WHERE idusuario > 8`);
    await queryRunner.query(`DELETE FROM empleados WHERE correo IN ('oscar.mejia@test.com','silvia.aguilar@test.com')`);
    await queryRunner.query(`DELETE FROM persona WHERE correo IN ('oscar.mejia@test.com','silvia.aguilar@test.com')`);
    await queryRunner.query(`DELETE FROM historial_membresias WHERE idusuario > 8`);
    await queryRunner.query(`DELETE FROM usuarios WHERE idusuario > 8`);
    await queryRunner.query(`DELETE FROM persona WHERE correo IN ('juan.mendoza@test.com','laura.zelaya@test.com','pedro.rivera@test.com','carmen.suazo@test.com')`);
  }
}
