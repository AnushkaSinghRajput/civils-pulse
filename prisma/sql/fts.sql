-- PostgreSQL full-text search for published PYQs
-- Apply after migrate: psql $DATABASE_URL -f prisma/sql/fts.sql

ALTER TABLE "Question"
  ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE INDEX IF NOT EXISTS question_search_vector_gin
  ON "Question" USING GIN (search_vector);

CREATE OR REPLACE FUNCTION question_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.stem, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."optionA", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW."optionB", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW."optionC", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW."optionD", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.explanation, '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS question_search_vector_trigger ON "Question";
CREATE TRIGGER question_search_vector_trigger
  BEFORE INSERT OR UPDATE OF stem, "optionA", "optionB", "optionC", "optionD", explanation
  ON "Question"
  FOR EACH ROW EXECUTE FUNCTION question_search_vector_update();

UPDATE "Question"
SET search_vector =
  setweight(to_tsvector('english', coalesce(stem, '')), 'A') ||
  setweight(to_tsvector('english', coalesce("optionA", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("optionB", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("optionC", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("optionD", '')), 'B') ||
  setweight(to_tsvector('english', coalesce(explanation, '')), 'C')
WHERE search_vector IS NULL;
