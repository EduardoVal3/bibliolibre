const { Client } = require('pg');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const config = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const [key, ...valueParts] = trimmed.split('=');
  config[key.trim()] = valueParts.join('=').trim();
}

async function runCheck() {
  const client = new Client({
    host: config.DATABASE_HOST,
    port: parseInt(config.DATABASE_PORT || '5432', 10),
    user: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_DB,
  });

  await client.connect();
  console.log('Connected to database for self-check...');

  try {
    // 1. Create a loan (prestamo) for user 1 with an available copy
    console.log('\nTest 1: Creating a loan...');
    const copyRes = await client.query(
      `SELECT idedicionvolumen FROM edicion_volumen WHERE disponibilidad = 'Disponible' LIMIT 1`,
    );
    assert.ok(copyRes.rows.length > 0, 'Need at least one available copy');
    const copyId = copyRes.rows[0].idedicionvolumen;

    const loanRes = await client.query(
      `INSERT INTO prestamos (fechaprestamo, fechalimitedevolucion, idusuario)
       VALUES (CURRENT_DATE, CURRENT_DATE + 30, 1) RETURNING idprestamo`,
    );
    const prestamoId = loanRes.rows[0].idprestamo;
    console.log(`  Created loan ID: ${prestamoId}`);

    await client.query(
      `INSERT INTO detalles_prestamo (idprestamo, idedicionvolumen) VALUES ($1, $2)`,
      [prestamoId, copyId],
    );
    console.log('  Added detail (trigger should mark as Prestado)');

    const updatedCopy = await client.query(
      `SELECT disponibilidad FROM edicion_volumen WHERE idedicionvolumen = $1`,
      [copyId],
    );
    assert.strictEqual(updatedCopy.rows[0].disponibilidad, 'Prestado');
    console.log('  Copy marked as Prestado');

    // 2. Register a return
    console.log('\nTest 2: Registering a return...');
    await client.query(
      `INSERT INTO devoluciones (fechadevolucion, estadoentrega, idedicionvolumen)
       VALUES (CURRENT_DATE, 'Bueno', $1)`,
      [copyId],
    );

    const returnedCopy = await client.query(
      `SELECT disponibilidad FROM edicion_volumen WHERE idedicionvolumen = $1`,
      [copyId],
    );
    assert.strictEqual(returnedCopy.rows[0].disponibilidad, 'Disponible');
    console.log('  Copy marked as Disponible');

    const history = await client.query(
      `SELECT * FROM historial_prestamos WHERE idedicionvolumen = $1`,
      [copyId],
    );
    assert.strictEqual(history.rows.length, 1, 'Should have 1 history entry');
    console.log('  History entry created');

    // 3. Check vw_prestamos_activos
    console.log('\nTest 3: Checking vw_prestamos_activos...');
    const active = await client.query(`SELECT COUNT(*) FROM vw_prestamos_activos`);
    console.log(`  Active loans in view: ${active.rows[0].count}`);

    // 4. Create a reservation
    console.log('\nTest 4: Creating a reservation...');
    const reservaRes = await client.query(
      `INSERT INTO reservas (estadoreserva, idusuario, idedicionvolumen)
       VALUES ('Activa', 1, $1) RETURNING idreserva`,
      [copyId],
    );
    console.log(`  Reservation ID: ${reservaRes.rows[0].idreserva}`);

    // Cleanup
    console.log('\nCleaning up test records...');
    await client.query('DELETE FROM reservas WHERE idreserva = $1', [reservaRes.rows[0].idreserva]);
    await client.query('DELETE FROM historial_prestamos WHERE idedicionvolumen = $1', [copyId]);
    await client.query('DELETE FROM devoluciones WHERE idedicionvolumen = $1', [copyId]);
    await client.query('UPDATE edicion_volumen SET disponibilidad = $1 WHERE idedicionvolumen = $2', ['Disponible', copyId]);
    await client.query('DELETE FROM detalles_prestamo WHERE idprestamo = $1', [prestamoId]);
    await client.query('DELETE FROM prestamos WHERE idprestamo = $1', [prestamoId]);
    console.log('Cleanup done.');

    console.log('\nAll tests passed!');

  } catch (err) {
    console.error('Self-check failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runCheck();
