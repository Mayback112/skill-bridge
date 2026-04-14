CREATE TABLE work_experience (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    graduate_id UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
    job_title   VARCHAR(255) NOT NULL,
    company     VARCHAR(255) NOT NULL,
    start_date  DATE,
    end_date    DATE,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);
