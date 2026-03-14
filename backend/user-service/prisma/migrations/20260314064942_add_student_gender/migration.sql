/*
  Warnings:

  - A unique constraint covering the columns `[skill_name]` on the table `Skill` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gender` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "pendingVerificationIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "processedVerificationIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "pendingVerificationIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "processedVerificationIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Skill" ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "gender" TEXT;

-- Backfill existing rows before enforcing NOT NULL
UPDATE "Student"
SET "gender" = 'male'
WHERE "gender" IS NULL;

-- Enforce non-null after backfill
ALTER TABLE "Student" ALTER COLUMN "gender" SET NOT NULL;

-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "pendingVerificationIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "processedVerificationIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Follow_followerId_idx" ON "Follow"("followerId");

-- CreateIndex
CREATE INDEX "Follow_followingId_idx" ON "Follow"("followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_followerId_followingId_key" ON "Follow"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "Skill_skill_name_key" ON "Skill"("skill_name");
