ALTER TABLE rsvps ADD COLUMN entry_id TEXT;
ALTER TABLE wishes ADD COLUMN entry_id TEXT;
CREATE INDEX rsvps_entry ON rsvps(entry_id);
CREATE INDEX wishes_entry ON wishes(entry_id);
