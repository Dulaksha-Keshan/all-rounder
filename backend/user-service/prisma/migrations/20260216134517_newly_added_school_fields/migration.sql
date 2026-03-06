/*
  Warnings:

  - Added the required column `gender` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `school_level` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zone` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Boys', 'Girls', 'Mixed');

-- AlterTable
ALTER TABLE "School" ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "province" TEXT NOT NULL,
ADD COLUMN     "school_level" TEXT NOT NULL,
ADD COLUMN     "zone" TEXT NOT NULL;
