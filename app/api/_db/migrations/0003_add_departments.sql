CREATE TABLE IF NOT EXISTS "departments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "entity_id" uuid,
  "name" varchar(255) NOT NULL,
  "slug" varchar(255) NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "departments_slug_unique" UNIQUE("slug")
);

ALTER TABLE "departments"
ADD COLUMN IF NOT EXISTS "entity_id" uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_schema = 'public'
      AND table_name = 'departments'
      AND constraint_name = 'departments_entity_id_entities_id_fk'
  ) THEN
    ALTER TABLE "departments"
    ADD CONSTRAINT "departments_entity_id_entities_id_fk"
    FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id");
  END IF;
END $$;

INSERT INTO "departments" ("name", "slug")
SELECT source.name, source.slug
FROM (
  SELECT
    MIN(TRIM("department")) AS name,
    LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM("department"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) AS slug
  FROM "jobs"
  WHERE "department" IS NOT NULL AND TRIM("department") <> ''
  GROUP BY LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM("department"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
) AS source
WHERE source.slug <> ''
ON CONFLICT ("slug") DO NOTHING;

UPDATE "departments"
SET "entity_id" = source.entity_id
FROM (
  SELECT DISTINCT ON (LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(j."department"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')))
    LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(j."department"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')) AS slug,
    j."entity_id"
  FROM "jobs" j
  WHERE j."department" IS NOT NULL AND TRIM(j."department") <> ''
  ORDER BY LOWER(REGEXP_REPLACE(REGEXP_REPLACE(TRIM(j."department"), '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g')), j."created_at" DESC
) AS source
WHERE "departments"."slug" = source.slug
  AND "departments"."entity_id" IS NULL;
