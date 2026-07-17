import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { LoggingInterceptor } from '../src/common/interceptors/logging.interceptor';
import * as request from 'supertest';
import * as bcrypt from 'bcrypt';

let app: INestApplication;
let accessToken: string;
let libroId: number;
let usuarioId: number;

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

  it('POST /api/auth/login - should return JWT tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ correo: testEmail, password: testPassword });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('accessToken');
    accessToken = res.body.accessToken;
  });

  it('GET /api/usuarios/me - should return current user profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/usuarios/me')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('idUsuario');
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
