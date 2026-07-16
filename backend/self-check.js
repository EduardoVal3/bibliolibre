const { Client } = require('pg');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Parse .env manually
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
  console.log('🔌 Connected to database for self-check...');

  try {
    console.log('🧪 Testing sp_registrar_libro_completo...');
    
    const testTitle = 'Test Book ' + Date.now();
    const testIsbn = '9783161484100';
    
    const res = await client.query(
      `CALL sp_registrar_libro_completo($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        testTitle,
        testIsbn,
        2024,
        '1ra Ed',
        1,
        1,
        1,
        [1, 2],
        [1, 2],
        null
      ]
    );

    const createdId = res.rows[0]?.p_idlibro;
    assert.ok(createdId, 'Should return a valid created book ID');
    console.log(`✅ Stored procedure executed successfully! Created Book ID: ${createdId}`);

    console.log('🧪 Testing vw_catalogo_libros updates...');
    const viewRes = await client.query('SELECT * FROM vw_catalogo_libros WHERE idlibro = $1', [createdId]);
    assert.strictEqual(viewRes.rows.length, 1, 'Should find 1 row in view for the new book');
    
    const row = viewRes.rows[0];
    assert.strictEqual(row.titulo, testTitle, 'Title should match');
    assert.strictEqual(row.isbn, testIsbn, 'ISBN should match');
    console.log(`✅ View Entity verification passed! Book found in view: "${row.titulo}"`);

    console.log('🧹 Cleaning up test records...');
    await client.query('DELETE FROM libro_autor WHERE idlibro = $1', [createdId]);
    await client.query('DELETE FROM libro_palabra_clave WHERE idlibro = $1', [createdId]);
    await client.query('DELETE FROM edicion_volumen WHERE idlibro = $1', [createdId]);
    await client.query('DELETE FROM libros WHERE idlibro = $1', [createdId]);
    console.log('✅ Cleanup finished.');

  } catch (err) {
    console.error('❌ Self-check failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runCheck();
