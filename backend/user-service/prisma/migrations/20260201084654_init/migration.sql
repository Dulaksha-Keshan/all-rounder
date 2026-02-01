-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'ORG_ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "Student" (
    "student_id" SERIAL NOT NULL,
    "firebase_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "contact_number" TEXT,
    "profile_picture" TEXT,
    "grade" TEXT NOT NULL,
    "about" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "school_id" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacher_id" SERIAL NOT NULL,
    "firebase_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "contact_number" TEXT,
    "profile_picture" TEXT,
    "subject" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "staff_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "school_id" INTEGER NOT NULL,

    CONSTRAINT "Teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" SERIAL NOT NULL,
    "firebase_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "adminType" "UserType" NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "contact_number" TEXT,
    "profile_picture" TEXT,
    "staff_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "school_id" INTEGER,
    "organization_id" INTEGER,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "School" (
    "school_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "student_count" INTEGER,
    "email" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "principal_name" TEXT,
    "web_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("school_id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "organization_id" SERIAL NOT NULL,
    "organization_name" TEXT NOT NULL,
    "contact_person" TEXT NOT NULL,
    "website" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("organization_id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "skill_id" SERIAL NOT NULL,
    "skill_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("skill_id")
);

-- CreateTable
CREATE TABLE "_SkillToStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SkillToStudent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_email_key" ON "Teacher"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE INDEX "_SkillToStudent_B_index" ON "_SkillToStudent"("B");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("school_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Teacher" ADD CONSTRAINT "Teacher_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("school_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "School"("school_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "Organization"("organization_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToStudent" ADD CONSTRAINT "_SkillToStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "Skill"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillToStudent" ADD CONSTRAINT "_SkillToStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("student_id") ON DELETE CASCADE ON UPDATE CASCADE;
