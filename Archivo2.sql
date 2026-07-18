-- ============================================================
--  SISTEMA DE BIBLIOTECA - DDL PostgreSQL
-- ============================================================

-- ============================================================
--  MÓDULO 1: CATÁLOGO DE LIBROS
-- ============================================================

create table idiomas (
   ididioma     serial primary key,
   nombreidioma varchar(50) not null
);


create table editoriales (
   ideditorial serial primary key,
   nombre      varchar(150) not null,
   pais        varchar(80),
   contacto    varchar(100)
);


create table categorias (
   idcategoria     serial primary key,
   nombrecategoria varchar(100) not null,
   descripcion     text
);

create table libros (
   idlibro         serial primary key,
   titulo          varchar(255) not null,
   isbn            varchar(20) unique,
   aniopublicacion int,
   edicion         varchar(50),
   ideditorial     int not null
      references editoriales ( ideditorial ),
   idcategoria     int not null
      references categorias ( idcategoria ),
   ididioma        int not null
      references idiomas ( ididioma )
);

create table autores (--agregar doc
   idautor      serial primary key,
   nombre       varchar(150) not null,
   nacionalidad varchar(80),
   biografia    text
);

create table libro_autor (
   idlibroautor serial primary key,
   idlibro      int not null
      references libros ( idlibro ),
   idautor      int not null
      references autores ( idautor ),
   unique ( idlibro,
            idautor )
);

create table palabras_clave (
   idpalabraclave serial primary key,
   palabra        varchar(100) not null unique
);

create table libro_palabra_clave (
   idlibropalabra serial primary key,
   idlibro        int not null
      references libros ( idlibro ),
   idpalabraclave int not null
      references palabras_clave ( idpalabraclave ),
   unique ( idlibro,
            idpalabraclave )
);

create table ubicaciones_fisicas (
   idubicacion serial primary key,
   seccion     varchar(50),
   pasillo     varchar(50),
   estanteria  varchar(50)
);

create table edicion_volumen (
   idedicionvolumen serial primary key,
   codigobarras     varchar(50) unique,
   estadofisico     varchar(50),
   disponibilidad   varchar(30),
   idlibro          int not null
      references libros ( idlibro ),
   idubicacion      int
      references ubicaciones_fisicas ( idubicacion )
);


-- ============================================================
--  MÓDULO 2: USUARIOS Y MEMBRESÍAS (MODIFICADO)
-- ============================================================

create table tipos_usuario (
   idtipousuario serial primary key,
   nombretipo    varchar(80) not null,
   descripcion   text
);

create table persona (--agregar doc
   idpersona serial primary key,
   pnombre   varchar(80) not null,
   snombre   varchar(80),
   papellido varchar(80) not null,
   sapellido varchar(80),
   correo    varchar(150) unique not null,
   telefono  varchar(20),
   direccion text
);

create table usuarios (
   idusuario     serial primary key,
   passwordhash  varchar(255) not null,
   fecharegistro date default current_date,
   idpersona     int not null unique
      references persona ( idpersona ),
   idtipousuario int not null
      references tipos_usuario ( idtipousuario )
);



create table membresias (
   idmembresia     serial primary key,
   nombremembresia varchar(100) not null,
   descripcion     text,
   costo           numeric(10,2),
   duracionmeses   int
);

create table historial_membresias (--quitar credencial doc
   idhistorialmembresia serial primary key,
   idusuario            int not null
      references usuarios ( idusuario ),
   idmembresia          int not null
      references membresias ( idmembresia ),
   fechainicio          date not null,
   fechafin             date
);

-- ============================================================
--  MÓDULO 3: PRÉSTAMOS, DEVOLUCIONES Y RESERVAS
-- ============================================================

create table prestamos (
   idprestamo            serial primary key,
   fechaprestamo         date not null default current_date,
   fechalimitedevolucion date not null,
   idusuario             int not null
      references usuarios ( idusuario )
);

create table detalles_prestamo (
   iddetalleprestamo serial primary key,
   idprestamo        int not null
      references prestamos ( idprestamo ),
   idedicionvolumen  int not null
      references edicion_volumen ( idedicionvolumen ),
   unique ( idprestamo,
            idedicionvolumen )
);

create table devoluciones (
   iddevolucion     serial primary key,
   fechadevolucion  date not null default current_date,
   estadoentrega    varchar(50),
   idedicionvolumen int not null
      references edicion_volumen ( idedicionvolumen )
);

create table reservas (
   idreserva        serial primary key,
   fechareserva     date not null default current_date,
   estadoreserva    varchar(50),
   idusuario        int not null
      references usuarios ( idusuario ),
   idedicionvolumen int not null
      references edicion_volumen ( idedicionvolumen )
);

create table historial_prestamos (
   idhistorial      serial primary key,
   idusuario        int not null
      references usuarios ( idusuario ),
   idedicionvolumen int not null
      references edicion_volumen ( idedicionvolumen ),
   fechaprestamo    date not null,
   fechadevolucion  date
);


-- ============================================================
--  MÓDULO 4: VENTAS
-- ============================================================

create table roles_empleado (
   idrol       serial primary key,
   nombrerol   varchar(80) not null,
   descripcion text
);

create table turnos (
   idturno     serial primary key,
   nombreturno varchar(80) not null,
   horainicio  time not null,
   horafin     time not null
);

create table empleados (
   idempleado        serial primary key,
   fechacontratacion date,
   idpersona         int not null unique
      references persona ( idpersona ),
   idrol             int not null
      references roles_empleado ( idrol ),
   idturno           int
      references turnos ( idturno )
);

create table permisos (
   idpermiso     serial primary key,
   nombrepermiso varchar(100) not null,
   descripcion   text
);

create table rol_permiso (
   idrolpermiso serial primary key,
   idrol        int not null
      references roles_empleado ( idrol ),
   idpermiso    int not null
      references permisos ( idpermiso ),
   unique ( idrol,
            idpermiso )
);

create table productos_venta (
   idproducto      serial primary key,
   nombre          varchar(150) not null,
   descripcion     text,
   precio          numeric(10,2) not null,
   stockdisponible int not null default 0
);

create table ventas (
   idventa    serial primary key,
   fechaventa timestamp not null default current_timestamp,
   idusuario  int
      references usuarios ( idusuario ),
   idempleado int not null
      references empleados ( idempleado ),
   total      numeric(10,2) not null
);

create table detalles_venta (
   iddetalleventa serial primary key,
   idventa        int not null
      references ventas ( idventa ),
   idproducto     int not null
      references productos_venta ( idproducto ),
   cantidad       int not null,
   preciounitario numeric(10,2) not null,
   subtotal       numeric(10,2) not null
);

create table metodos_pago (
   idmetodopago serial primary key,
   nombremetodo varchar(80) not null
);

create table pagos_ventas (
   idpagoventa  serial primary key,
   idventa      int not null
      references ventas ( idventa ),
   idmetodopago int not null
      references metodos_pago ( idmetodopago ),
   monto        numeric(10,2) not null
);


-- ============================================================
--  MÓDULO 5: PROVEEDORES Y PRESUPUESTOS
-- ============================================================

create table proveedores (
   idproveedor   serial primary key,
   nombreempresa varchar(150) not null,
   contacto      varchar(100),
   telefono      varchar(20),
   correo        varchar(150)
);

create table presupuestos (
   idpresupuesto serial primary key,
   anio          int not null,
   montoasignado numeric(12,2) not null
);

create table ordenes_compra (
   idordencompra serial primary key,
   fechaorden    date not null default current_date,
   totalorden    numeric(12,2) not null,
   idproveedor   int not null
      references proveedores ( idproveedor ),
   idpresupuesto int
      references presupuestos ( idpresupuesto )
);

create table detalles_orden (
   iddetalleorden serial primary key,
   idordencompra  int not null
      references ordenes_compra ( idordencompra ),
   cantidad       int not null,
   preciounitario numeric(10,2) not null
);


-- ============================================================
--  MÓDULO 6: RECURSOS DIGITALES
-- ============================================================

create table recursos_digitales (
   idrecurso   serial primary key,
   titulo      varchar(255) not null,
   tiporecurso varchar(80),
   formato     varchar(50),
   urlacceso   text
);

create table descargas_accesos (
   iddescarga  serial primary key,
   fechaacceso timestamp not null default current_timestamp,
   tipoaccion  varchar(50),
   idusuario   int not null
      references usuarios ( idusuario ),
   idrecurso   int not null
      references recursos_digitales ( idrecurso )
);

create table dispositivos_prestados (
   iddispositivo     serial primary key,
   nombredispositivo varchar(100) not null,
   tipodispositivo   varchar(80),
   numeroserie       varchar(80) unique,
   estado            varchar(50)
);


-- ============================================================
--  MÓDULO 7: EVENTOS
-- ============================================================

create table eventos (
   idevento        serial primary key,
   nombreevento    varchar(150) not null,
   descripcion     text,
   fechaevento     date not null,
   capacidadmaxima int,
   lugar           varchar(150)
);

create table asistencias_eventos (
   idasistencia  serial primary key,
   idevento      int not null
      references eventos ( idevento ),
   idusuario     int not null
      references usuarios ( idusuario ),
   fecharegistro date not null default current_date,
   asistencia    varchar(20),
   unique ( idevento,
            idusuario )
);

-- ============================================================
-- MÓDULO 1: CATÁLOGO Y COLECCIONES
-- INSERTS
-- ============================================================

-- ============================================================
-- IDIOMAS
-- ============================================================

insert into idiomas ( nombreidioma ) values ( 'Español' ),( 'Inglés' );

-- ============================================================
-- EDITORIALES
-- ============================================================

insert into editoriales (
   nombre,
   pais,
   contacto
) values ( 'Editorial Planeta',
           'España',
           'contacto@planeta.es' ),( 'Penguin Random House',
                                     'Estados Unidos',
                                     'info@penguinrandomhouse.com' ),( 'Alfaguara',
                                                                       'España',
                                                                       'contacto@alfaguara.es' ),( 'McGraw-Hill',
                                                                                                   'Estados Unidos',
                                                                                                   'ventas@mcgrawhill.com' ),
                                                                                                   ( 'Pearson',
                                                                                                                           'Reino Unido'
                                                                                                                           ,
                                                                                                                           'support@pearson.com'
                                                                                                                           );

-- ============================================================
-- CATEGORIAS
-- ============================================================

insert into categorias (
   nombrecategoria,
   descripcion
) values ( 'Literatura',
           'Novelas y obras literarias' ),( 'Historia',
                                            'Libros históricos' ),( 'Ciencia',
                                                                    'Libros científicos' ),( 'Tecnología',
                                                                                             'Informática y programación' ),(
                                                                                             'Educación',
                                                                                                                          'Material educativo'
                                                                                                                          ),(
                                                                                                                          'Fantasía'
                                                                                                                          ,
                                                                                                                                               'Novelas de fantasía'
                                                                                                                                               )
                                                                                                                                               ;

-- ============================================================
-- AUTORES
-- ============================================================

insert into autores (
   nombre,
   nacionalidad,
   biografia
) values ( 'Gabriel García Márquez',
           'Colombia',
           'Escritor colombiano, Premio Nobel de Literatura.' ),( 'Miguel de Cervantes',
                                                                  'España',
                                                                  'Autor de Don Quijote de la Mancha.' ),( 'George Orwell',
                                                                                                           'Reino Unido',
                                                                                                           'Autor de novelas políticas y sociales.'
                                                                                                           ),( 'J. K. Rowling'
                                                                                                           ,
                                                                                                                                                    'Reino Unido'
                                                                                                                                                    ,
                                                                                                                                                    'Autora de la saga Harry Potter.'
                                                                                                                                                    )
                                                                                                                                                    ,
                                                                                                                                                    (
                                                                                                                                                    'Stephen King'
                                                                                                                                                    ,
                                                                                                                                                                                      'Estados Unidos'
                                                                                                                                                                                      ,
                                                                                                                                                                                      'Escritor de novelas de terror y suspenso.'
                                                                                                                                                                                      )
                                                                                                                                                                                      ,
                                                                                                                                                                                      (
                                                                                                                                                                                      'Julio Verne'
                                                                                                                                                                                      ,
                                                                                                                                                                                                                                  'Francia'
                                                                                                                                                                                                                                  ,
                                                                                                                                                                                                                                  'Pionero de la ciencia ficción.'
                                                                                                                                                                                                                                  )
                                                                                                                                                                                                                                  ,
                                                                                                                                                                                                                                  (
                                                                                                                                                                                                                                  'Paulo Coelho'
                                                                                                                                                                                                                                  ,
                                                                                                                                                                                                                                                                   'Brasil'
                                                                                                                                                                                                                                                                   ,
                                                                                                                                                                                                                                                                   'Autor de El Alquimista.'
                                                                                                                                                                                                                                                                   )
                                                                                                                                                                                                                                                                   ,
                                                                                                                                                                                                                                                                   (
                                                                                                                                                                                                                                                                   'Isabel Allende'
                                                                                                                                                                                                                                                                   ,
                                                                                                                                                                                                                                                                                             'Chile'
                                                                                                                                                                                                                                                                                             ,
                                                                                                                                                                                                                                                                                             'Novelista chilena.'
                                                                                                                                                                                                                                                                                             )
                                                                                                                                                                                                                                                                                             ;

-- ============================================================
-- PALABRAS CLAVE
-- ============================================================

insert into palabras_clave ( palabra ) values ( 'Novela' ),( 'Historia' ),( 'Tecnología' ),( 'Programación' ),( 'Fantasía' ),
( 'Ciencia' ),( 'Suspenso' ),( 'Educación' ),( 'Aventura' ),( 'Clásico' );

-- ============================================================
-- UBICACIONES FISICAS
-- ============================================================

insert into ubicaciones_fisicas (
   seccion,
   pasillo,
   estanteria
) values ( 'A',
           '1',
           'A1' ),( 'A',
                    '1',
                    'A2' ),( 'B',
                             '2',
                             'B1' ),( 'C',
                                      '3',
                                      'C1' ),( 'D',
                                               '4',
                                               'D1' );

-- ============================================================
-- LIBROS
-- ============================================================

insert into libros (
   titulo,
   isbn,
   aniopublicacion,
   edicion,
   ideditorial,
   idcategoria,
   ididioma
) values ( 'Cien años de soledad',
           '9780307474728',
           1967,
           '1ra',
           1,
           1,
           1 ),( 'Don Quijote de la Mancha',
                 '9788491050297',
                 1605,
                 'Edición Conmemorativa',
                 2,
                 1,
                 1 ),( '1984',
                       '9780451524935',
                       1949,
                       '1ra',
                       2,
                       1,
                       2 ),( 'Harry Potter y la piedra filosofal',
                             '9788478884452',
                             1997,
                             '1ra',
                             3,
                             6,
                             1 ),( 'El Resplandor',
                                   '9780307743657',
                                   1977,
                                   '2da',
                                   2,
                                   1,
                                   2 ),( 'Viaje al centro de la Tierra',
                                         '9786071406132',
                                         1864,
                                         'Edición Clásica',
                                         1,
                                         6,
                                         1 ),( 'El Alquimista',
                                               '9780061122415',
                                               1988,
                                               '1ra',
                                               3,
                                               1,
                                               1 ),( 'La Casa de los Espíritus',
                                                     '9788401352836',
                                                     1982,
                                                     '1ra',
                                                     3,
                                                     1,
                                                     1 ),( 'Fundamentos de Programación',
                                                           '9786071514202',
                                                           2020,
                                                           '3ra',
                                                           4,
                                                           4,
                                                           1 ),( 'Introducción a Bases de Datos',
                                                                 '9780133970777',
                                                                 2019,
                                                                 '2da',
                                                                 5,
                                                                 4,
                                                                 2 );

-- ============================================================
-- LIBRO_AUTOR
-- ============================================================

insert into libro_autor (
   idlibro,
   idautor
) values ( 1,
           1 ),( 2,
                 2 ),( 3,
                       3 ),( 4,
                             4 ),( 5,
                                   5 ),( 6,
                                         6 ),( 7,
                                               7 ),( 8,
                                                     8 ),( 9,
                                                           6 ),( 10,
                                                                 6 );

-- ============================================================
-- LIBRO_PALABRA_CLAVE
-- ============================================================

insert into libro_palabra_clave (
   idlibro,
   idpalabraclave
) values ( 1,
           1 ),( 2,
                 10 ),( 3,
                        7 ),( 4,
                              5 ),( 5,
                                    7 ),( 6,
                                          9 ),( 7,
                                                1 ),( 8,
                                                      1 ),( 9,
                                                            4 ),( 10,
                                                                  3 ),( 10,
                                                                        4 ),( 6,
                                                                              6 );

-- ============================================================
-- EDICION_VOLUMEN
-- ============================================================

insert into edicion_volumen (
   codigobarras,
   estadofisico,
   disponibilidad,
   idlibro,
   idubicacion
) values ( 'LIB0001',
           'Excelente',
           'Disponible',
           1,
           1 ),( 'LIB0002',
                 'Bueno',
                 'Prestado',
                 1,
                 2 ),( 'LIB0003',
                       'Excelente',
                       'Disponible',
                       2,
                       2 ),( 'LIB0004',
                             'Bueno',
                             'Disponible',
                             3,
                             3 ),( 'LIB0005',
                                   'Excelente',
                                   'Disponible',
                                   4,
                                   4 ),( 'LIB0006',
                                         'Regular',
                                         'Prestado',
                                         5,
                                         4 ),( 'LIB0007',
                                               'Excelente',
                                               'Disponible',
                                               6,
                                               5 ),( 'LIB0008',
                                                     'Bueno',
                                                     'Disponible',
                                                     7,
                                                     1 ),( 'LIB0009',
                                                           'Excelente',
                                                           'Disponible',
                                                           8,
                                                           2 ),( 'LIB0010',
                                                                 'Excelente',
                                                                 'Disponible',
                                                                 9,
                                                                 3 ),( 'LIB0011',
                                                                       'Bueno',
                                                                       'Prestado',
                                                                       10,
                                                                       5 ),( 'LIB0012',
                                                                             'Excelente',
                                                                             'Disponible',
                                                                             3,
                                                                             1 ),( 'LIB0013',
                                                                                   'Excelente',
                                                                                   'Disponible',
                                                                                   4,
                                                                                   2 ),( 'LIB0014',
                                                                                         'Bueno',
                                                                                         'Disponible',
                                                                                         5,
                                                                                         3 ),( 'LIB0015',
                                                                                               'Excelente',
                                                                                               'Disponible',
                                                                                               2,
                                                                                               4 );

-- ============================================================
-- MÓDULO 2: USUARIOS Y MEMBRESÍAS
-- INSERTS
-- ============================================================

-- ============================================================
-- TIPOS_USUARIO
-- ============================================================

insert into tipos_usuario (
   nombretipo,
   descripcion
) values ( 'Estudiante',
           'Usuarios matriculados en instituciones educativas.' ),( 'Profesor',
                                                                    'Docentes autorizados para préstamos extendidos.' ),( 'Público General'
                                                                    ,
                                                                                                                        'Usuarios externos registrados.'
                                                                                                                        ),( 'Investigador'
                                                                                                                        ,
                                                                                                                                                         'Usuarios con acceso a material especializado.'
                                                                                                                                                         )
                                                                                                                                                         ;

-- ============================================================
-- PERSONA
-- (Las personas 1-8 serán usuarios)
-- (Las personas 9-12 serán empleados)
-- ============================================================

insert into persona (
   pnombre,
   snombre,
   papellido,
   sapellido,
   correo,
   telefono,
   direccion
) values ( 'Carlos',
           'Alberto',
           'Ramírez',
           'López',
           'carlos.ramirez@gmail.com',
           '9999-1001',
           'Tegucigalpa' ),( 'María',
                             'José',
                             'Fernández',
                             'Martínez',
                             'maria.fernandez@outlook.com',
                             '9999-1002',
                             'San Pedro Sula' ),( 'Ana',
                                                  'Lucía',
                                                  'Gómez',
                                                  'Rivera',
                                                  'ana.gomez@hotmail.com',
                                                  '9999-1003',
                                                  'Comayagua' ),( 'José',
                                                                  'Miguel',
                                                                  'Castillo',
                                                                  'Mejía',
                                                                  'jose.castillo@yahoo.com',
                                                                  '9999-1004',
                                                                  'La Ceiba' ),( 'Sofía',
                                                                                 null,
                                                                                 'Flores',
                                                                                 'Pineda',
                                                                                 'sofia.flores@gmail.com',
                                                                                 '9999-1005',
                                                                                 'Choluteca' ),( 'Daniel',
                                                                                                 'Enrique',
                                                                                                 'Paz',
                                                                                                 'Molina',
                                                                                                 'daniel.paz@icloud.com',
                                                                                                 '9999-1006',
                                                                                                 'Tegucigalpa' ),( 'Valeria',
                                                                                                                   null,
                                                                                                                   'Reyes',
                                                                                                                   'Cruz',
                                                                                                                   'valeria.reyes@hotmail.com'
                                                                                                                   ,
                                                                                                                   '9999-1007'
                                                                                                                   ,
                                                                                                                   'Comayagua'
                                                                                                                   ),( 'Luis'
                                                                                                                   ,
                                                                                                                               'Fernando'
                                                                                                                               ,
                                                                                                                               'Hernández'
                                                                                                                               ,
                                                                                                                               'Suazo'
                                                                                                                               ,
                                                                                                                               'luis.hernandez@gmail.com'
                                                                                                                               ,
                                                                                                                               '9999-1008'
                                                                                                                               ,
                                                                                                                               'Danlí'
                                                                                                                               )
                                                                                                                               ,
                                                                                                                               (
                                                                                                                               'Patricia'
                                                                                                                               ,
                                                                                                                                       null
                                                                                                                                       ,
                                                                                                                                       'Castro'
                                                                                                                                       ,
                                                                                                                                       'Lagos'
                                                                                                                                       ,
                                                                                                                                       'patricia.castro@outlook.com'
                                                                                                                                       ,
                                                                                                                                       '9999-1009'
                                                                                                                                       ,
                                                                                                                                       'Tegucigalpa'
                                                                                                                                       )
                                                                                                                                       ,
                                                                                                                                       (
                                                                                                                                       'Roberto'
                                                                                                                                       ,
                                                                                                                                                     'Antonio'
                                                                                                                                                     ,
                                                                                                                                                     'Mendoza'
                                                                                                                                                     ,
                                                                                                                                                     'Ruiz'
                                                                                                                                                     ,
                                                                                                                                                     'roberto.mendoza@yahoo.com'
                                                                                                                                                     ,
                                                                                                                                                     '9999-1010'
                                                                                                                                                     ,
                                                                                                                                                     'San Pedro Sula'
                                                                                                                                                     )
                                                                                                                                                     ,
                                                                                                                                                     (
                                                                                                                                                     'Karla'
                                                                                                                                                     ,
                                                                                                                                                                      null
                                                                                                                                                                      ,
                                                                                                                                                                      'Vásquez'
                                                                                                                                                                      ,
                                                                                                                                                                      'Flores'
                                                                                                                                                                      ,
                                                                                                                                                                      'karla.vasquez@gmail.com'
                                                                                                                                                                      ,
                                                                                                                                                                      '9999-1011'
                                                                                                                                                                      ,
                                                                                                                                                                      'Comayagua'
                                                                                                                                                                      )
                                                                                                                                                                      ,
                                                                                                                                                                      (
                                                                                                                                                                      'Eduardo'
                                                                                                                                                                      ,
                                                                                                                                                                                  'José'
                                                                                                                                                                                  ,
                                                                                                                                                                                  'Santos'
                                                                                                                                                                                  ,
                                                                                                                                                                                  'Pérez'
                                                                                                                                                                                  ,
                                                                                                                                                                                  'eduardo.santos@hotmail.com'
                                                                                                                                                                                  ,
                                                                                                                                                                                  '9999-1012'
                                                                                                                                                                                  ,
                                                                                                                                                                                  'La Ceiba'
                                                                                                                                                                                  )
                                                                                                                                                                                  ;

-- ============================================================
-- USUARIOS
-- ============================================================

insert into usuarios (
   passwordhash,
   fecharegistro,
   idpersona,
   idtipousuario
) values ( 'hash123456',
           '2026-01-10',
           1,
           1 ),( 'hash123457',
                 '2026-01-11',
                 2,
                 2 ),( 'hash123458',
                       '2026-01-12',
                       3,
                       1 ),( 'hash123459',
                             '2026-01-13',
                             4,
                             3 ),( 'hash123460',
                                   '2026-01-14',
                                   5,
                                   1 ),( 'hash123461',
                                         '2026-01-15',
                                         6,
                                         4 ),( 'hash123462',
                                               '2026-01-16',
                                               7,
                                               3 ),( 'hash123463',
                                                     '2026-01-17',
                                                     8,
                                                     2 );

-- ============================================================
-- MEMBRESIAS
-- ============================================================

insert into membresias (
   nombremembresia,
   descripcion,
   costo,
   duracionmeses
) values ( 'Gratuita',
           'Acceso básico a préstamos.',
           0.00,
           12 ),( 'Premium',
                  'Mayor cantidad de préstamos y acceso digital.',
                  13.00,
                  12 ),( 'Institucional',
                          'Membresía para universidades e instituciones.',
                          45.00,
                          12 );

-- ============================================================
-- HISTORIAL_MEMBRESIAS
-- ============================================================

insert into historial_membresias (
   idusuario,
   idmembresia,
   fechainicio,
   fechafin
) values ( 1,
           1,
           '2026-01-10',
           '2027-01-10' ),( 2,
                            2,
                            '2026-01-11',
                            '2027-01-11' ),( 3,
                                             1,
                                             '2026-01-12',
                                             '2027-01-12' ),( 4,
                                                              3,
                                                              '2026-01-13',
                                                              '2027-01-13' ),( 5,
                                                                               2,
                                                                               '2026-01-14',
                                                                               '2027-01-14' ),( 6,
                                                                                                3,
                                                                                                '2026-01-15',
                                                                                                '2027-01-15' ),( 7,
                                                                                                                 1,
                                                                                                                 '2026-01-16'
                                                                                                                 ,
                                                                                                                 '2027-01-16'
                                                                                                                 ),( 8,
                                                                                                                              2
                                                                                                                              ,
                                                                                                                              '2026-01-17'
                                                                                                                              ,
                                                                                                                              '2027-01-17'
                                                                                                                              )
                                                                                                                              ;

-- ============================================================
-- MÓDULO 3: PRÉSTAMOS, DEVOLUCIONES Y RESERVAS
-- INSERTS
-- ============================================================

-- ============================================================
-- PRESTAMOS
-- ============================================================

insert into prestamos (
   fechaprestamo,
   fechalimitedevolucion,
   idusuario
) values ( '2026-02-01',
           '2026-02-15',
           1 ),( '2026-02-03',
                 '2026-02-17',
                 2 ),( '2026-02-05',
                       '2026-02-19',
                       3 ),( '2026-02-06',
                             '2026-02-20',
                             4 ),( '2026-02-08',
                                   '2026-02-22',
                                   5 ),( '2026-02-10',
                                         '2026-02-24',
                                         6 ),( '2026-02-12',
                                               '2026-02-26',
                                               7 ),( '2026-02-14',
                                                     '2026-02-28',
                                                     8 );

-- ============================================================
-- DETALLES_PRESTAMO
-- ============================================================

insert into detalles_prestamo (
   idprestamo,
   idedicionvolumen
) values ( 1,
           2 ),( 2,
                 6 ),( 3,
                       11 ),( 4,
                              4 ),( 5,
                                    8 ),( 6,
                                          12 ),( 7,
                                                 14 ),( 8,
                                                        15 );

-- ============================================================
-- DEVOLUCIONES
-- (Solo algunos préstamos ya fueron devueltos)
-- ============================================================

insert into devoluciones (
   fechadevolucion,
   estadoentrega,
   idedicionvolumen
) values ( '2026-02-14',
           'Excelente',
           2 ),( '2026-02-16',
                 'Bueno',
                 6 ),( '2026-02-18',
                       'Excelente',
                       11 ),( '2026-02-21',
                              'Bueno',
                              4 );

-- ============================================================
-- RESERVAS
-- ============================================================

insert into reservas (
   fechareserva,
   estadoreserva,
   idusuario,
   idedicionvolumen
) values ( '2026-02-09',
           'Pendiente',
           2,
           5 ),( '2026-02-11',
                 'Pendiente',
                 5,
                 7 ),( '2026-02-13',
                       'Activa',
                       3,
                       10 ),( '2026-02-15',
                              'Activa',
                              8,
                              13 );

-- ============================================================
-- HISTORIAL_PRESTAMOS
-- ============================================================

insert into historial_prestamos (
   idusuario,
   idedicionvolumen,
   fechaprestamo,
   fechadevolucion
) values ( 1,
           1,
           '2025-10-02',
           '2025-10-15' ),( 2,
                            3,
                            '2025-10-10',
                            '2025-10-23' ),( 3,
                                             5,
                                             '2025-11-01',
                                             '2025-11-14' ),( 4,
                                                              7,
                                                              '2025-11-10',
                                                              '2025-11-22' ),( 5,
                                                                               9,
                                                                               '2025-12-03',
                                                                               '2025-12-17' ),( 6,
                                                                                                10,
                                                                                                '2025-12-10',
                                                                                                '2025-12-24' ),( 7,
                                                                                                                 13,
                                                                                                                 '2026-01-05'
                                                                                                                 ,
                                                                                                                 '2026-01-18'
                                                                                                                 ),( 8,
                                                                                                                              15
                                                                                                                              ,
                                                                                                                              '2026-01-12'
                                                                                                                              ,
                                                                                                                              '2026-01-25'
                                                                                                                              )
                                                                                                                              ;

-- ============================================================
-- MÓDULO 4: VENTAS
-- INSERTS
-- ============================================================

-- ============================================================
-- ROLES_EMPLEADO
-- ============================================================

insert into roles_empleado (
   nombrerol,
   descripcion
) values ( 'Administrador',
           'Administra el sistema y los usuarios.' ),( 'Bibliotecario',
                                                       'Gestiona préstamos, devoluciones y ventas.' ),( 'Catalogador',
                                                                                                        'Administra el catálogo bibliográfico.'
                                                                                                        );

-- ============================================================
-- TURNOS
-- ============================================================

insert into turnos (
   nombreturno,
   horainicio,
   horafin
) values ( 'Matutino',
           '08:00:00',
           '12:00:00' ),( 'Vespertino',
                          '12:00:00',
                          '16:00:00' ),( 'Nocturno',
                                         '16:00:00',
                                         '20:00:00' );

-- ============================================================
-- EMPLEADOS
-- Personas 9-12 del módulo PERSONA
-- ============================================================

insert into empleados (
   fechacontratacion,
   idpersona,
   idrol,
   idturno
) values ( '2024-01-15',
           9,
           2,
           1 ),( '2023-08-20',
                 10,
                 1,
                 2 ),( '2025-02-10',
                       11,
                       3,
                       1 ),( '2024-06-05',
                             12,
                             2,
                             3 );

-- ============================================================
-- PERMISOS
-- ============================================================

insert into permisos (
   nombrepermiso,
   descripcion
) values ( 'Crear_Libro',
           'Registrar nuevos libros en el sistema.' ),( 'Editar_Libro',
                                                        'Modificar información de libros.' ),( 'Eliminar_Libro',
                                                                                               'Eliminar libros del catálogo.'
                                                                                               ),( 'Registrar_Prestamo',
                                                                                                                               'Registrar préstamos de libros.'
                                                                                                                               )
                                                                                                                               ,
                                                                                                                               (
                                                                                                                               'Registrar_Devolucion'
                                                                                                                               ,
                                                                                                                                                                'Registrar devoluciones de libros.'
                                                                                                                                                                )
                                                                                                                                                                ,
                                                                                                                                                                (
                                                                                                                                                                'Registrar_Venta'
                                                                                                                                                                ,
                                                                                                                                                                                                    'Registrar ventas de productos.'
                                                                                                                                                                                                    )
                                                                                                                                                                                                    ,
                                                                                                                                                                                                    (
                                                                                                                                                                                                    'Gestionar_Usuarios'
                                                                                                                                                                                                    ,
                                                                                                                                                                                                                                     'Administrar usuarios.'
                                                                                                                                                                                                                                     )
                                                                                                                                                                                                                                     ,
                                                                                                                                                                                                                                     (
                                                                                                                                                                                                                                     'Generar_Reportes'
                                                                                                                                                                                                                                     ,
                                                                                                                                                                                                                                                             'Consultar y generar reportes.'
                                                                                                                                                                                                                                                             )
                                                                                                                                                                                                                                                             ;

-- ============================================================
-- ROL_PERMISO
-- ============================================================

insert into rol_permiso (
   idrol,
   idpermiso
) values ( 1,
           1 ),( 1,
                 2 ),( 1,
                       3 ),( 1,
                             4 ),( 1,
                                   5 ),( 1,
                                         6 ),( 1,
                                               7 ),( 1,
                                                     8 ),( 2,
                                                           4 ),( 2,
                                                                 5 ),( 2,
                                                                       6 ),( 3,
                                                                             1 ),( 3,
                                                                                   2 );

-- ============================================================
-- PRODUCTOS_VENTA
-- ============================================================

insert into productos_venta (
   nombre,
   descripcion,
   precio,
   stockdisponible
) values ( 'Cuaderno Universitario',
           'Cuaderno de 100 hojas',
           75.00,
           50 ),( 'Lápiz HB',
                  'Lápiz de grafito',
                  12.00,
                  120 ),( 'Separador de Libros',
                          'Separador magnético',
                          25.00,
                          40 ),( 'Agenda 2026',
                                 'Agenda académica',
                                 180.00,
                                 20 ),( 'Bolígrafo Azul',
                                        'Bolígrafo de tinta azul',
                                        18.00,
                                        80 ),( 'Libro: El Principito',
                                               'Edición para venta',
                                               220.00,
                                               15 ),( 'Libro: Hábitos Atómicos',
                                                      'Edición comercial',
                                                      395.00,
                                                      10 ),( 'Mochila Escolar',
                                                             'Mochila para estudiantes',
                                                             650.00,
                                                             8 );

-- ============================================================
-- VENTAS
-- ============================================================

insert into ventas (
   fechaventa,
   idusuario,
   idempleado,
   total
) values ( '2026-03-01 09:15:00',
           1,
           1,
           87.00 ),( '2026-03-02 10:20:00',
                     3,
                     2,
                     220.00 ),( '2026-03-03 11:05:00',
                                5,
                                1,
                                420.00 ),( '2026-03-04 15:30:00',
                                           2,
                                           4,
                                           180.00 ),( '2026-03-05 13:10:00',
                                                      6,
                                                      2,
                                                      650.00 ),( '2026-03-06 16:40:00',
                                                                 8,
                                                                 3,
                                                                 37.00 );

-- ============================================================
-- DETALLES_VENTA
-- ============================================================

insert into detalles_venta (
   idventa,
   idproducto,
   cantidad,
   preciounitario,
   subtotal
) values ( 1,
           1,
           1,
           75.00,
           75.00 ),( 1,
                     2,
                     1,
                     12.00,
                     12.00 ),( 2,
                               6,
                               1,
                               220.00,
                               220.00 ),( 3,
                                          7,
                                          1,
                                          395.00,
                                          395.00 ),( 3,
                                                     2,
                                                     2,
                                                     12.50,
                                                     25.00 ),( 4,
                                                               4,
                                                               1,
                                                               180.00,
                                                               180.00 ),( 5,
                                                                          8,
                                                                          1,
                                                                          650.00,
                                                                          650.00 ),( 6,
                                                                                     3,
                                                                                     1,
                                                                                     25.00,
                                                                                     25.00 ),( 6,
                                                                                               5,
                                                                                               1,
                                                                                               12.00,
                                                                                               12.00 );

-- ============================================================
-- METODOS_PAGO
-- ============================================================

insert into metodos_pago ( nombremetodo ) values ( 'Efectivo' ),( 'Tarjeta' ),( 'Puntos de Membresía' );

-- ============================================================
-- PAGOS_VENTAS
-- ============================================================

insert into pagos_ventas (
   idventa,
   idmetodopago,
   monto
) values ( 1,
           1,
           87.00 ),( 2,
                     2,
                     220.00 ),( 3,
                                2,
                                420.00 ),( 4,
                                           1,
                                           180.00 ),( 5,
                                                      2,
                                                      650.00 ),( 6,
                                                                 3,
                                                                 37.00 );

-- ============================================================
-- MÓDULO 5: PROVEEDORES Y PRESUPUESTOS
-- INSERTS
-- ============================================================

-- ============================================================
-- PROVEEDORES
-- ============================================================

insert into proveedores (
   nombreempresa,
   contacto,
   telefono,
   correo
) values ( 'Distribuidora Librera Centroamericana',
           'Juan Pérez',
           '2234-5501',
           'ventas@dlca.com' ),( 'Editorial Planeta Honduras',
                                 'María González',
                                 '2234-5502',
                                 'contacto@planetahn.com' ),( 'Libros y Más S.A.',
                                                              'Carlos Rodríguez',
                                                              '2234-5503',
                                                              'info@librosymas.com' ),( 'Importadora Cultural',
                                                                                        'Ana Martínez',
                                                                                        '2234-5504',
                                                                                        'compras@importadoracultural.com' );

-- ============================================================
-- PRESUPUESTOS
-- ============================================================

insert into presupuestos (
   anio,
   montoasignado
) values ( 2025,
           500000.00 ),( 2026,
                         650000.00 );

-- ============================================================
-- ORDENES_COMPRA
-- ============================================================

insert into ordenes_compra (
   fechaorden,
   totalorden,
   idproveedor,
   idpresupuesto
) values ( '2026-01-20',
           18500.00,
           1,
           2 ),( '2026-02-10',
                 9200.00,
                 2,
                 2 ),( '2026-03-05',
                       12450.00,
                       3,
                       2 ),( '2026-03-18',
                             6800.00,
                             4,
                             2 );

-- ============================================================
-- DETALLES_ORDEN
-- ============================================================

insert into detalles_orden (
   idordencompra,
   cantidad,
   preciounitario
) values ( 1,
           50,
           370.00 ),( 2,
                      20,
                      460.00 ),( 3,
                                 30,
                                 415.00 ),( 4,
                                            10,
                                            680.00 ),( 1,
                                                       15,
                                                       370.00 ),( 3,
                                                                  5,
                                                                  415.00 );

-- ============================================================
-- MÓDULO 6: RECURSOS DIGITALES
-- INSERTS
-- ============================================================

-- ============================================================
-- RECURSOS_DIGITALES
-- ============================================================

insert into recursos_digitales (
   titulo,
   tiporecurso,
   formato,
   urlacceso
) values ( 'Fundamentos de Bases de Datos',
           'E-book',
           'PDF',
           'https://biblioteca.edu/recursos/bases_datos.pdf' ),( 'Programación en Python',
                                                                 'E-book',
                                                                 'PDF',
                                                                 'https://biblioteca.edu/recursos/python.pdf' ),( 'Introducción a Redes'
                                                                 ,
                                                                                                                  'Audiolibro'
                                                                                                                  ,
                                                                                                                  'MP3',
                                                                                                                  'https://biblioteca.edu/recursos/redes.mp3'
                                                                                                                  ),( 'Inteligencia Artificial Moderna'
                                                                                                                  ,
                                                                                                                                                              'Revista Digital'
                                                                                                                                                              ,
                                                                                                                                                              'PDF'
                                                                                                                                                              ,
                                                                                                                                                              'https://biblioteca.edu/recursos/ia.pdf'
                                                                                                                                                              )
                                                                                                                                                              ,
                                                                                                                                                              (
                                                                                                                                                              'Manual de SQL'
                                                                                                                                                              ,
                                                                                                                                                                                                       'E-book'
                                                                                                                                                                                                       ,
                                                                                                                                                                                                       'PDF'
                                                                                                                                                                                                       ,
                                                                                                                                                                                                       'https://biblioteca.edu/recursos/sql.pdf'
                                                                                                                                                                                                       )
                                                                                                                                                                                                       ;

-- ============================================================
-- DESCARGAS_ACCESOS
-- ============================================================

insert into descargas_accesos (
   tipoaccion,
   idusuario,
   idrecurso
) values ( 'Descarga',
           1,
           1 ),( 'Visualización',
                 2,
                 3 ),( 'Descarga',
                       3,
                       2 ),( 'Visualización',
                             4,
                             5 ),( 'Descarga',
                                   5,
                                   4 ),( 'Descarga',
                                         6,
                                         1 ),( 'Visualización',
                                               7,
                                               2 ),( 'Descarga',
                                                     8,
                                                     5 );

-- ============================================================
-- DISPOSITIVOS_PRESTADOS
-- ============================================================

insert into dispositivos_prestados (
   nombredispositivo,
   tipodispositivo,
   numeroserie,
   estado
) values ( 'Tablet Samsung Galaxy Tab A9',
           'Tablet',
           'TAB-A9-001',
           'Disponible' ),( 'Laptop Dell Latitude 5440',
                            'Laptop',
                            'LAP-DELL-001',
                            'Prestado' ),( 'Kindle Paperwhite 11',
                                           'Lector E-book',
                                           'KIN-001',
                                           'Disponible' ),( 'Tablet Lenovo M10',
                                                            'Tablet',
                                                            'TAB-LEN-001',
                                                            'Mantenimiento' );

-- ============================================================
-- MÓDULO 7: EVENTOS
-- INSERTS
-- ============================================================

-- ============================================================
-- EVENTOS
-- ============================================================

insert into eventos (
   nombreevento,
   descripcion,
   fechaevento,
   capacidadmaxima,
   lugar
) values ( 'Club de Lectura: Cien Años de Soledad',
           'Análisis y discusión de la obra de Gabriel García Márquez.',
           '2026-04-10',
           30,
           'Sala de Conferencias A' ),( 'Taller de SQL Básico',
                                        'Introducción a consultas SQL para estudiantes.',
                                        '2026-04-18',
                                        25,
                                        'Laboratorio de Informática' ),( 'Conferencia: Inteligencia Artificial',
                                                                         'Charla sobre tendencias actuales en IA.',
                                                                         '2026-05-02',
                                                                         60,
                                                                         'Auditorio Principal' ),( 'Feria del Libro Universitaria'
                                                                         ,
                                                                                                   'Exposición de editoriales y venta de libros.'
                                                                                                   ,
                                                                                                   '2026-05-20',
                                                                                                   100,
                                                                                                   'Plaza Central' );

-- ============================================================
-- ASISTENCIAS_EVENTOS
-- ============================================================

insert into asistencias_eventos (
   idevento,
   idusuario,
   fecharegistro,
   asistencia
) values ( 1,
           1,
           '2026-04-01',
           'Sí' ),( 1,
                    3,
                    '2026-04-02',
                    'Sí' ),( 2,
                             2,
                             '2026-04-10',
                             'Sí' ),( 2,
                                      5,
                                      '2026-04-11',
                                      'No' ),( 3,
                                               4,
                                               '2026-04-20',
                                               'Sí' ),( 3,
                                                        6,
                                                        '2026-04-22',
                                                        'Sí' ),( 4,
                                                                 7,
                                                                 '2026-05-01',
                                                                 'Sí' ),( 4,
                                                                          8,
                                                                          '2026-05-03',
                                                                          'Pendiente' );