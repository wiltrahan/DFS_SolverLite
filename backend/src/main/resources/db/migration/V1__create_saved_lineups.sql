CREATE TABLE saved_lineups (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    contest_mode VARCHAR(32) NOT NULL,
    total_salary INTEGER NOT NULL CHECK (total_salary >= 0),
    lineup_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_lineups_created_at ON saved_lineups (created_at DESC);

