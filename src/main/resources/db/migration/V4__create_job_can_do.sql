CREATE TABLE job_can_do (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    graduate_id UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
    job_title   VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
