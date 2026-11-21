ALTER TABLE rsvps ADD COLUMN message TEXT CHECK(message IS NULL OR length(message) <= 1000);
