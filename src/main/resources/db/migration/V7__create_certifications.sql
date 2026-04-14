CREATE TABLE certifications (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    graduate_id          UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
    name                 VARCHAR(255) NOT NULL,
    issuing_organization VARCHAR(255),
    issue_date           DATE,
    created_at           TIMESTAMP NOT NULL DEFAULT NOW()
);
