# Roadmap de Construcción — Sistema de Biblioteca

Backend: NestJS + TypeScript + TypeORM + PostgreSQL (Docker) + PL/pgSQL + JWT
Frontend: Next.js + TypeScript + Tailwind CSS + shadcn/ui

Este documento no repite el DDL completo — `Archivo2.sql` es la única fuente de verdad para nombres exactos de tablas, columnas, tipos y constraints. Cuando una iteración diga "crear la entidad Libro", el agente debe abrir `Archivo2.sql` y copiar los nombres tal cual están, no adivinarlos.

---

## Cómo usar este documento

1. Cada iteración es una unidad de trabajo autocontenida (backend **o** frontend de **un** módulo). Está pensada para pegarse sola —junto con las secciones "Arquitectura general" y los dos "Checklist estándar"— en una sesión nueva del agente, para que no cargue con los otros 6 módulos en el contexto.
2. El orden **no es arbitrario**: respeta las foreign keys de tu propio esquema (coincide con la numeración de módulos que ya usaste en el SQL). No saltes módulos.
3. Sugerencia de ramas: `feature/<numero>-<modulo>-<capa>`, ej. `feature/01-catalogo-backend`.
4. Regla dura para el agente en cada iteración: **no tocar tablas, endpoints ni pantallas de otro módulo**, aunque parezca conveniente. Si detecta que necesita algo de un módulo futuro, lo anota como pendiente y sigue.

---

## Supuestos y decisiones de arquitectura

Elegí la interpretación más común para este tipo de proyecto agentic. Si alguno no encaja, dímelo y ajusto el documento — son fáciles de cambiar porque están centralizados aquí:

1. **Flujo por módulo (vertical slice):** para cada módulo se construye primero **todo** su backend (entidades, objetos de BD, servicios, endpoints, tests) y luego **todo** su frontend, antes de pasar al siguiente módulo. Si en realidad querías "los 7 backends primero, los 7 frontends después", el contenido no cambia, solo el orden en que ejecutas las secciones.
2. **Monorepo:** `/backend` (NestJS) y `/frontend` (Next.js) en el mismo repo, con un `docker-compose.yml` en la raíz.
3. **La BD ya existe.** Nunca se usa `synchronize: true`. Se trabaja con migraciones: una migración "baseline" que documenta el esquema actual (marcada como ya aplicada si tu BD ya tiene datos reales) y luego una migración por módulo que agrega vistas/funciones/procedimientos/triggers nuevos.
4. **Autenticación:** solo `usuarios` tiene credenciales (`passwordhash`). `empleados` no inicia sesión por sí mismo — un empleado que necesite acceso al sistema debe tener **también** un registro en `usuarios` con el mismo `idpersona`. El JWT resuelve en el login si la persona es además empleado, y si lo es, incluye sus permisos.
5. **Vacío detectado en el esquema:** `devoluciones` no referencia `prestamos`/`detalles_prestamo`, solo `idedicionvolumen`. Si un mismo ejemplar se prestó varias veces en su historia, hay ambigüedad sobre a cuál préstamo corresponde una devolución. En la Iteración 5 propongo un parche opcional (`alter table devoluciones add column iddetalleprestamo ...`) y una alternativa "best effort" si prefieres no tocar el esquema.
6. ~~**`dispositivos_prestados`** no tiene tabla de historial (a diferencia de `edicion_volumen` + `prestamos`), solo el campo `estado`. Sin una tabla adicional no se puede saber qué usuario tiene cada dispositivo. Se documenta como limitación conocida en la Iteración 11.~~ **Resuelto en Iteración 11:** se creó `prestamos_dispositivos` que registra quién, cuándo y estado de cada préstamo de dispositivo.

---

## Arquitectura general

### Estructura de carpetas — backend

```
backend/
  src/
    common/            filtros de excepción, interceptores, pipes, decoradores, guards base
    config/            validación de env, configuración de TypeORM
    database/
      migrations/
        0001-baseline-schema.ts
        0002-catalogo-db-objects.ts
        0003-usuarios-db-objects.ts
        ...(una por módulo, en orden)
    auth/
      auth.module.ts  auth.controller.ts  auth.service.ts
      strategies/jwt.strategy.ts
      guards/  decorators/
    catalogo/
      entities/  dto/  catalogo.module.ts  libros.controller.ts  libros.service.ts  ...
    usuarios/ ...
    prestamos/ ...
    ventas/ ...
    proveedores/ ...
    recursos-digitales/ ...
    eventos/ ...
    app.module.ts  main.ts
  test/
  docker-compose.yml
  .env
```

### Estructura de carpetas — frontend

```
frontend/
  app/
    (public)/login/page.tsx
    (public)/registro/page.tsx
    (dashboard)/layout.tsx          shell protegido (sidebar + header)
    (dashboard)/catalogo/...
    (dashboard)/usuarios/...
    (dashboard)/prestamos/...
    (dashboard)/ventas/...
    (dashboard)/proveedores/...
    (dashboard)/recursos-digitales/...
    (dashboard)/eventos/...
  components/
    ui/            generado por shadcn
    catalogo/  usuarios/  prestamos/  ventas/  proveedores/  recursos-digitales/  eventos/
    layout/
  lib/
    api/           client.ts + <modulo>.api.ts
    auth/          manejo de token, refresh
    utils.ts
  hooks/           use-<modulo>.ts (TanStack Query)
  types/           <modulo>.types.ts
  middleware.ts    protección de rutas
```

### Convenciones críticas de mapeo TypeORM (léelo antes de escribir la primera entidad)

Tus columnas **no** son snake_case, son minúsculas pegadas (`ididioma`, `aniopublicacion`, `nombrecategoria`). Postgres pliega a minúsculas los identificadores sin comillas, pero TypeORM por defecto usa el nombre de la propiedad tal cual, y si la propiedad es camelCase (`anioPublicacion`) genera SQL con identificador citado `"anioPublicacion"`, que **no calza** con la columna ya existente `aniopublicacion`. Esto rompe todo en silencio o con errores confusos. Regla dura:

- **Siempre** mapear explícito: `@Column({ name: 'aniopublicacion' }) anioPublicacion: number;`
- PKs `serial` → `@PrimaryGeneratedColumn({ name: 'idlibro' })`.
- Relaciones → `@ManyToOne(...) @JoinColumn({ name: 'ideditorial' })`, reflejando cada `references` del DDL.
- Vistas (`vw_...`) se mapean como entidades de solo lectura: `@ViewEntity({ name: 'vw_...', synchronize: false })`.
- Funciones/procedimientos se invocan desde el `Service`: `this.dataSource.query('select * from fn_...($1)', [param])` o `'call sp_...(...)'`.
- Toda migración nueva vive en `src/database/migrations`, nombrada `<timestamp>-<modulo>-db-objects.ts`, con `up()` creando el objeto y `down()` con su `DROP` correspondiente.
- Filtros complejos de listado → `QueryBuilder`, nunca SQL concatenado a mano.

### Formato de respuesta estándar

- Listados: `{ data: T[], meta: { total, page, pageSize } }`.
- Errores: filtro global traduce excepciones de Nest y errores de Postgres (`RAISE EXCEPTION`, violaciones `unique`/`fk`) a `{ statusCode, message, error, timestamp, path }`.

---

## Checklist Backend Estándar

_(se referencia por nombre en cada iteración de backend; no se repite ítem por ítem)_

- [ ] Entidades TypeORM mapeadas 1:1 con las tablas ya existentes (ver regla de mapeo arriba).
- [ ] Migración del módulo con las vistas/funciones/procedimientos/triggers nuevos (up/down).
- [ ] DTOs de entrada con `class-validator` (create/update) y de salida tipados.
- [ ] Lógica de negocio en el `Service`, controladores delgados.
- [ ] Endpoints documentados con Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`).
- [ ] Endpoints protegidos con `JwtAuthGuard` y, cuando aplique, guard de tipo de usuario o permiso.
- [ ] Paginación + filtros en endpoints de listado.
- [ ] Errores de PL/pgSQL capturados y traducidos a HTTP claro (409/400/404 según corresponda).
- [ ] Tests unitarios de servicios (repositorio mockeado) + e2e de los endpoints críticos del módulo.
- [ ] `npm run test` y `npm run test:e2e` pasan; el módulo compila y arranca.

## Checklist Frontend Estándar

- [ ] Tipos TS reflejando los DTOs del backend (`types/<modulo>.types.ts`).
- [ ] Cliente API del módulo con manejo de JWT (incluye refresh).
- [ ] Hooks TanStack Query con estados de carga/error/éxito.
- [ ] Listado: tabla shadcn con paginación, filtros y orden.
- [ ] Detalle y formulario (crear/editar) con `react-hook-form` + `zod`, reflejando las mismas reglas de validación del backend.
- [ ] Componentes reutilizables en `components/<modulo>/`.
- [ ] Notificaciones (toast) de éxito/error.
- [ ] Rutas protegidas según rol/tipo de usuario.
- [ ] Diseño responsive, coherente con el layout base del dashboard.
- [ ] Recorrido manual completo sin errores en consola.

---

## Iteración 0 — Infraestructura base

**Objetivo:** esqueleto de ambos proyectos y la BD en Docker, sin lógica de negocio.

**Alcance:**

- `docker-compose.yml` raíz: servicio `postgres` (imagen `postgres:16-alpine`), volumen persistente, env vars (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`), puerto expuesto.
- Backend: `nest new backend`; instalar `@nestjs/typeorm typeorm pg @nestjs/config class-validator class-transformer @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt @nestjs/swagger`.
- `ConfigModule` global con validación de env (Joi o zod).
- `TypeOrmModule.forRootAsync`: `synchronize: false`, `migrationsRun: false` (se corren a mano).
- Migración `0001-baseline-schema.ts` que reproduce el DDL completo de `Archivo2.sql` (para poder levantar un entorno desde cero). Si tu BD actual ya tiene los datos, marca esta migración como aplicada sin volver a ejecutarla.
- Filtro global de excepciones + interceptor de logging.
- Swagger en `/api/docs`.
- Frontend: `create-next-app` (TS + Tailwind + App Router) + `npx shadcn@latest init`; estructura de carpetas de arriba; `lib/api/client.ts` base con manejo de `Authorization: Bearer`.
- `.env.example` en ambos proyectos.

**Qué NO hacer:** no crear entidades de negocio, no crear pantallas más allá de un layout raíz vacío.

---

## Iteración 1 — Módulo 1: Catálogo de Libros (Backend)

**Contexto previo:** ninguno (módulo raíz, sin FKs externas).

**Entidades:** `Idioma, Editorial, Categoria, Libro, Autor, LibroAutor, PalabraClave, LibroPalabraClave, UbicacionFisica, EdicionVolumen` (columnas exactas en `Archivo2.sql`, líneas 6-93).

**Objetos de base de datos a crear (migración `catalogo-db-objects`):**

```sql
-- Vista: catálogo con disponibilidad agregada
create or replace view vw_catalogo_libros as
select
    l.idlibro, l.titulo, l.isbn, l.aniopublicacion, l.edicion,
    e.nombre as editorial, c.nombrecategoria as categoria, i.nombreidioma as idioma,
    string_agg(distinct a.nombre, ', ') as autores,
    count(distinct ev.idedicionvolumen) as total_ejemplares,
    count(distinct ev.idedicionvolumen) filter (where ev.disponibilidad = 'Disponible') as ejemplares_disponibles
from libros l
join editoriales e on e.ideditorial = l.ideditorial
join categorias c on c.idcategoria = l.idcategoria
join idiomas i on i.ididioma = l.ididioma
left join libro_autor la on la.idlibro = l.idlibro
left join autores a on a.idautor = la.idautor
left join edicion_volumen ev on ev.idlibro = l.idlibro
group by l.idlibro, e.nombre, c.nombrecategoria, i.nombreidioma;

-- Función: búsqueda por palabra clave
create or replace function fn_buscar_libros_por_palabra_clave(p_palabra varchar)
returns setof libros as $$
    select l.* from libros l
    join libro_palabra_clave lpc on lpc.idlibro = l.idlibro
    join palabras_clave pc on pc.idpalabraclave = lpc.idpalabraclave
    where pc.palabra ilike '%' || p_palabra || '%';
$$ language sql stable;

-- Procedimiento: alta transaccional de libro + autores + palabras clave
create or replace procedure sp_registrar_libro_completo(
    p_titulo varchar, p_isbn varchar, p_anio int, p_edicion varchar,
    p_ideditorial int, p_idcategoria int, p_ididioma int,
    p_autores int[], p_palabras_clave int[],
    inout p_idlibro int default null
)
language plpgsql as $$
begin
    insert into libros(titulo, isbn, aniopublicacion, edicion, ideditorial, idcategoria, ididioma)
    values (p_titulo, p_isbn, p_anio, p_edicion, p_ideditorial, p_idcategoria, p_ididioma)
    returning idlibro into p_idlibro;

    insert into libro_autor(idlibro, idautor)
    select p_idlibro, unnest(p_autores) on conflict do nothing;

    insert into libro_palabra_clave(idlibro, idpalabraclave)
    select p_idlibro, unnest(p_palabras_clave) on conflict do nothing;
end;
$$;
```

**Endpoints REST:**

| Método              | Ruta                                      | Descripción                                                                                          |
| ------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| GET                 | `/libros`                                 | listado paginado, filtros: categoria, idioma, editorial, autor, palabra clave, disponibilidad, texto |
| GET                 | `/libros/catalogo-completo`               | usa `vw_catalogo_libros`, paginado                                                                   |
| GET                 | `/libros/:id`                             | detalle                                                                                              |
| POST                | `/libros`                                 | usa `sp_registrar_libro_completo`                                                                    |
| PUT                 | `/libros/:id`                             | actualizar                                                                                           |
| DELETE              | `/libros/:id`                             | eliminar (validar que no tenga ejemplares con préstamos activos)                                     |
| GET/POST/PUT/DELETE | `/autores`                                | CRUD simple                                                                                          |
| GET/POST/PUT/DELETE | `/categorias`, `/idiomas`, `/editoriales` | catálogos, lectura pública + escritura protegida                                                     |
| GET                 | `/ejemplares/:codigobarras`               | consulta por código de barras                                                                        |
| POST                | `/ejemplares`                             | alta de ejemplar físico                                                                              |
| PATCH               | `/ejemplares/:id/estado`                  | cambiar `estadofisico`/`disponibilidad`                                                              |

**DTOs y validación:** `isbn` formato ISBN-10/13, `aniopublicacion` no futuro, arrays `autores`/`palabrasClave` no vacíos en creación.

**Qué NO hacer:** no crear lógica de préstamos ni tocar `disponibilidad` desde este módulo salvo el endpoint explícito de ejemplares.

---

## Iteración 2 — Módulo 1: Catálogo de Libros (Frontend)

**Contexto previo:** API del módulo 1 lista y documentada en Swagger.

**Páginas:** `/catalogo` (listado con filtros y buscador), `/catalogo/[id]` (detalle con ejemplares y disponibilidad), `/catalogo/nuevo`, `/catalogo/editar/[id]` (solo staff).

**Componentes:** `LibroCard`, `LibroTable`, `LibroForm` (con selector múltiple de autores y palabras clave tipo combobox), `FiltrosCatalogo`, `DisponibilidadBadge`.

**Qué NO hacer:** no incluir aún botón de "reservar"/"prestar" (eso vive en el Módulo 3, Iteración 6) — solo mostrar disponibilidad de forma informativa.

---

## Iteración 3 — Módulo 2: Usuarios, Membresías y Autenticación (Backend)

**Contexto previo:** Módulo 1 backend terminado (no hay dependencia funcional, pero ya debe existir la app base con auth guards genéricos de la Iteración 0).

**Entidades:** `TipoUsuario, Persona, Usuario, Membresia, HistorialMembresia` (líneas 95-144 de `Archivo2.sql`).

**Diseño de autenticación (importante, ver supuesto 4):** el JWT se emite al hacer login con `correo` + password contra `usuarios.passwordhash` (bcrypt). El payload incluye `sub` (idusuario), `idpersona`, `idtipousuario`, y —si existe un registro en `empleados` con el mismo `idpersona` (se consulta aunque ese módulo se construya después; la tabla ya existe en el DDL)— también `idrol` y el arreglo de `permisos` (nombres de `permisos` vía `rol_permiso`). Esto permite tener listos `RolesGuard`/`PermisosGuard` desde ya, aunque el módulo 4 (que gestiona roles/permisos por CRUD) se construya más adelante.

**Objetos de base de datos:**

```sql
create or replace view vw_usuarios_completos as
select
    u.idusuario,
    p.pnombre || ' ' || coalesce(p.snombre || ' ', '') || p.papellido || ' ' || coalesce(p.sapellido, '') as nombrecompleto,
    p.correo, p.telefono, tu.nombretipo as tipousuario, u.fecharegistro,
    hm.nombremembresia, hm.fechafin as membresia_vence
from usuarios u
join persona p on p.idpersona = u.idpersona
join tipos_usuario tu on tu.idtipousuario = u.idtipousuario
left join lateral (
    select m.nombremembresia, h.fechafin
    from historial_membresias h join membresias m on m.idmembresia = h.idmembresia
    where h.idusuario = u.idusuario order by h.fechainicio desc limit 1
) hm on true;

create or replace function fn_membresia_activa(p_idusuario int)
returns boolean as $$
    select exists (
        select 1 from historial_membresias
        where idusuario = p_idusuario
          and fechainicio <= current_date
          and (fechafin is null or fechafin >= current_date)
    );
$$ language sql stable;

create or replace procedure sp_registrar_usuario_completo(
    p_pnombre varchar, p_snombre varchar, p_papellido varchar, p_sapellido varchar,
    p_correo varchar, p_telefono varchar, p_direccion text,
    p_passwordhash varchar, p_idtipousuario int, p_idmembresia int,
    inout p_idusuario int default null
)
language plpgsql as $$
declare v_idpersona int;
begin
    insert into persona(pnombre, snombre, papellido, sapellido, correo, telefono, direccion)
    values (p_pnombre, p_snombre, p_papellido, p_sapellido, p_correo, p_telefono, p_direccion)
    returning idpersona into v_idpersona;

    insert into usuarios(passwordhash, idpersona, idtipousuario)
    values (p_passwordhash, v_idpersona, p_idtipousuario)
    returning idusuario into p_idusuario;

    insert into historial_membresias(idusuario, idmembresia, fechainicio)
    values (p_idusuario, p_idmembresia, current_date);
end;
$$;
```

**Endpoints REST:**

| Método              | Ruta                            | Descripción                                                                                     |
| ------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------- |
| POST                | `/auth/login`                   | correo + password → JWT (access + refresh)                                                      |
| POST                | `/auth/refresh`                 | renovar access token                                                                            |
| POST                | `/auth/registro`                | público, usa `sp_registrar_usuario_completo` (hash con bcrypt antes de llamar al procedimiento) |
| GET                 | `/usuarios/me`                  | perfil propio                                                                                   |
| GET                 | `/usuarios`                     | admin, paginado, `vw_usuarios_completos`                                                        |
| GET/PATCH/DELETE    | `/usuarios/:id`                 | admin                                                                                           |
| GET/POST/PUT/DELETE | `/membresias`, `/tipos-usuario` | catálogos                                                                                       |
| GET/POST            | `/usuarios/:id/membresias`      | historial y renovación                                                                          |

**Qué NO hacer:** no implementar todavía el CRUD de `empleados`/`roles_empleado`/`permisos` (eso es Módulo 4) — solo referenciar esas tablas de solo-lectura para armar el payload del JWT.

---

## Iteración 4 — Módulo 2: Usuarios, Membresías y Auth (Frontend)

**Contexto previo:** endpoints de auth y usuarios listos.

**Alcance:** aquí se construye también el **shell del dashboard** (sidebar, header, breadcrumbs), porque es el primer módulo con sesión.

**Páginas:** `/login`, `/registro`, `middleware.ts` (protección de rutas + refresh), `(dashboard)/layout.tsx`, `/perfil`, `/usuarios` (admin: tabla + formulario), `/membresias` (admin).

**Componentes:** `LoginForm`, `RegistroForm`, `DashboardShell`, `UserMenu`, `UsuarioTable`, `MembresiaBadge`.

---

## Iteración 5 — Módulo 3: Préstamos, Devoluciones y Reservas (Backend)

**Contexto previo:** requiere `edicion_volumen` (Módulo 1) y `usuarios` (Módulo 2) ya construidos.

**Entidades:** `Prestamo, DetallePrestamo, Devolucion, Reserva, HistorialPrestamo` (líneas 146-195).

**Parche de esquema recomendado (opcional, decide tú):**

```sql
alter table devoluciones add column iddetalleprestamo int references detalles_prestamo(iddetalleprestamo);
```

Esto elimina la ambigüedad de a qué préstamo corresponde una devolución cuando un ejemplar se prestó varias veces. Si no quieres alterar el esquema, usa la alternativa "best effort" del trigger de abajo (empareja por fecha más reciente), sabiendo que es una aproximación.

**Objetos de base de datos:**

```sql
-- Al registrar un préstamo, marcar el ejemplar como prestado
create or replace function fn_marcar_prestado()
returns trigger as $$
begin
    update edicion_volumen set disponibilidad = 'Prestado' where idedicionvolumen = new.idedicionvolumen;
    return new;
end;
$$ language plpgsql;

create trigger trg_marcar_prestado
after insert on detalles_prestamo
for each row execute function fn_marcar_prestado();

-- Al registrar una devolución, liberar el ejemplar y anotar el historial
create or replace function fn_procesar_devolucion()
returns trigger as $$
declare v_idusuario int; v_fechaprestamo date;
begin
    select p.idusuario, p.fechaprestamo into v_idusuario, v_fechaprestamo
    from detalles_prestamo dp join prestamos p on p.idprestamo = dp.idprestamo
    where dp.idedicionvolumen = new.idedicionvolumen
    order by p.fechaprestamo desc limit 1;

    update edicion_volumen set disponibilidad = 'Disponible' where idedicionvolumen = new.idedicionvolumen;

    insert into historial_prestamos(idusuario, idedicionvolumen, fechaprestamo, fechadevolucion)
    values (v_idusuario, new.idedicionvolumen, v_fechaprestamo, new.fechadevolucion);
    return new;
end;
$$ language plpgsql;

create trigger trg_procesar_devolucion
after insert on devoluciones
for each row execute function fn_procesar_devolucion();

-- Vista de préstamos activos y vencidos
create or replace view vw_prestamos_activos as
select p.idprestamo, p.idusuario, per.pnombre || ' ' || per.papellido as usuario,
       l.titulo, ev.codigobarras, p.fechaprestamo, p.fechalimitedevolucion,
       (p.fechalimitedevolucion < current_date) as vencido
from prestamos p
join usuarios u on u.idusuario = p.idusuario
join persona per on per.idpersona = u.idpersona
join detalles_prestamo dp on dp.idprestamo = p.idprestamo
join edicion_volumen ev on ev.idedicionvolumen = dp.idedicionvolumen
join libros l on l.idlibro = ev.idlibro
where not exists (
    select 1 from devoluciones d
    where d.idedicionvolumen = dp.idedicionvolumen and d.fechadevolucion >= p.fechaprestamo
);
```

**Endpoints REST:**

| Método | Ruta                                | Descripción                                                                                 |
| ------ | ----------------------------------- | ------------------------------------------------------------------------------------------- |
| POST   | `/prestamos`                        | crea préstamo con 1..n ejemplares; valida `disponibilidad = 'Disponible'` antes de insertar |
| GET    | `/prestamos`                        | listado, filtros usuario/vencidos                                                           |
| GET    | `/prestamos/:id`                    | detalle                                                                                     |
| POST   | `/devoluciones`                     | registra devolución de un ejemplar                                                          |
| GET    | `/prestamos/vencidos`               | usa `vw_prestamos_activos` filtrando `vencido = true`                                       |
| POST   | `/reservas`                         | crear reserva                                                                               |
| GET    | `/reservas`                         | propias (usuario) o todas (staff)                                                           |
| DELETE | `/reservas/:id`                     | cancelar                                                                                    |
| GET    | `/usuarios/:id/historial-prestamos` | histórico                                                                                   |

**Reglas de negocio en el `Service`** (no en triggers, para poder devolver mensajes claros al frontend): no permitir préstamo si `disponibilidad <> 'Disponible'`; validar límite de préstamos simultáneos según `idtipousuario` (parametrizable); no permitir préstamo si existe una reserva activa de otro usuario sobre ese ejemplar.

---

## Iteración 6 — Módulo 3: Préstamos, Devoluciones y Reservas (Frontend)

**Páginas:** `/prestamos` (staff: tabla con acción "registrar devolución"), `/prestamos/nuevo`, `/mis-prestamos` (usuario), `/reservas`, `/mis-reservas`.

**Componentes:** `PrestamoTable`, `DevolucionModal`, `ReservaButton` (se agrega ahora en `/catalogo/[id]`, del Módulo 1), `VencidosAlertBadge`.

**Nota:** esta es la primera iteración donde se toca una pantalla de otro módulo ya construido (`/catalogo/[id]`) para agregar el botón de reserva/préstamo — es la única excepción permitida a la regla de "no tocar otros módulos", porque es el punto de integración natural.

---

## Iteración 7 — Módulo 4: Ventas (Backend)

**Contexto previo:** requiere `persona`/`usuarios` (Módulo 2).

**Entidades:** `RolEmpleado, Turno, Empleado, Permiso, RolPermiso, ProductoVenta, Venta, DetalleVenta, MetodoPago, PagosVentas` (líneas 197-283).

**Ahora sí se activa el `PermisosGuard`** diseñado en la Iteración 3: al terminar este módulo, `rol_permiso` tiene datos reales y los guards de permisos (`@RequierePermiso('Registrar_Venta')`, etc.) quedan completamente funcionales.

**Objetos de base de datos:**

```sql
-- Validar y descontar stock al vender
create or replace function fn_validar_stock_venta()
returns trigger as $$
declare v_stock int;
begin
    select stockdisponible into v_stock from productos_venta where idproducto = new.idproducto;
    if v_stock < new.cantidad then
        raise exception 'Stock insuficiente para el producto %', new.idproducto;
    end if;
    update productos_venta set stockdisponible = stockdisponible - new.cantidad where idproducto = new.idproducto;
    return new;
end;
$$ language plpgsql;

create trigger trg_validar_stock_venta
before insert on detalles_venta
for each row execute function fn_validar_stock_venta();

-- Alta transaccional de venta completa (detalle + pago + total)
create or replace procedure sp_registrar_venta(
    p_idusuario int, p_idempleado int,
    p_productos int[], p_cantidades int[], p_idmetodopago int,
    inout p_idventa int default null
)
language plpgsql as $$
declare v_total numeric(10,2) := 0; v_precio numeric(10,2); i int;
begin
    insert into ventas(idusuario, idempleado, total) values (p_idusuario, p_idempleado, 0)
    returning idventa into p_idventa;

    for i in 1 .. array_length(p_productos, 1) loop
        select precio into v_precio from productos_venta where idproducto = p_productos[i];
        insert into detalles_venta(idventa, idproducto, cantidad, preciounitario, subtotal)
        values (p_idventa, p_productos[i], p_cantidades[i], v_precio, v_precio * p_cantidades[i]);
        v_total := v_total + (v_precio * p_cantidades[i]);
    end loop;

    update ventas set total = v_total where idventa = p_idventa;
    insert into pagos_ventas(idventa, idmetodopago, monto) values (p_idventa, p_idmetodopago, v_total);
end;
$$;

create or replace view vw_ventas_por_empleado as
select emp.idempleado, per.pnombre || ' ' || per.papellido as empleado,
       count(v.idventa) as total_ventas, coalesce(sum(v.total), 0) as monto_total
from empleados emp
join persona per on per.idpersona = emp.idpersona
left join ventas v on v.idempleado = emp.idempleado
group by emp.idempleado, per.pnombre, per.papellido;
```

**Endpoints REST:**

| Método              | Ruta                                      | Descripción                     |
| ------------------- | ----------------------------------------- | ------------------------------- |
| POST                | `/ventas`                                 | usa `sp_registrar_venta`        |
| GET                 | `/ventas`                                 | listado, filtros fecha/empleado |
| GET                 | `/ventas/:id`                             | detalle                         |
| GET/POST/PUT/DELETE | `/productos-venta`                        | CRUD + control de stock         |
| GET/POST/PUT/DELETE | `/empleados`                              | admin                           |
| GET/POST/PUT/DELETE | `/roles-empleado`, `/permisos`, `/turnos` | catálogos                       |
| POST                | `/roles-empleado/:id/permisos`            | asignar permiso a rol           |
| GET                 | `/reportes/ventas-por-empleado`           | `vw_ventas_por_empleado`        |

---

## Iteración 8 — Módulo 4: Ventas (Frontend)

**Páginas:** `/ventas/nueva` (interfaz tipo POS: catálogo de productos, carrito, selección de método de pago), `/ventas` (listado), `/empleados`, `/roles-empleado` (con asignación de permisos), `/reportes/ventas`.

**Componentes:** `CarritoVenta`, `ProductoSelector`, `MetodoPagoSelect`, `EmpleadoTable`, `PermisosMatrix` (checklist rol×permiso), `ReporteVentasChart` (recharts).

---

## Iteración 9 — Módulo 5: Proveedores y Presupuestos (Backend)

**Contexto previo:** ninguno externo (autónomo, igual que Módulo 1).

**Entidades:** `Proveedor, Presupuesto, OrdenCompra, DetalleOrden` (líneas 285-320).

**Objetos de base de datos:**

```sql
create or replace function fn_validar_presupuesto()
returns trigger as $$
declare v_asignado numeric(12,2); v_ejecutado numeric(12,2);
begin
    if new.idpresupuesto is null then return new; end if;

    select montoasignado into v_asignado from presupuestos where idpresupuesto = new.idpresupuesto;
    select coalesce(sum(totalorden), 0) into v_ejecutado from ordenes_compra
    where idpresupuesto = new.idpresupuesto and idordencompra <> coalesce(new.idordencompra, -1);

    if v_ejecutado + new.totalorden > v_asignado then
        raise exception 'La orden excede el presupuesto disponible (asignado: %, ejecutado: %, orden: %)',
            v_asignado, v_ejecutado, new.totalorden;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger trg_validar_presupuesto
before insert or update on ordenes_compra
for each row execute function fn_validar_presupuesto();

create or replace view vw_presupuesto_ejecutado as
select pr.idpresupuesto, pr.anio, pr.montoasignado,
       coalesce(sum(oc.totalorden), 0) as montoejecutado,
       pr.montoasignado - coalesce(sum(oc.totalorden), 0) as montodisponible
from presupuestos pr
left join ordenes_compra oc on oc.idpresupuesto = pr.idpresupuesto
group by pr.idpresupuesto;
```

**Endpoints REST:**

| Método              | Ruta                                     | Descripción                                       |
| ------------------- | ---------------------------------------- | ------------------------------------------------- |
| GET/POST/PUT/DELETE | `/proveedores`                           | CRUD                                              |
| GET/POST/PUT/DELETE | `/presupuestos`                          | CRUD                                              |
| GET                 | `/presupuestos/:id/ejecucion`            | `vw_presupuesto_ejecutado`                        |
| POST                | `/ordenes-compra`                        | orden + detalle en una sola llamada transaccional |
| GET                 | `/ordenes-compra`, `/ordenes-compra/:id` | listado y detalle                                 |

---

## Iteración 10 — Módulo 5: Proveedores y Presupuestos (Frontend)

**Páginas:** `/proveedores`, `/presupuestos` (con barra de progreso de ejecución), `/ordenes-compra` (formulario con filas dinámicas de detalle), `/ordenes-compra/[id]`.

**Componentes:** `ProveedorTable`, `PresupuestoProgress`, `OrdenCompraForm` (filas dinámicas), `OrdenCompraTable`.

---

## Iteración 11 — Módulo 6: Recursos Digitales (Backend)

**Contexto previo:** requiere `usuarios` (Módulo 2).

**Entidades:** `RecursoDigital, DescargaAcceso, DispositivoPrestado` (líneas 322-351).

**Limitación resuelta:** se creó la tabla `prestamos_dispositivos` (análoga a `detalles_prestamo`) con `iddispositivo`, `idusuario`, `fechaprestamo`, `fechalimitedevolucion` y `fechadevolucion`. Disparadores `trg_marcar_dispositivo_prestado` y `trg_marcar_dispositivo_devuelto` sincronizan automáticamente `dispositivos_prestados.estado` a `'Prestado'`/`'Disponible'`. Nuevos endpoints: `POST /dispositivos/:id/prestar`, `POST /dispositivos/:id/devolver`, `GET /dispositivos/:id/prestamos`.

**Objetos de base de datos (migración `recursos-digitales-db-objects`):**

```sql
create or replace view vw_recursos_mas_descargados as
select r.idrecurso, r.titulo, r.tiporecurso,
       count(*) filter (where d.tipoaccion = 'Descarga') as total_descargas,
       count(*) filter (where d.tipoaccion = 'Visualización') as total_visualizaciones
from recursos_digitales r
left join descargas_accesos d on d.idrecurso = r.idrecurso
group by r.idrecurso
order by total_descargas desc;
```

**Endpoints REST:**

| Método              | Ruta                                  | Descripción                                                                                       |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------- |
| GET/POST/PUT/DELETE | `/recursos-digitales`                 | CRUD                                                                                              |
| POST                | `/recursos-digitales/:id/acceso`      | registra descarga/visualización (validar `fn_membresia_activa` si el tipo de recurso lo requiere) |
| GET                 | `/recursos-digitales/mas-descargados` | `vw_recursos_mas_descargados`                                                                     |
| GET/POST/PATCH      | `/dispositivos`                       | CRUD de dispositivos                                                                              |
| POST                | `/dispositivos/:id/prestar`           | prestar dispositivo a un usuario (crea registro en `prestamos_dispositivos`)                      |
| POST                | `/dispositivos/:id/devolver`          | devolver dispositivo (marca `fechadevolucion`, actualiza `estado`)                                |
| GET                 | `/dispositivos/:id/prestamos`         | historial de préstamos del dispositivo                                                            |

---

## Iteración 12 — Módulo 6: Recursos Digitales (Frontend)

**Páginas:** `/biblioteca-digital` (catálogo de recursos con acceso), `/dispositivos` (disponibilidad), `/mis-descargas` (historial del usuario).

**Componentes:** `RecursoCard`, `AccesoButton`, `DispositivoEstadoBadge`.

---

## Iteración 13 — Módulo 7: Eventos (Backend)

**Contexto previo:** requiere `usuarios` (Módulo 2).

**Entidades:** `Evento, AsistenciaEvento` (líneas 353-376).

**Objetos de base de datos:**

```sql
create or replace function fn_validar_capacidad_evento()
returns trigger as $$
declare v_capacidad int; v_inscritos int;
begin
    select capacidadmaxima into v_capacidad from eventos where idevento = new.idevento;
    if v_capacidad is not null then
        select count(*) into v_inscritos from asistencias_eventos where idevento = new.idevento;
        if v_inscritos >= v_capacidad then
            raise exception 'El evento % alcanzó su capacidad máxima', new.idevento;
        end if;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger trg_validar_capacidad_evento
before insert on asistencias_eventos
for each row execute function fn_validar_capacidad_evento();

create or replace view vw_eventos_con_cupo as
select e.idevento, e.nombreevento, e.fechaevento, e.capacidadmaxima,
       count(ae.idasistencia) as inscritos,
       case when e.capacidadmaxima is null then null else e.capacidadmaxima - count(ae.idasistencia) end as cupos_disponibles
from eventos e
left join asistencias_eventos ae on ae.idevento = e.idevento
group by e.idevento;
```

**Endpoints REST:**

| Método              | Ruta                                 | Descripción                                                   |
| ------------------- | ------------------------------------ | ------------------------------------------------------------- |
| GET/POST/PUT/DELETE | `/eventos`                           | CRUD                                                          |
| GET                 | `/eventos/:id/cupo`                  | `vw_eventos_con_cupo`                                         |
| POST                | `/eventos/:id/inscripcion`           | captura la excepción del trigger y responde 409 si está lleno |
| PATCH               | `/eventos/:id/asistencia/:idusuario` | marcar Sí/No/Pendiente                                        |

---

## Iteración 14 — Módulo 7: Eventos (Frontend)

**Páginas:** `/eventos` (listado con cupo disponible), `/eventos/[id]` (inscripción), `/eventos/[id]/asistencia` (staff: marcar asistencia).

**Componentes:** `EventoCard`, `CupoBadge`, `InscripcionButton`, `AsistenciaTable`.

---

## Iteración 15 — Integración final, dashboard y despliegue

- **Dashboard general** con KPIs cross-módulo reutilizando las vistas ya construidas: préstamos activos/vencidos, ventas del mes, presupuesto ejecutado, próximos eventos con cupo, recursos más descargados.
- Revisión final de `PermisosGuard`/`RolesGuard` ahora que todos los roles y permisos existen.
- Pruebas e2e de flujos completos: registro → préstamo → devolución; venta completa con stock; inscripción a evento hasta llenar cupo.
- Endurecimiento: CORS explícito, `@nestjs/throttler` (rate limiting), `helmet`, revisión de que ningún `.env` esté commiteado.
- `docker-compose.yml` de producción (build multi-stage de backend y frontend).
- README con instrucciones de instalación, migraciones, seeds y enlace a Swagger.

**Ideas para después (fuera de alcance salvo que lo pidas):** columnas de auditoría (`created_at`/`updated_at`), soft deletes, exportación de reportes a PDF/Excel, notificaciones por correo (vencimientos, cupo de eventos), caché con Redis para las vistas de reportes, tabla `prestamos_dispositivos` para trazabilidad completa de dispositivos.
