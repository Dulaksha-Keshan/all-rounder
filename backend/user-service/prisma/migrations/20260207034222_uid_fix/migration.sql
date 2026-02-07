/*
  Warnings:

  - The primary key for the `Admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `admin_id` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `firebase_id` on the `Admin` table. All the data in the column will be lost.
  - The primary key for the `Student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firebase_id` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `Student` table. All the data in the column will be lost.
  - The primary key for the `Teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `firebase_id` on the `Teacher` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `Teacher` table. All the data in the column will be lost.
  - The primary key for the `_SkillToStudent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[uid]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Teacher` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_SkillToStudent" DROP CONSTRAINT "_SkillToStudent_B_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_pkey",
DROP COLUMN "admin_id",
DROP COLUMN "firebase_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Student" DROP CONSTRAINT "Student_pkey",
DROP COLUMN "firebase_id",
DROP COLUMN "student_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "Student_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "Teacher" DROP CONSTRAINT "Teacher_pkey",
DROP COLUMN "firebase_id",
DROP COLUMN "teacher_id",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD CONSTRAINT "Teacher_pkey" PRIMARY KEY ("uid");

-- AlterTable
ALTER TABLE "_SkillToStudent" DROP CONSTRAINT "_SkillToStudent_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_SkillToStudent_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_uid_key" ON "Admin"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Student_uid_key" ON "Student"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_uid_key" ON "Teacher"("uid");

-- AddForeignKey
ALTER TABLE "_SkillToStudent" ADD CONSTRAINT "_SkillToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
