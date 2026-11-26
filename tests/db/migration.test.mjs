import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { migrateLocal } from '../../scripts/migrate-local.mjs';

test('SQLite migration applies once and preserves RSVP across reopen', () => {
  const directory = mkdtempSync(join(tmpdir(), 'graduation-'));
  const path = join(directory, 'test.db');
  try {
    migrateLocal(path);
    const db = new DatabaseSync(path);
    try {
      const insert = db.prepare('INSERT INTO rsvps (id, guest_name, attendance, idempotency_key, request_hash) VALUES (?, ?, ?, ?, ?)');
      insert.run('fixture', 'Khách thử', 'yes', 'key', 'hash');
      assert.throws(() => insert.run('another', 'Khách thử', 'no', 'key', 'hash'));
      assert.throws(() => insert.run('another', 'Khách thử', 'maybe', 'another-key', 'hash'));
      db.exec("INSERT INTO wishes (id, guest_name, message, idempotency_key, request_hash) VALUES ('wish','Khách thử','Chúc mừng','wish-key','hash')");
      const wish = db.prepare('SELECT status, public_consent FROM wishes').get();
      assert.equal(wish.status, 'pending');
      assert.equal(wish.public_consent, 0);
    } finally {
      db.close();
    }
    const backup = join(directory, 'backup.db');
    copyFileSync(path, backup);
    migrateLocal(path);
    for (const file of [path, backup]) {
      const reopened = new DatabaseSync(file);
      try {
        assert.equal(reopened.prepare('SELECT count(*) AS count FROM schema_migrations').get().count, 3);
        assert.equal(reopened.prepare('SELECT public_consent FROM rsvps WHERE id = ?').get('fixture').public_consent, 0);
        const rsvpColumns = reopened.prepare('PRAGMA table_info(rsvps)').all().map(column => column.name);
        assert.ok(rsvpColumns.includes('message'));
        const wishColumns = reopened.prepare('PRAGMA table_info(wishes)').all().map(column => column.name);
        assert.ok(wishColumns.includes('moderated_at'));
        assert.ok(wishColumns.includes('moderated_by'));
        reopened.prepare("UPDATE wishes SET status='approved', moderated_at='2026-11-26T00:00:00.000Z', moderated_by='cli' WHERE id='wish'").run();
        const moderated = reopened.prepare('SELECT status, moderated_at, moderated_by FROM wishes WHERE id = ?').get('wish');
        assert.equal(moderated.status, 'approved');
        assert.equal(moderated.moderated_by, 'cli');
      } finally {
        reopened.close();
      }
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
