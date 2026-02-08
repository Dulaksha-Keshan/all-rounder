// app/dashboard/page.tsx
import { redirect } from "next/navigation";

async function getCurrentUser() {
  // Example mock – replace with NextAuth / custom auth
  return {
    role: "SCHOOL", // ORGANIZATION | SCHOOL | STUDENT | TEACHER
    orgId: "org_1",
    schoolId: "school_1",
    studentId: "student_1",
    teacherId: "teacher_1",
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  switch (user.role) {
    case "ORGANIZATION":
      if (!user.orgId) redirect("/unauthorized");
      redirect(`/dashboard/orgs/${user.orgId}`);

    case "SCHOOL":
      if (!user.schoolId) redirect("/unauthorized");
      redirect(`/dashboard/schools/${user.schoolId}`);

    case "STUDENT":
      if (!user.studentId) redirect("/dashboard/students");
      redirect(`/dashboard/students/${user.studentId}`);

    case "TEACHER":
      if (!user.teacherId) redirect("/dashboard/teachers");
      redirect(`/dashboard/teachers/${user.teacherId}`);

    default:
      redirect("/unauthorized");
  }
}
