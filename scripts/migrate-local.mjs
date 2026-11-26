import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

export function migrateLocal(path) {
  const db = new DatabaseSync(path);
  try {
    db.exec('PRAGMA busy_timeout = 5000; BEGIN IMMEDIATE');
    db.exec('CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY)');
    const directory = new URL('../db/migrations/', import.meta.url);
    const files = readdirSync(directory).filter(file => /^\d{4}_.+\.sql$/.test(file)).sort();
    for (const file of files) {
      const version = Number(file.slice(0, 4));
      if (db.prepare('SELECT version FROM schema_migrations WHERE version = ?').get(version)) continue;
      db.exec(readFileSync(new URL(file, directory), 'utf8'));
      db.prepare('INSERT INTO schema_migrations (version) VALUES (?)').run(version);
    }
    db.exec('COMMIT');
  } finally {
    db.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.env.VERCEL || process.env.DATABASE_URL) {
    throw new Error('This command only migrates an explicit local SQLite file.');
  }
  if (!process.argv[2]) throw new Error('Usage: node scripts/migrate-local.mjs <path>');
  const path = resolve(process.argv[2]);
  mkdirSync(dirname(path), { recursive: true });
  migrateLocal(path);
}
