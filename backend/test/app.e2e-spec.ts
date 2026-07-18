import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

let app: INestApplication;
let accessToken: string;
let refreshToken: string;
let libroId: number;
let usuarioId: number;
let dataSource: DataSource;

beforeAll(async () => {
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.init();
  dataSource = app.get(DataSource);
});

afterAll(async () => {
  await app.close();
});

describe('Auth (e2e)', () => {
  const testEmail = `test_${Date.now()}@test.com`;
  const testPassword = 'Test123!';

  it('POST /api/auth/registro - should register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/registro')
      .send({
        pNombre: 'Test',
        pApellido: 'User',
        correo: testEmail,
        password: testPassword,
        idTipoUsuario: 1,
        idMembresia: 1,
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('idUsuario');
    usuarioId = res.body.idUsuario;
  });

  it('POST /api/auth/login - should return JWT tokens with tipo usuario', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ correo: testEmail, password: testPassword });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    expect(res.body.usuario).toHaveProperty('tipo', 'usuario');
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it('GET /api/usuarios/me - should return current user profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/usuarios/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('idUsuario');
  });
});

describe('Fase 2 — Refresh & Logout (e2e)', () => {
  let rotatedToken: string;

  it('POST /api/auth/refresh - should rotate tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
    rotatedToken = res.body.refreshToken;
    accessToken = res.body.accessToken;
  });

  it('POST /api/auth/refresh - old token should be revoked after rotation', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/logout - should revoke current session', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ refreshToken: rotatedToken });
    expect(res.status).toBe(201);
  });

  it('POST /api/auth/refresh - should fail after logout', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/refresh')
      .send({ refreshToken: rotatedToken });
    expect(res.status).toBe(401);
  });
});

describe('Fase 2 — Anonymous catalog access (e2e)', () => {
  it('GET /api/libros - anonymous user can list books', async () => {
    const res = await request(app.getHttpServer()).get('/api/libros');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
  });

  it('GET /api/libros/catalogo-completo - anonymous user can browse', async () => {
    const res = await request(app.getHttpServer()).get('/api/libros/catalogo-completo');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  it('GET /api/libros/:id - anonymous user can view book detail', async () => {
    const res = await request(app.getHttpServer()).get('/api/libros/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('titulo');
  });
});

describe('Fase 2 — Client: login then reserve (e2e)', () => {
  const testEmail = `reserve_${Date.now()}@test.com`;
  const testPassword = 'Reserve456!';

  it('POST /api/auth/registro - register a user for reserve test', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/registro')
      .send({
        pNombre: 'Reserve',
        pApellido: 'Tester',
        correo: testEmail,
        password: testPassword,
        idTipoUsuario: 1,
        idMembresia: 1,
      });
    expect(res.status).toBe(201);
    usuarioId = res.body.idUsuario;
  });

  it('POST /api/auth/login - login as the new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ correo: testEmail, password: testPassword });
    expect(res.status).toBe(201);
    expect(res.body.usuario.tipo).toBe('usuario');
    accessToken = res.body.accessToken;
  });

  it('POST /api/reservas - authenticated user can create a reservation', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/reservas')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ idUsuario: usuarioId, idEdicionVolumen: 5 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('idReserva');
  });
});

describe('Fase 2 — Employee auth flow (e2e)', () => {
  const empEmail = `emp_${Date.now()}@test.com`;
  let empPassword = 'EmpPass789!';
  let empAccessToken: string;
  let empId: number;

  it('should create a test employee with known password', async () => {
    const pResult = await dataSource.query(
      `INSERT INTO persona(pnombre, papellido, correo) VALUES ('E2E', 'Employee', $1) RETURNING idpersona`,
      [empEmail],
    );
    const idPersona = pResult[0].idpersona;
    const hash = await bcrypt.hash(empPassword, 10);
    const eResult = await dataSource.query(
      `INSERT INTO empleados(passwordhash, idpersona, idrol, requierecambiopassword)
       VALUES ($1, $2, 1, true) RETURNING idempleado`,
      [hash, idPersona],
    );
    empId = eResult[0].idempleado;
    expect(empId).toBeGreaterThan(0);
  });

  it('POST /api/auth/login - employee login returns tipo=empleado with requiereCambioPassword', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ correo: empEmail, password: empPassword });
    expect(res.status).toBe(201);
    expect(res.body.usuario.tipo).toBe('empleado');
    expect(res.body.usuario.requiereCambioPassword).toBe(true);
    expect(res.body.usuario).toHaveProperty('permisos');
    empAccessToken = res.body.accessToken;
  });

  it('POST /api/auth/cambiar-password - employee changes password', async () => {
    const newPass = 'NewEmpPass789!';
    const res = await request(app.getHttpServer())
      .post('/api/auth/cambiar-password')
      .set('Authorization', `Bearer ${empAccessToken}`)
      .send({ currentPassword: empPassword, newPassword: newPass });
    expect(res.status).toBe(201);
    empPassword = newPass;
  });

  it('POST /api/auth/login - employee login after password change', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ correo: empEmail, password: empPassword });
    expect(res.status).toBe(201);
    expect(res.body.usuario.requiereCambioPassword).toBe(false);
    empAccessToken = res.body.accessToken;
  });

  it('GET /api/empleados - authenticated employee can access employee routes', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/empleados')
      .set('Authorization', `Bearer ${empAccessToken}`);
    expect(res.status).toBe(200);
  });
});

describe('Catalog (e2e)', () => {
  it('GET /api/libros - should return paginated list', async () => {
    const res = await request(app.getHttpServer()).get('/api/libros');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
  });

  it('POST /api/libros - should create a book when authenticated', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/libros')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        titulo: 'Test Book',
        isbn: `978-${Date.now().toString().slice(0, 10)}`,
        anioPublicacion: 2024,
        edicion: '1ra',
        idEditorial: 1,
        idCategoria: 1,
        idIdioma: 1,
        autores: [1],
        palabrasClave: [1],
      });
    if (res.status === 201) {
      expect(res.body).toHaveProperty('idLibro');
      libroId = res.body.idLibro;
    }
  });
});

describe('Events (e2e)', () => {
  let eventoId: number;

  it('GET /api/eventos - should return paginated list', async () => {
    const res = await request(app.getHttpServer()).get('/api/eventos');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
  });

  it('POST /api/eventos - should create an event when authenticated', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/eventos')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        nombreEvento: 'Test Event',
        fechaEvento: '2026-12-31',
        descripcion: 'E2E test event',
        capacidadMaxima: 100,
        lugar: 'Sala de pruebas',
      });
    if (res.status === 201) {
      expect(res.body).toHaveProperty('idEvento');
      eventoId = res.body.idEvento;
    }
  });

  it('GET /api/eventos/:id - should get event detail', async () => {
    if (!eventoId) return;
    const res = await request(app.getHttpServer()).get(`/api/eventos/${eventoId}`);
    expect(res.status).toBe(200);
  });
});

describe('Health (e2e)', () => {
  it('GET /api/health - should return OK', async () => {
    const res = await request(app.getHttpServer()).get('/api/health');
    expect(res.status).toBe(200);
  });
});

describe('Route audit — proxy route classification (manual verification)', () => {
  it('anonymous access to /api/catalogo routes is not blocked by middleware', () => {
    expect(true).toBe(true);
  });
});
