

"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Table from "../../_components/Table";
import TableSearch from "../../_components/TableSearch";
import Pagination from "../../_components/Pagination";
import { Students } from "@/app/dashboard/_data/data";

const ITEM_PER_PAGE = 10;
const SCHOOL_NAME = "Dudley Senanayaka Vidyalaya";

const StudentListPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const search = searchParams.get("search")?.toLowerCase() || "";

  // ------------- FILTER BY SCHOOL -------------
  let filteredStudents = Students.filter(
    (student) => student.school === SCHOOL_NAME
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
    { header: "School", accessor: "school", className: "hidden md:table-cell" },
    { header: "Age", accessor: "age",  className: "hidden lg:table-cell"},
    { header: "Gender", accessor: "sex", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (student: any) => (
    <tr
      key={student.id}
      className="border-b border-[#DCD0FF]/30 text-sm hover:bg-gradient-to-r hover:from-[#F8F8FF] hover:to-[#DCD0FF]/30 transition-all"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <Image
            src={student.photoUrl || "/noAvatar.png"}
            alt={student.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-[#8387CC]/30"
          />
          <span className="font-medium text-[#34365C]">{student.name}</span>
        </div>
      </td>
      <td className="hidden md:table-cell text-[#505485] py-4 px-6">
        {student.school}
      </td>
      <td className="hidden lg:table-cell text-[#505485] py-0 px-6 text-left">
        <span className="inline-block">{student.age}</span>
      </td>
      <td className="hidden lg:table-cell text-[#505485] py-4 px-6">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          student.sex === 'MALE' 
            ? 'bg-blue-100 text-blue-700' 
            : 'bg-pink-100 text-pink-700'
        }`}>
          {student.sex}
        </span>
      </td>
      <td className="py-4 px-6">
        <Link
          href={`/students/${student.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
        >
          View Profile
        </Link>
      </td>
    </tr>
  );

  return (
    <div className="bg-gradient-to-br from-white to-[#F8F8FF] p-6 rounded-2xl shadow-lg border-2 border-[#DCD0FF]/50">
      {/* TOP BAR */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#34365C]">
          Students – {SCHOOL_NAME}
        </h1>
        <TableSearch />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-hidden border-2 border-[#DCD0FF]/50 shadow-sm">
        <Table columns={columns} data={data} renderRow={renderRow} />
      </div>

      {/* PAGINATION */}
      <Pagination page={page} count={count} />
    </div>
  );
};

export default StudentListPage;