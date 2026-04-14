CREATE TYPE proficiency_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

CREATE TABLE skills (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    graduate_id       UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
    skill_name        VARCHAR(255) NOT NULL,
    proficiency_level proficiency_level NOT NULL,
    created_at        TIMESTAMP NOT NULL DEFAULT NOW()
);
