CREATE TABLE education (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    graduate_id    UUID NOT NULL REFERENCES graduates(id) ON DELETE CASCADE,
    institution    VARCHAR(255) NOT NULL,
    degree         VARCHAR(255) NOT NULL,
    field_of_study VARCHAR(255),
    start_date     DATE,
    end_date       DATE,
    created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);
