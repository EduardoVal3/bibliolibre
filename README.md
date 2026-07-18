# Sistema de Gestión de Biblioteca

Sistema completo de gestión bibliotecaria con backend NestJS + TypeORM + PostgreSQL y frontend Next.js + Tailwind CSS + shadcn/ui.

## Stack

> **⚠️ ADVERTENCIA:** Los precios de membresías en este sistema están en **USD**, no en Lempiras (HNL). PayPal no soporta HNL. Ver sección PayPal.

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

| Variable              | Default                  |
|-----------------------|--------------------------|
| PORT                  | 3000                     |
| DATABASE_HOST         | localhost                |
| DATABASE_PORT         | 5432                     |
| DATABASE_USER         | postgres                 |
| DATABASE_PASSWORD     | postgres                 |
| DATABASE_DB           | biblioteca               |
| JWT_SECRET            | super-secret-key-...     |
| PAYPAL_CLIENT_ID      | (sandbox credentials)    |
| PAYPAL_CLIENT_SECRET  | (sandbox credentials)    |
| PAYPAL_ENV            | sandbox                  |
| PAYPAL_WEBHOOK_ID     | (opcional, live)         |

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

## PayPal — Membresías

Los pagos de membresías se procesan vía **PayPal**. Los precios están en **USD**.

| Variable              | Descripción                                      |
|-----------------------|--------------------------------------------------|
| `PAYPAL_CLIENT_ID`    | Client ID de la app PayPal (sandbox o live)      |
| `PAYPAL_CLIENT_SECRET`| Secret de la app PayPal                          |
| `PAYPAL_ENV`          | `sandbox` (default) o `live`                     |
| `PAYPAL_WEBHOOK_ID`   | ID del webhook en PayPal (requerido en live)     |

### Jerarquía de membresías

Cada plan tiene un `nivel` numérico. Solo se permite **upgrade** (nivel mayor).
No hay downgrade ni cancelación en esta fase.

| Membresía     | Nivel | Costo USD |
|---------------|-------|-----------|
| Gratuita      | 0     | $0.00     |
| Premium       | 1     | $13.00    |
| Institucional | 2     | $45.00    |

### Endpoints de pago

| Método | Ruta                                         | Descripción                           |
|--------|----------------------------------------------|----------------------------------------|
| GET    | `/api/membresias/disponibles`                | Planes con nivel > membresía actual    |
| POST   | `/api/pagos-membresias/orden`                | Crear orden PayPal                     |
| POST   | `/api/pagos-membresias/:id/capturar`         | Capturar orden tras aprobación cliente |
| POST   | `/api/pagos-membresias/webhook`              | Webhook de confirmación PayPal         |

---

## Contraseñas temporales de empleados

Los empleados existentes sin `passwordhash` recibieron una contraseña aleatoria
durante la migración `empleados-auth`, volcada **una sola vez** a:

```
backend/tmp/empleados-passwords-temporales.csv
```

Este archivo está en `.gitignore`. El administrador debe distribuir esas
contraseñas fuera de banda. Al primer inicio de sesión, el backend devuelve
`requiereCambioPassword: true` y el frontend fuerza el cambio de contraseña.

---

## JWT — Payload por tipo de usuario

### Cliente (`tipo: "usuario"`)
```json
{ "sub": 10, "tipo": "usuario", "idPersona": 14,
  "idTipoUsuario": 1, "correo": "cliente@mail.com" }
```

### Empleado (`tipo: "empleado"`)
```json
{ "sub": 5, "tipo": "empleado", "idPersona": 20, "idRol": 2,
  "permisos": ["Crear_Libro", "Registrar_Venta"],
  "correo": "emp@mail.com", "requiereCambioPassword": false }
```

El claim `tipo` es el discriminador usado por `proxy.ts` para clasificar rutas.

---

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
