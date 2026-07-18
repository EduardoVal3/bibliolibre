import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export class EmpleadosAuth1715000000900 implements MigrationInterface {
  name = 'EmpleadosAuth1715000000900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE empleados ADD COLUMN IF NOT EXISTS passwordhash varchar(255)`);
    await queryRunner.query(`ALTER TABLE empleados ADD COLUMN IF NOT EXISTS requierecambiopassword boolean NOT NULL DEFAULT false`);

    const empleados: { idempleado: number; correo: string }[] = await queryRunner.query(
      `SELECT e.idempleado, p.correo FROM empleados e JOIN persona p ON p.idpersona = e.idpersona WHERE e.passwordhash IS NULL`,
    );

    if (empleados.length > 0) {
      const rows: string[] = [];
      for (const emp of empleados) {
        const plainPassword = crypto.randomBytes(8).toString('hex');
        const hash = await bcrypt.hash(plainPassword, 10);
        await queryRunner.query(
          `UPDATE empleados SET passwordhash = $1, requierecambiopassword = true WHERE idempleado = $2`,
          [hash, emp.idempleado],
        );
        rows.push(`${emp.idempleado},${emp.correo},${plainPassword}`);
      }

      const tmpDir = path.join(process.cwd(), 'tmp');
      fs.mkdirSync(tmpDir, { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, 'empleados-passwords-temporales.csv'),
        'idempleado,correo,password\n' + rows.join('\n'),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE empleados DROP COLUMN IF EXISTS requierecambiopassword`);
    await queryRunner.query(`ALTER TABLE empleados DROP COLUMN IF EXISTS passwordhash`);
  }
}
