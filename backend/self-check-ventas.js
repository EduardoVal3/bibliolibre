// Self-check for Módulo 4: Ventas (Backend)
// Run: node self-check-ventas.js

const http = require('http');

const BASE = 'http://localhost:3000/api';
let token = null;
let failed = 0;

async function req(method, path, body, auth) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path: '/api' + path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (auth) opts.headers['Authorization'] = 'Bearer ' + token;
    const r = http.request(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function test(label, fn) {
  try {
    const r = await fn();
    const ok = r.status >= 200 && r.status < 300;
    console.log(`${ok ? '✅' : '❌'} ${label} (${r.status})`);
    if (!ok) { failed++; console.log('   Response:', JSON.stringify(r.body).slice(0, 200)); }
  } catch (e) {
    console.log(`❌ ${label} — ERROR: ${e.message}`);
    failed++;
  }
}

async function main() {
  console.log('=== Self-check: Ventas Module ===\n');

  // 1. Login and get token
  await test('POST /auth/login', () =>
    req('POST', '/auth/login', { correo: 'admin@biblioteca.com', password: 'admin123' })
  );
  // Actually try with a simpler approach - register a user first
  const loginResp = await req('POST', '/auth/login', { correo: 'admin@biblioteca.com', password: 'admin123' });
  if (loginResp.status === 201) {
    token = loginResp.body.accessToken;
    console.log('   Token acquired');
  } else {
    const regResp = await req('POST', '/auth/registro', {
      pNombre: 'Admin', pApellido: 'Test', correo: 'admin@biblioteca.com',
      password: 'admin123', idTipoUsuario: 1, idMembresia: 1
    });
    if (regResp.status === 201) {
      const r2 = await req('POST', '/auth/login', { correo: 'admin@biblioteca.com', password: 'admin123' });
      if (r2.status === 201) {
        token = r2.body.accessToken;
        console.log('   Token acquired');
      }
    }
  }

  if (!token) {
    console.log('⚠ Skipping auth tests — need a way to register/login');
  }

  // 2. Seed: create a product
  await test('POST /productos-venta (create "Lápiz")', () =>
    req('POST', '/productos-venta',
      { nombre: 'Lápiz HB', descripcion: 'Lápiz de grafito', precio: 1.5, stockDisponible: 100 },
      true)
  );

  // 3. List products
  await test('GET /productos-venta', () =>
    req('GET', '/productos-venta', null, true)
  );

  // 4. Create payment method
  await test('POST /metodos-pago (create "Efectivo")', () =>
    req('POST', '/metodos-pago', { nombreMetodo: 'Efectivo' }, true)
  );

  // 5. List payment methods
  await test('GET /metodos-pago', () =>
    req('GET', '/metodos-pago', null, true)
  );

  // 6. Create employee role
  await test('POST /roles-empleado (create "Cajero")', () =>
    req('POST', '/roles-empleado', { nombreRol: 'Cajero', descripcion: 'Encargado de caja' }, true)
  );

  // 7. List roles
  await test('GET /roles-empleado', () =>
    req('GET', '/roles-empleado', null, true)
  );

  // 8. Create permission
  await test('POST /permisos (create "Registrar_Venta")', () =>
    req('POST', '/permisos', { nombrePermiso: 'Registrar_Venta', descripcion: 'Permite registrar una venta' }, true)
  );

  // 9. List permissions
  await test('GET /permisos', () =>
    req('GET', '/permisos', null, true)
  );

  // 10. Create shift
  await test('POST /turnos (create "Matutino")', () =>
    req('POST', '/turnos', { nombreTurno: 'Matutino', horaInicio: '08:00', horaFin: '14:00' }, true)
  );

  // 11. Create employee (need persona ID 1)
  await test('POST /empleados (create for persona 1)', () =>
    req('POST', '/empleados',
      { idPersona: 1, idRol: 1, idTurno: 1, fechaContratacion: '2026-01-01' },
      true)
  );

  // 12. Assign permission to role
  await test('POST /roles-empleado/1/permisos (assign permiso 1)', () =>
    req('POST', '/roles-empleado/1/permisos', { idPermiso: 1 }, true)
  );

  // 13. List employees
  await test('GET /empleados', () =>
    req('GET', '/empleados', null, true)
  );

  // 14. Report: sales by employee
  await test('GET /reportes/ventas-por-empleado', () =>
    req('GET', '/reportes/ventas-por-empleado', null, true)
  );

  console.log(`\n=== ${failed === 0 ? '✅ All passed' : '❌ ' + failed + ' failed'} ===`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
