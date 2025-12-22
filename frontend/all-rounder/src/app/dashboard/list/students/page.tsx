// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// import Table from "../../_components/Table";
// import TableSearch from "../../_components/TableSearch";
// import { Students } from "@/app/dashboard/_data/data";

// const StudentListPage = () => {
//   const searchParams = useSearchParams();
//   const search = searchParams.get("search")?.toLowerCase() || "";

//   // FILTER MOCK DATA
//   const filteredStudents = Students.filter(
//     (student) =>
//       student.name.toLowerCase().includes(search) ||
//       student.email.toLowerCase().includes(search) ||
//       student.school.toLowerCase().includes(search)
//   );

//   const columns = [
//     { header: "Student", accessor: "name" },
//     { header: "School", accessor: "school", className: "hidden md:table-cell" },
//     { header: "Age", accessor: "age", className: "hidden lg:table-cell" },
//     { header: "Gender", accessor: "sex", className: "hidden lg:table-cell" },
//     { header: "Actions", accessor: "action" },
//   ];

//   const renderRow = (student: any) => (
//     <tr
//       key={student.id}
//       className="border-b border-gray-200 text-sm hover:bg-gray-50"
//     >
//       <td className="flex items-center gap-2 p-4">
//         <Image
//           src={student.photoUrl || "/noAvatar.png"}
//           alt={student.name}
//           width={40}
//           height={40}
//           className="rounded-full"
//         />
//         <span>{student.name}</span>
//       </td>

//       <td className="hidden md:table-cell">{student.school}</td>
//       <td className="hidden lg:table-cell">{student.age}</td>
//       <td className="hidden lg:table-cell">{student.sex}</td>

//       <td>
//         <Link
//           href={`/students/${student.id}`}
//           className="text-lamaSky hover:underline"
//         >
//           View
//         </Link>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="bg-white p-4 rounded-md">
//       {/* TOP BAR */}
//       <div className="flex items-center justify-between">
//         <h1 className="text-lg font-semibold">Students</h1>
//         <TableSearch />
//       </div>

//       {/* TABLE */}
//       <Table
//         columns={columns}
//         data={filteredStudents}
//         renderRow={renderRow}
//       />
//     </div>
//   );
// };

// export default StudentListPage;

// StudentListPage.tsx
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
      className="border-b border-[#DCD0FF] text-sm hover:bg-gradient-to-r hover:from-[#F8F8FF] hover:to-[#DCD0FF]/30 transition-all"
    >
      <td className="flex items-center gap-3 p-4">
        <div className="relative">
          <Image
            src={student.photoUrl || "/noAvatar.png"}
            alt={student.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-[#8387CC]/30"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <span className="font-medium text-[#34365C]">{student.name}</span>
      </td>

      <td className="hidden md:table-cell text-[#505485]">{student.school}</td>
      <td className="hidden lg:table-cell text-[#505485]">{student.age}</td>
      <td className="hidden lg:table-cell text-[#505485]">{student.sex}</td>

      <td>
        <Link
          href={`/students/${student.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg hover:shadow-lg transition-all text-xs font-medium"
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
        <div>
          <h1 className="text-2xl font-bold text-[#34365C]">Students</h1>
          <p className="text-sm text-[#505485] mt-1">Manage and view all students</p>
        </div>
        <TableSearch />
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] p-4 rounded-xl border-2 border-[#8387CC]/20">
          <p className="text-xs text-[#505485] font-medium">Total Students</p>
          <p className="text-2xl font-bold text-[#34365C] mt-1">{filteredStudents.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#8387CC]/20 to-[#F8F8FF] p-4 rounded-xl border-2 border-[#8387CC]/20">
          <p className="text-xs text-[#505485] font-medium">Active</p>
          <p className="text-2xl font-bold text-[#34365C] mt-1">{filteredStudents.length}</p>
        </div>
        <div className="bg-gradient-to-br from-[#4169E1]/20 to-[#F8F8FF] p-4 rounded-xl border-2 border-[#8387CC]/20">
          <p className="text-xs text-[#505485] font-medium">Schools</p>
          <p className="text-2xl font-bold text-[#34365C] mt-1">{new Set(filteredStudents.map(s => s.school)).size}</p>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl overflow-hidden border-2 border-[#DCD0FF]/50">
        <Table
          columns={columns}
          data={filteredStudents}
          renderRow={renderRow}
        />
      </div>
    </div>
  );
};

export default StudentListPage;
