/*
  Warnings:

  - The primary key for the `Organization` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `School` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "HostType" AS ENUM ('SCHOOL', 'ORGANIZATION');

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_school_id_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_school_id_fkey";

-- DropForeignKey
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_school_id_fkey";

-- AlterTable
ALTER TABLE "Admin" ALTER COLUMN "school_id" SET DATA TYPE TEXT,
ALTER COLUMN "organization_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_pkey",
ALTER COLUMN "organization_id" DROP DEFAULT,
ALTER COLUMN "organization_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Organization_pkey" PRIMARY KEY ("organization_id");
DROP SEQUENCE "Organization_organization_id_seq";

-- AlterTable
ALTER TABLE "School" DROP CONSTRAINT "School_pkey",
ALTER COLUMN "school_id" DROP DEFAULT,
ALTER COLUMN "school_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "School_pkey" PRIMARY KEY ("school_id");
DROP SEQUENCE "School_school_id_seq";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "school_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Teacher" ALTER COLUMN "school_id" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "event_hosts" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "hostType" "HostType" NOT NULL,
    "schoolId" TEXT,
    "organizationId" TEXT,
    "isPrimaryHost" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_hosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_hosts_eventId_idx" ON "event_hosts"("eventId");

-- CreateIndex
CREATE INDEX "event_hosts_schoolId_idx" ON "event_hosts"("schoolId");

-- CreateIndex
CREATE INDEX "event_hosts_organizationId_idx" ON "event_hosts"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "event_hosts_eventId_schoolId_key" ON "event_hosts"("eventId", "schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "event_hosts_eventId_organizationId_key" ON "event_hosts"("eventId", "organizationId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("school_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("school_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("school_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("organization_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_hosts" ADD CONSTRAINT "event_hosts_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("school_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_hosts" ADD CONSTRAINT "event_hosts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("organization_id") ON DELETE CASCADE ON UPDATE CASCADE;
