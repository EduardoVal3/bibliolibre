import { rm } from 'fs/promises';
import { join } from 'path';

export default async function () {
  // Clean up any temporary test data
  const testDbPath = join(__dirname, '../../data/test.sqlite');
  try { await rm(testDbPath, { force: true }); } catch {}
}
