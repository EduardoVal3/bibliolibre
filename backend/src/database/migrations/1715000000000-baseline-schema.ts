import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

export class BaselineSchema1715000000000 implements MigrationInterface {
  name = 'BaselineSchema1715000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const filePath = path.join(__dirname, '../../../../Archivo2.sql');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Archivo2.sql not found at: ${filePath}`);
    }
    const sql = fs.readFileSync(filePath, 'utf8');
    await queryRunner.query(sql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const tables = [
      'asistencias_eventos',
      'eventos',
      'dispositivos_prestados',
      'descargas_accesos',
      'recursos_digitales',
      'detalles_orden',
      'ordenes_compra',
      'presupuestos',
      'proveedores',
      'pagos_ventas',
      'metodos_pago',
      'detalles_venta',
      'ventas',
      'productos_venta',
      'rol_permiso',
      'permisos',
      'empleados',
      'turnos',
      'roles_empleado',
      'historial_prestamos',
      'reservas',
      'devoluciones',
      'detalles_prestamo',
      'prestamos',
      'historial_membresias',
      'membresias',
      'usuarios',
      'persona',
      'tipos_usuario',
      'edicion_volumen',
      'ubicaciones_fisicas',
      'libro_palabra_clave',
      'palabras_clave',
      'libro_autor',
      'autores',
      'libros',
      'categorias',
      'editoriales',
      'idiomas',
    ];
    for (const table of tables) {
      await queryRunner.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    }
  }
}
