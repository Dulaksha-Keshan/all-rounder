"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Table from "../../_components/Table";
import TableSearch from "../../_components/TableSearch";
import { Students } from "@/app/dashboard/_data/data";

const StudentListPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  // FILTER MOCK DATA
  const filteredStudents = Students.filter(
    (student) =>
      student.name.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search) ||
      student.school.toLowerCase().includes(search)
  );

  const columns = [
    { header: "Student", accessor: "name" },
    { header: "School", accessor: "school", className: "hidden md:table-cell" },
    { header: "Age", accessor: "age", className: "hidden lg:table-cell" },
    { header: "Gender", accessor: "sex", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (student: any) => (
    <tr
      key={student.id}
      className="border-b border-gray-200 text-sm hover:bg-gray-50"
    >
      <td className="flex items-center gap-2 p-4">
        <Image
          src={student.photoUrl || "/noAvatar.png"}
          alt={student.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <span>{student.name}</span>
      </td>

      <td className="hidden md:table-cell">{student.school}</td>
      <td className="hidden lg:table-cell">{student.age}</td>
      <td className="hidden lg:table-cell">{student.sex}</td>

      <td>
        <Link
          href={`/students/${student.id}`}
          className="text-lamaSky hover:underline"
        >
          View
        </Link>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md">
      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Students</h1>
        <TableSearch />
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        data={filteredStudents}
        renderRow={renderRow}
      />
    </div>
  );
};

export default StudentListPage;
