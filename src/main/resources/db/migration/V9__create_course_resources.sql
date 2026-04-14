CREATE TABLE course_resources (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title      VARCHAR(255) NOT NULL,
    url        VARCHAR(500) NOT NULL,
    platform   VARCHAR(255),
    skill_tag  VARCHAR(255) NOT NULL,
    added_by   UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
