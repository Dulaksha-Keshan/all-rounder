"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { use } from "react";
import Table from "@/app/dashboard/_components/Table";
import TableSearch from "@/app/dashboard/_components/TableSearch";
import Pagination from "@/components/Pagiation";
import { Students, Schools } from "@/app/_data/data";

const ITEM_PER_PAGE = 10;

interface StudentListPageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

const StudentListPage = ({ params }: StudentListPageProps) => {
  const { schoolId } = use(params);
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const search = searchParams.get("search")?.toLowerCase() || "";

  // Find the school - show 404 if not found
  const school = Schools.find((s) => s.id === schoolId);
  
  if (!school) {
    notFound();
  }

  // ------------- FILTER BY SCHOOL ID -------------
  let filteredStudents = Students.filter(
    (student) => student.schoolId === schoolId
  );

  // ------------- SEARCH -------------
  if (search) {
    filteredStudents = filteredStudents.filter(
      (student) =>
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search)
    );
  }

  const count = filteredStudents.length;

  // ------------- PAGINATION -------------
  const data = filteredStudents.slice(
    ITEM_PER_PAGE * (page - 1),
    ITEM_PER_PAGE * page
  );

  const columns = [
    { header: "Student", accessor: "name" },
    { header: "Email", accessor: "email", className: "hidden md:table-cell" },
    { header: "Age", accessor: "age", className: "hidden lg:table-cell" },
    { header: "Gender", accessor: "sex", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (student: any) => (
    <tr
      key={student.id}
      className="border-b border-[var(--secondary-light-lavender)]/30 text-sm hover:bg-gradient-to-r hover:from-[var(--secondary-pale-lavender)] hover:to-[var(--secondary-light-lavender)]/30 transition-all"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <Image
            src={student.photoUrl || "/noAvatar.png"}
            alt={student.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-[var(--primary-purple)]/30"
          />
          <span className="font-medium text-[var(--primary-dark-purple)]">{student.name}</span>
        </div>
      </td>
      <td className="hidden md:table-cell text-[var(--accent-purple-text)] py-4 px-6">
        {student.email}
      </td>
      <td className="hidden lg:table-cell text-[var(--accent-purple-text)] py-0 px-6 text-left">
        <span className="inline-block">{student.age}</span>
      </td>
      <td className="hidden lg:table-cell text-[var(--accent-purple-text)] py-4 px-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            student.sex === "MALE"
              ? "bg-blue-100 text-blue-700"
              : "bg-pink-100 text-pink-700"
          }`}
        >
          {student.sex}
        </span>
      </td>
      <td className="py-4 px-6">
        <Link
          href={`/dashboard/schools/${schoolId}/students/${student.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] text-[var(--white)] rounded-lg text-xs font-medium hover:shadow-md transition-all"
        >
          View Profile
        </Link>
      </td>
    </tr>
  );

  return (
    <div className="bg-gradient-to-br from-[var(--white)] to-[var(--secondary-pale-lavender)] p-6 rounded-2xl shadow-lg border-2 border-[var(--secondary-light-lavender)]/50">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark-purple)]">
            Students – {school.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{school.location}</p>
        </div>
        <TableSearch />
      </div>

      {/* STATS */}
      <div className="mb-4 p-4 bg-gradient-to-r from-[var(--primary-purple)]/10 to-[var(--primary-blue)]/10 rounded-lg border border-[var(--secondary-light-lavender)]">
        <p className="text-sm text-[var(--primary-dark-purple)]">
          <span className="font-bold text-lg">{count}</span> students enrolled
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-[var(--white)] rounded-xl overflow-hidden border-2 border-[var(--secondary-light-lavender)]/50 shadow-sm">
        {data.length > 0 ? (
          <Table columns={columns} data={data} renderRow={renderRow} />
        ) : (
          <div className="py-12 text-center text-gray-400">
            <p className="text-lg">No students found</p>
            {search && (
              <p className="text-sm mt-2">Try adjusting your search criteria</p>
            )}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {count > 0 && <Pagination page={page} count={count} />}
    </div>
  );
};

export default StudentListPage;