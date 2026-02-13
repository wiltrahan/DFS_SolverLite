ALTER TABLE saved_lineups
    ADD COLUMN id_new BIGSERIAL;

ALTER TABLE saved_lineups
    DROP CONSTRAINT saved_lineups_pkey;

ALTER TABLE saved_lineups
    DROP COLUMN id;

ALTER TABLE saved_lineups
    RENAME COLUMN id_new TO id;

ALTER TABLE saved_lineups
    ADD CONSTRAINT saved_lineups_pkey PRIMARY KEY (id);

