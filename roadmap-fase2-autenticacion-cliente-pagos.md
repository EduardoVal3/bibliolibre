# Roadmap — Fase 2: Autenticación de empleados, landing pública y área de cliente

Continúa numeración desde `roadmap-sistema-biblioteca.md` (última iteración ahí: **15**). Esta fase empieza en la **Iteración 16**. Los dos checklists estándar (Backend/Frontend), la estructura de carpetas y las convenciones de mapeo TypeORM del documento original siguen vigentes tal cual — no se repiten aquí, se referencian por nombre.

---

## 0. Errata sobre el roadmap original

El **Supuesto 4** de `roadmap-sistema-biblioteca.md` decía:

> "solo `usuarios` tiene credenciales... un empleado que necesite acceso al sistema debe tener también un registro en `usuarios` con el mismo `idpersona`."

**Queda sin efecto.** Está confirmado que una `persona` nunca tendrá registro simultáneo en `usuarios` y en `empleados`. Esa combinación no existe en los datos reales, así que ese supuesto no era una simplificación válida: era, en la práctica, un sistema donde **ningún empleado puede iniciar sesión**. Las Iteraciones 16 y 17 de esta fase corrigen eso de raíz. Todo lo demás del documento original (esquema, endpoints, vistas, procedimientos de los 7 módulos) sigue vigente sin cambios.

## 1. Qué NO se toca en esta fase

- El backend de los 7 módulos, **excepto** los ajustes puntuales de autenticación de las Iteraciones 16 y 17.
- El dashboard de empleados: sidebar, header y todas sus páginas de gestión (`usuarios`, `prestamos` vista staff, `ventas`, `proveedores`, `recursos-digitales` gestión, `eventos` gestión, `empleados`, `roles-empleado`, etc.) — solo se le agregan enlaces cuando una ruta cambia de nombre (Iteración 20).
- `/dispositivos` y su flujo (`prestamos_dispositivos`, ya resuelto en la Iteración 11 del roadmap original): sin cambios. Gestión enteramente de empleado; no se construye ninguna versión de cliente.

## 2. Decisiones de esta fase (documentadas según lo pedido)

**a) Invalidación de refresh tokens — se elige la estrategia de tabla con revocación (no el contador de versión).**
Motivo: un contador de versión invalida _todas_ las sesiones de la persona al hacer logout en una sola; con una tabla se revoca solo la sesión actual, y queda naturalmente disponible para el futuro "cerrar sesión en todos los dispositivos", listar sesiones activas o auditar accesos. El costo extra (una tabla, una consulta en `/auth/refresh`) es marginal frente a esa granularidad. Detalle en Iteración 17.

**b) Contraseña para empleados ya sembrados sin `passwordhash`.**
La migración de la Iteración 16 genera, para cada empleado existente, una contraseña aleatoria (no un patrón adivinable como "cambiar123"), la hashea, y marca `requierecambiopassword = true`. Las contraseñas en claro se escriben **una sola vez** a un archivo fuera de control de versiones (`backend/tmp/empleados-passwords-temporales.csv`, agregado a `.gitignore`) para que un administrador las distribuya fuera de banda. El login de un empleado con esa bandera en `true` funciona, pero el backend devuelve `requiereCambioPassword: true` y el frontend fuerza el cambio antes de continuar. Empleados nuevos (creados desde ahora) siempre traen password propio desde el alta.

**c) Nombres de los claims del JWT** (discriminador obligatorio, nombres a mi criterio):

```jsonc
// Cliente (tipo: "usuario")
{ "sub": 10, "tipo": "usuario", "idPersona": 14, "idTipoUsuario": 1, "correo": "..." }

// Empleado (tipo: "empleado")
{ "sub": 5, "tipo": "empleado", "idPersona": 20, "idRol": 2, "permisos": ["Crear_Libro", "Registrar_Venta"], "correo": "...", "requiereCambioPassword": false }
```

**d) Jerarquía de membresías — se agrega columna explícita `nivel int`, no se usa `costo` como proxy.**
Motivo: el precio puede tener promociones o descuentos que no reflejen jerarquía real; una columna de nivel es una migración pequeña, de bajo riesgo, y desacopla "quién es superior a quién" de la política de precios. Detalle en Iteración 23.

---

## Iteración 16 — Backend: Login de empleados + nuevo payload JWT (bloqueante)

**Contexto previo:** Módulo 2 (Iteración 3) y Módulo 4 (Iteración 7) del roadmap original ya construidos.

**Objetivo:** que un empleado pueda autenticarse, con un payload de JWT que distinga explícitamente cliente de empleado.

**Migración `empleados-auth`:**

```sql
alter table empleados add column passwordhash varchar(255);
alter table empleados add column requierecambiopassword boolean not null default false;
```

`passwordhash` queda nullable a nivel de columna porque el backfill de la misma migración la completa de inmediato para las filas existentes; si prefieres endurecerla, agrega un segundo paso `alter table empleados alter column passwordhash set not null` después del backfill.

**Backfill (mismo archivo de migración o un seed aparte, a tu criterio):** por cada empleado sin password — generar aleatoria, hashear con bcrypt, guardar, `requierecambiopassword = true`, volcar la lista en claro a `backend/tmp/empleados-passwords-temporales.csv` (gitignored).

**`EmpleadosService`:** `crear()`/`actualizar()` aceptan `password` en el DTO, la hashean antes de persistir. El mapeo de salida **nunca** incluye `passwordhash` (`@Exclude()` en la entidad o DTO de respuesta explícito).

**`AuthService.login(correo, password)`:**

1. Buscar `persona` por `correo`.
2. Si existe fila en `usuarios` con ese `idpersona` → validar hash ahí, `tipo: "usuario"`.
3. Si no, buscar en `empleados` con ese `idpersona` → validar hash ahí, `tipo: "empleado"`.
4. Si no existe en ninguna → `401` genérico (no revelar en cuál tabla se buscó).
5. Armar el payload según el tipo (ver decisión c).

**`JwtStrategy.validate()`** devuelve el payload completo (incluye `tipo`) para que los guards lo usen.

**`RolesGuard` / `PermisosGuard`:** ahora verifican `request.user.tipo === 'empleado'` como primer filtro; si no, `403` inmediato, sin evaluar permisos.

**Nuevo endpoint** `POST /auth/cambiar-password` (autenticado): password actual + nueva, actualiza hash, `requierecambiopassword = false`.

| Método | Ruta                     | Cambio                                                |
| ------ | ------------------------ | ----------------------------------------------------- |
| POST   | `/auth/login`            | resuelve usuario o empleado; nuevo payload con `tipo` |
| POST   | `/auth/cambiar-password` | nuevo                                                 |
| POST   | `/empleados`             | ahora exige `password`                                |
| PATCH  | `/empleados/:id`         | acepta `password` opcional                            |

**Qué NO hacer:** no tocar `/auth/refresh` ni `/auth/logout` todavía (Iteración 17); no tocar el frontend.

---

## Iteración 17 — Backend: Logout con invalidación real de refresh tokens

**Contexto previo:** Iteración 16 completa.

**Migración `refresh-tokens`:**

```sql
create table refresh_tokens (
   idrefreshtoken   serial primary key,
   idusuario        int references usuarios(idusuario),
   idempleado       int references empleados(idempleado),
   tokenhash        varchar(255) not null unique,
   fechaemision     timestamp not null default current_timestamp,
   fechaexpiracion  timestamp not null,
   revocado         boolean not null default false,
   fecharevocacion  timestamp,
   useragent        varchar(255),
   constraint chk_refresh_token_titular check (
      (idusuario is not null and idempleado is null) or
      (idusuario is null and idempleado is not null)
   )
);
```

Se guarda el **hash** del refresh token (sha256), nunca el token en claro.

**`AuthService.login()`:** además del access token, genera un refresh token y persiste su hash en `refresh_tokens`.

**`POST /auth/refresh`:** busca por hash, valida `revocado = false` y `fechaexpiracion > now()`; emite nuevo access token y **rota** el refresh token (marca el usado como revocado, crea uno nuevo) — así un token robado y reutilizado después de una rotación legítima queda detectado de inmediato.

**`POST /auth/logout`** (autenticado): recibe el refresh token vigente, lo marca revocado.

**Fuera de alcance, anotado como extensión futura:** `POST /auth/logout-todos` (revocar todas las sesiones de la persona); job de limpieza de filas vencidas.

| Método | Ruta            | Descripción                                 |
| ------ | --------------- | ------------------------------------------- |
| POST   | `/auth/logout`  | revoca el refresh token de la sesión actual |
| POST   | `/auth/refresh` | valida contra la tabla y rota el token      |

**Qué NO hacer:** no construir "cerrar sesión en todos los dispositivos" todavía; no tocar el frontend.

---

## Iteración 18 — Frontend: Layout público + navbar + sidebar de cliente (theming centralizado)

**Contexto previo:** Iteraciones 16-17 (JWT con `tipo` disponible).

**Alcance:**

- `globals.css`: completar tokens de shadcn (`--background`, `--primary`, `--sidebar-*`, radios, tipografía) como único punto de identidad visual. Ningún componente de esta fase usa color hardcodeado (`bg-blue-600`, etc.) — todo vía clases que resuelven a variables o `var(--...)`.
- `(public)/layout.tsx` único: envuelve landing, login, registro, catálogo y catálogo digital.
- Navbar simple (logo + botón que alterna "Iniciar sesión"/"Cerrar sesión" según el estado de sesión leído en cliente).
- Sidebar de cliente con `SidebarProvider` + `SidebarTrigger` de shadcn/ui, **montado condicionalmente**: sin sesión, no se renderiza en absoluto (no ocultar con CSS, condicionar en el render). Con sesión: enlaces a Catálogo, Catálogo digital, Mis préstamos, Mis reservas, Mis descargas, Membresía, Perfil, Cerrar sesión.
- `/` landing: hero, propuesta de valor, CTA "Explorar catálogo".

**Componentes:** `PublicNavbar`, `ClienteSidebar`, `LandingHero`.

**Qué NO hacer:** no tocar `(dashboard)/layout.tsx`; no mover páginas todavía (Iteraciones 20 y 22); no construir en detalle las páginas de catálogo/membresías/perfil, solo el shell (usar rutas placeholder si hace falta para probar el sidebar).

---

## Iteración 19 — Frontend: Middleware de autenticación con clasificación de rutas

**Contexto previo:** Iteración 18 (rutas del área cliente definidas) + Iteración 16 (shape del JWT).

**Alcance:** reescribir `middleware.ts` reemplazando la lógica actual ("todo bloqueado salvo login/registro" + redirect de `/` al dashboard):

| Categoría                                 | Rutas                                                                         | Regla                                                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Pública sin restricción                   | `/`, `/login`, `/registro`                                                    | sin JWT; si ya hay sesión, `/login`/`/registro` redirigen a `/`                  |
| Pública con lectura anónima               | `/catalogo`, `/catalogo/[id]`, `/catalogo/digitales`                          | sin JWT para listar/ver; las acciones se gatean dentro de la página              |
| Cliente autenticado (`tipo: "usuario"`)   | `/perfil`, `/mis-prestamos`, `/mis-reservas`, `/mis-descargas`, `/membresias` | requiere JWT válido con `tipo: "usuario"`                                        |
| Empleado — dashboard (`tipo: "empleado"`) | `/(dashboard)/**` (incluye `/catalogo-admin`)                                 | requiere JWT válido con `tipo: "empleado"`; si un cliente entra, redirigir a `/` |

Nota: agregué `/membresias` a la fila de cliente autenticado — no estaba en la tabla del prompt original pero se deduce de la Iteración 23/24 (pago de membresías es exclusivo de cliente). Ajusta la ruta si prefieres otro nombre.

**Qué NO hacer:** no dejar el redirect viejo de `/` al dashboard; no dejar rutas de empleado accesibles a clientes "por si acaso".

---

## Iteración 20 — Frontend: Reestructuración del catálogo

**Contexto previo:** Iteraciones 18-19.

**Alcance:**

- Mover `(dashboard)/catalogo` → `(dashboard)/catalogo-admin` (`/catalogo-admin`, `/catalogo-admin/nuevo`, `/catalogo-admin/editar/[id]`): mover carpeta + actualizar enlaces/breadcrumbs/sidebar del dashboard. Sin cambios de lógica interna.
- Crear `(public)/catalogo`: listado + detalle de solo lectura, reutilizando `GET /libros`, `GET /libros/catalogo-completo`, `GET /libros/:id` (sin backend nuevo).
- Mover `ReservaButton` a `components/catalogo/` (compartido) y reutilizarlo en la vista pública. Sin sesión al presionarlo, dispara el flujo de login (conservar la intención, ej. `?next=/catalogo/12`, para retomarla tras autenticarse).

**Qué NO hacer:** no tocar endpoints del Módulo 1; no incluir botones de alta/edición en la vista pública.

---

## Iteración 21 — Frontend: Biblioteca digital de cliente

**Contexto previo:** Iteraciones 18-19; Módulo 6 backend (Iteración 11 del roadmap original) ya expone `/recursos-digitales` y valida `fn_membresia_activa`.

**Alcance:** `(public)/catalogo/digitales` — listado de recursos, acción de acceso (descarga/visualización) reutilizando endpoints existentes; mensaje claro (no reintento silencioso) cuando el backend rechaza por membresía inactiva.

**Qué NO hacer:** no tocar `/dispositivos`; no construir controles administrativos aquí (siguen en `(dashboard)/recursos-digitales`).

---

## Iteración 22 — Frontend: Reubicación de páginas de cliente

**Contexto previo:** Iteración 18 (sidebar ya define las rutas destino).

**Alcance:** mover `perfil`, `mis-prestamos`, `mis-reservas`, `mis-descargas` de `(dashboard)/*` a `(public)/*`. Actualizar enlaces del sidebar de cliente y eliminar referencias residuales en el dashboard de empleados. Es un mover de carpeta + ajuste de imports, no una reescritura de lógica.

**Qué NO hacer:** no reescribir la lógica interna de esas páginas.

---

## Iteración 23 — Backend: Membresías — pagos con PayPal (mejora de plan)

**Contexto previo:** Módulo 2 (`usuarios`, `membresias`, `historial_membresias`) del roadmap original.

**Decisiones aplicadas:** jerarquía vía columna `nivel` (decisión d); solo upgrade, sin downgrade/cancelación en esta fase.

**Migración `membresias-nivel-y-pagos`:**

```sql
alter table membresias add column nivel int not null default 0;

create table pagos_membresias (
   idpagomembresia   serial primary key,
   idusuario         int not null references usuarios(idusuario),
   idmembresia       int not null references membresias(idmembresia),
   proveedor         varchar(30) not null default 'PayPal',
   idordenexterna    varchar(100) not null,
   monto             numeric(10,2) not null,
   moneda            varchar(10) not null default 'USD',
   estado            varchar(20) not null default 'Pendiente',
   fechacreacion     timestamp not null default current_timestamp,
   fechaconfirmacion timestamp,
   unique (proveedor, idordenexterna)
);
```

**Procedimiento `sp_actualizar_membresia_pagada`** (mismo patrón que `sp_registrar_usuario_completo`):

```sql
create or replace procedure sp_actualizar_membresia_pagada(p_idusuario int, p_idmembresia int)
language plpgsql as $$
begin
    update historial_membresias
       set fechafin = current_date
     where idusuario = p_idusuario
       and (fechafin is null or fechafin >= current_date);

    insert into historial_membresias(idusuario, idmembresia, fechainicio)
    values (p_idusuario, p_idmembresia, current_date);
end;
$$;
```

**`MembresiasPagoService`:**

- `crearOrden(idusuario, idmembresiaDestino)`: valida `nivel` destino > `nivel` de la membresía activa (409 si no); crea orden en PayPal (`POST /v2/checkout/orders`) por el `costo` de la membresía destino; persiste fila en `pagos_membresias` en `Pendiente` con el `idordenexterna` de PayPal.
- `capturarOrden(idordenexterna)`: llama a PayPal (`POST /v2/checkout/orders/{id}/capture`); si confirma, marca `Completado` y ejecuta `sp_actualizar_membresia_pagada`.
- Webhook `POST /pagos-membresias/webhook`: valida la firma de PayPal; si el evento confirma la captura y la fila sigue `Pendiente`, la confirma igual que `capturarOrden` — es la fuente de verdad ante fallos del lado cliente, no reemplazable por la confirmación del navegador.
- Credenciales (`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV=sandbox|live`) vía `ConfigModule`, validadas igual que el resto de env vars desde la Iteración 0 del roadmap original.

| Método | Ruta                                         | Descripción                                                           |
| ------ | -------------------------------------------- | --------------------------------------------------------------------- |
| GET    | `/membresias/disponibles`                    | membresías con `nivel` mayor a la del usuario autenticado             |
| POST   | `/pagos-membresias/orden`                    | crea orden en PayPal, valida jerarquía                                |
| POST   | `/pagos-membresias/:idordenexterna/capturar` | confirma pago desde el cliente                                        |
| POST   | `/pagos-membresias/webhook`                  | confirmación asíncrona (autenticado por firma, no por JWT de usuario) |

**Qué NO hacer:** no construir downgrade ni cancelación (si algo parece trivial de incluir, anótalo como fuera de alcance en vez de construirlo); no confiar únicamente en la confirmación del lado cliente sin el webhook.

---

## Iteración 24 — Frontend: Checkout de membresías con PayPal

**Contexto previo:** Iteración 23 + Iteración 18 (sidebar ya enlaza a `/membresias`).

**Alcance:** `/membresias` — plan actual (nombre, costo, vigencia) + tarjetas de planes con `nivel` mayor (con botón "Mejorar a [plan]"); planes de igual o menor nivel sin botón. Botones oficiales del SDK de JS de PayPal; tras aprobación, llama a capturar y refresca el plan mostrado.

**Qué NO hacer:** no mostrar botón de compra en planes de igual o menor nivel (la validación real ya vive en el backend, esta es solo la UI coherente con ella).

---

## Iteración 25 — Integración y QA de Fase 2

- E2E: empleado sembrado inicia sesión con contraseña temporal → cambia contraseña → navega el dashboard completo.
- E2E: cliente anónimo navega landing/catálogo → intenta reservar → login → completa la reserva.
- E2E: logout revoca la sesión; un refresh posterior con ese token falla.
- Auditoría de rutas: ninguna ruta de empleado alcanzable por un cliente y viceversa.
- README actualizado: variables de entorno de PayPal, flujo de contraseñas temporales de empleados, nuevo shape del JWT.
