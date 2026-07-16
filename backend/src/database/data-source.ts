import { DataSource } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';

// Parse .env manually to avoid extra dependencies (dotenv)
try {
  const envPath = join(__dirname, '../../.env');
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...valueParts] = trimmed.split('=');
    if (key) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  }
} catch (err) {
  // .env might not exist, proceed with existing process.env
}

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, '/migrations/*.{ts,js}')],
  synchronize: false,
  migrationsRun: false,
});
