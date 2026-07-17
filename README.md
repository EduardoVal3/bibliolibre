# Sistema de Gestión de Biblioteca

Sistema completo de gestión bibliotecaria con backend NestJS + TypeORM + PostgreSQL y frontend Next.js + Tailwind CSS + shadcn/ui.

## Stack

| Capa      | Tecnologías                                                    |
|-----------|----------------------------------------------------------------|
| Backend   | NestJS, TypeORM, PostgreSQL, JWT, Swagger, class-validator     |
| Frontend  | Next.js 16, Tailwind CSS, shadcn/ui, TanStack Query, Lucide    |
| Infra     | Docker (PostgreSQL), pnpm workspaces                            |

## Estructura

```
biblioteca/
├── backend/          # API REST (NestJS)
│   ├── src/
│   │   ├── catalogo/        # Módulo 1: Libros, autores, categorías
│   │   ├── usuarios/        # Módulo 2: Auth, usuarios, membresías
│   │   ├── prestamos/       # Módulo 3: Préstamos, devoluciones, reservas
│   │   ├── ventas/          # Módulo 4: Ventas, empleados, roles, permisos
│   │   ├── proveedores/     # Módulo 5: Proveedores, presupuestos, órdenes
│   │   ├── recursos-digitales/ # Módulo 6: Recursos digitales, dispositivos
│   │   └── eventos/         # Módulo 7: Eventos, asistencia
│   └── test/               # Tests e2e
├── frontend/         # SPA (Next.js App Router)
│   ├── app/                # Páginas por módulo
│   ├── components/         # Componentes reutilizables
│   ├── hooks/              # TanStack Query hooks
│   ├── lib/api/            # Cliente HTTP con JWT
│   └── types/              # Interfaces TypeScript
├── docker-compose.yml      # PostgreSQL local
└── Archivo2.sql           # DDL completo de la base de datos
```

## Requisitos

- Node.js >= 18
- pnpm >= 8
- Docker (para PostgreSQL)

## Instalación

### 1. Clonar e instalar dependencias

```bash
pnpm install
cd backend && pnpm install
cd ../frontend && pnpm install
```

### 2. Base de datos

```bash
# Iniciar PostgreSQL
docker compose up -d

# La BD se crea automáticamente con los datos de Archivo2.sql
# Conectar y ejecutar el script:
psql -h localhost -U postgres -d biblioteca -f Archivo2.sql

# Aplicar migraciones de TypeORM
cd backend
npx typeorm-ts-node-commonjs migration:run -d src/config/typeorm.config.ts
```

### 3. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Editar `backend/.env` con los valores correctos:

| Variable          | Default                  |
|-------------------|--------------------------|
| PORT              | 3000                     |
| DATABASE_HOST     | localhost                |
| DATABASE_PORT     | 5432                     |
| DATABASE_USER     | postgres                 |
| DATABASE_PASSWORD | postgres                 |
| DATABASE_DB       | biblioteca               |
| JWT_SECRET        | super-secret-key-...     |

### 4. Iniciar

```bash
# Terminal 1 - Backend
cd backend
pnpm start:dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

- API: http://localhost:3000/api
- Swagger docs: http://localhost:3000/api/docs
- Frontend: http://localhost:3001

## Tests

```bash
# Backend unit tests
cd backend && pnpm test

# Backend e2e tests (requiere BD)
cd backend && pnpm test:e2e
```

## Endpoints destacados

### Auth
| Método | Ruta              | Descripción            |
|--------|-------------------|------------------------|
| POST   | /api/auth/login   | Iniciar sesión         |
| POST   | /api/auth/registro| Registro público       |
| POST   | /api/auth/refresh | Renovar access token   |

### Módulos principales
| Módulo     | Ruta base                 |
|------------|---------------------------|
| Catálogo   | /api/libros               |
| Usuarios   | /api/usuarios             |
| Préstamos  | /api/prestamos            |
| Ventas     | /api/ventas               |
| Proveedores| /api/proveedores          |
| Digital    | /api/recursos-digitales   |
| Eventos    | /api/eventos              |

## Seguridad

- Autenticación JWT (access + refresh tokens)
- Control de permisos granular (`@RequierePermiso`)
- Rate limiting (60 req/min por IP)
- Helmet (cabeceras HTTP seguras)
- CORS configurado explícitamente
- Validación de entrada con class-validator
- Filtro global de excepciones con manejo de errores de PostgreSQL

## Licencia

MIT
