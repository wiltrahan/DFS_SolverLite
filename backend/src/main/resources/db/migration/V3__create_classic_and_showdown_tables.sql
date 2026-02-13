CREATE TABLE classic_lineups (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    total_salary INTEGER NOT NULL CHECK (total_salary >= 0),
    total_ownership NUMERIC(10,2) NOT NULL DEFAULT 0,
    qb VARCHAR(255) NOT NULL,
    rb1 VARCHAR(255) NOT NULL,
    rb2 VARCHAR(255) NOT NULL,
    wr1 VARCHAR(255) NOT NULL,
    wr2 VARCHAR(255) NOT NULL,
    wr3 VARCHAR(255) NOT NULL,
    te VARCHAR(255) NOT NULL,
    flex VARCHAR(255) NOT NULL,
    dst VARCHAR(255) NOT NULL,
    lineup_data JSONB NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE showdown_lineups (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    total_salary INTEGER NOT NULL CHECK (total_salary >= 0),
    total_ownership NUMERIC(10,2) NOT NULL DEFAULT 0,
    captain VARCHAR(255) NOT NULL,
    player1 VARCHAR(255) NOT NULL,
    player2 VARCHAR(255) NOT NULL,
    player3 VARCHAR(255) NOT NULL,
    player4 VARCHAR(255) NOT NULL,
    player5 VARCHAR(255) NOT NULL,
    lineup_data JSONB NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_classic_lineups_created_date ON classic_lineups (created_date DESC);
CREATE INDEX idx_showdown_lineups_created_date ON showdown_lineups (created_date DESC);

-- One-time migration from legacy unified table.
INSERT INTO classic_lineups (
    title,
    total_salary,
    total_ownership,
    qb, rb1, rb2, wr1, wr2, wr3, te, flex, dst,
    lineup_data,
    created_date,
    updated_date
)
SELECT
    title,
    total_salary,
    COALESCE((
        SELECT ROUND(SUM((p->>'ownership')::numeric), 2)
        FROM jsonb_array_elements(COALESCE(lineup_data->'players', '[]'::jsonb)) p
    ), 0),
    COALESCE(lineup_data->'slots'->0->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->1->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->2->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->3->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->4->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->5->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->6->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->7->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->8->'player'->>'name', ''),
    lineup_data,
    created_at,
    created_at
FROM saved_lineups
WHERE UPPER(contest_mode) = 'CLASSIC'
  AND jsonb_typeof(lineup_data->'slots') = 'array'
  AND jsonb_array_length(lineup_data->'slots') >= 9;

INSERT INTO showdown_lineups (
    title,
    total_salary,
    total_ownership,
    captain, player1, player2, player3, player4, player5,
    lineup_data,
    created_date,
    updated_date
)
SELECT
    title,
    total_salary,
    COALESCE((
        SELECT ROUND(SUM((p->>'ownership')::numeric), 2)
        FROM jsonb_array_elements(COALESCE(lineup_data->'players', '[]'::jsonb)) p
    ), 0),
    COALESCE(lineup_data->'slots'->0->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->1->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->2->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->3->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->4->'player'->>'name', ''),
    COALESCE(lineup_data->'slots'->5->'player'->>'name', ''),
    lineup_data,
    created_at,
    created_at
FROM saved_lineups
WHERE UPPER(contest_mode) = 'SHOWDOWN'
  AND jsonb_typeof(lineup_data->'slots') = 'array'
  AND jsonb_array_length(lineup_data->'slots') >= 6;
