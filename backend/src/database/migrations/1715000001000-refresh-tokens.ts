import { MigrationInterface, QueryRunner } from 'typeorm';

export class RefreshTokens1715000001000 implements MigrationInterface {
  name = 'RefreshTokens1715000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        idrefreshtoken   SERIAL PRIMARY KEY,
        idusuario        INT REFERENCES usuarios(idusuario),
        idempleado       INT REFERENCES empleados(idempleado),
        tokenhash        VARCHAR(255) NOT NULL UNIQUE,
        fechaemision     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        fechaexpiracion  TIMESTAMP NOT NULL,
        revocado         BOOLEAN NOT NULL DEFAULT FALSE,
        fecharevocacion  TIMESTAMP,
        useragent        VARCHAR(255),
        CONSTRAINT chk_refresh_token_titular CHECK (
          (idusuario IS NOT NULL AND idempleado IS NULL) OR
          (idusuario IS NULL AND idempleado IS NOT NULL)
        )
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS refresh_tokens`);
  }
}
