CREATE TABLE IF NOT EXISTS contributions (id TEXT PRIMARY KEY, kind TEXT NOT NULL, actor TEXT NOT NULL, title TEXT NOT NULL, created_at TEXT NOT NULL, status TEXT NOT NULL, payload TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS contributions_created ON contributions(created_at);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS intake_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at TEXT NOT NULL);
