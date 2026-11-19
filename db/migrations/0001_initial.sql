CREATE TABLE rsvps (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL CHECK(length(guest_name) BETWEEN 1 AND 80),
  attendance TEXT NOT NULL CHECK(attendance IN ('yes','no')),
  public_consent INTEGER NOT NULL DEFAULT 0 CHECK(public_consent IN (0,1)),
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE wishes (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL CHECK(length(guest_name) BETWEEN 1 AND 80),
  message TEXT NOT NULL CHECK(length(message) BETWEEN 1 AND 1000),
  public_consent INTEGER NOT NULL DEFAULT 0 CHECK(public_consent IN (0,1)),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
  idempotency_key TEXT NOT NULL UNIQUE,
  request_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX wishes_public ON wishes(status, public_consent, created_at);
CREATE INDEX rsvps_public ON rsvps(public_consent, created_at);
CREATE TABLE rate_limits (
  bucket_key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
