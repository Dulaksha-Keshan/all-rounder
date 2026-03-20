-- Add platform verification tracking flag to all user tables.
ALTER TABLE "Student"
ADD COLUMN IF NOT EXISTS "is_verified" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Teacher"
ADD COLUMN IF NOT EXISTS "is_verified" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Admin"
ADD COLUMN IF NOT EXISTS "is_verified" BOOLEAN NOT NULL DEFAULT false;
