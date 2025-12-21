

// import Pagination from "../../_components/Pagination";
// import Table from "../../_components/Table";
// import TableSearch from "../../_components/TableSearch";
// import Image from "next/image";
// import Link from "next/link";
// import { Teachers } from "../../_data/data";
// import { Teacher } from "../../_types/type";

// const ITEM_PER_PAGE = 5;
// const SCHOOL_NAME = "Dudley Senanayaka Vidyalaya";

// const TeacherListPage = ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
//   const columns = [
//     { header: "Info", accessor: "info" },
//     { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
//     { header: "School", accessor: "school", className: "hidden md:table-cell" },
//     { header: "Gender", accessor: "sex", className: "hidden lg:table-cell" },
//     { header: "Actions", accessor: "action" },
//   ];

//   const renderRow = (item: Teacher) => (
//     <tr 
//       key={item.id} 
//       className="border-b border-[#DCD0FF]/30 text-sm hover:bg-gradient-to-r hover:from-[#F8F8FF] hover:to-[#DCD0FF]/30 transition-all"
//     >
//       {/* INFO */}
//       <td className="py-4 px-6">
//         <div className="flex items-center gap-4">
//           <Image
//             src={item.photoUrl || "/noAvatar.png"}
//             alt={item.name}
//             width={40}
//             height={40}
//             className="rounded-full ring-2 ring-[#8387CC]/30"
//           />
//           <div className="flex flex-col">
//             <h3 className="font-semibold text-[#34365C]">{item.name}</h3>
//             <p className="text-xs text-[#505485]">{item.email}</p>
//           </div>
//         </div>
//       </td>

//       {/* ID */}
//       <td className="hidden md:table-cell text-[#505485] py-4 px-6 text-center">
//         <span className="inline-block min-w-[3ch]">{item.id}</span>
//       </td>

//       {/* SCHOOL */}
//       <td className="hidden md:table-cell text-[#505485] py-4 px-6">{item.school}</td>

//       {/* GENDER */}
//       <td className="hidden lg:table-cell text-[#505485] py-4 px-6">
//         <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
//           item.sex === 'MALE' 
//             ? 'bg-blue-100 text-blue-700' 
//             : 'bg-pink-100 text-pink-700'
//         }`}>
//           {item.sex}
//         </span>
//       </td>

//       {/* ACTIONS */}
//       <td className="py-4 px-6">
//         <Link
//           href={`/teachers/${item.id}`}
//           className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white rounded-lg text-xs font-medium hover:shadow-md transition-all"
//         >
//           View Profile
//         </Link>
//       </td>
//     </tr>
//   );

//   // ---------------- FILTER + SEARCH + PAGINATION ----------------
//   const page = searchParams?.page ? parseInt(searchParams.page) : 1;
//   const search = searchParams?.search || "";

//   // Filter by school
//   let filteredData = Teachers.filter((t) => t.school === SCHOOL_NAME);

//   // Search by name
//   if (search) {
//     filteredData = filteredData.filter((t) =>
//       t.name.toLowerCase().includes(search.toLowerCase())
//     );
//   }

//   const count = filteredData.length;

//   // Pagination
//   const data = filteredData.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);

//   return (
//     <div className="bg-gradient-to-br from-white to-[#F8F8FF] p-6 rounded-2xl shadow-lg border-2 border-[#DCD0FF]/50">
//       {/* TOP BAR */}
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-[#34365C]">
//           Teachers – {SCHOOL_NAME}
//         </h1>
//         <TableSearch />
//       </div>

//       {/* TABLE */}
//       <div className="bg-white rounded-xl overflow-hidden border-2 border-[#DCD0FF]/50 shadow-sm">
//         <Table columns={columns} renderRow={renderRow} data={data} />
//       </div>

//       {/* PAGINATION */}
//       <Pagination page={page} count={count} />
//     </div>
//   );
// };

// export default TeacherListPage;


"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Table from "../../_components/Table";
import TableSearch from "../../_components/TableSearch";
import Pagination from "../../_components/Pagination";
import { Teachers } from "../../_data/data";
import { Teacher } from "../../_types/type";

const ITEM_PER_PAGE = 10;
const SCHOOL_NAME = "Dudley Senanayaka Vidyalaya";

const TeacherListPage = () => {
  const searchParams = useSearchParams();
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page") as string)
    : 1;
  const search = searchParams.get("search")?.toLowerCase() || "";

  // ------------- FILTER BY SCHOOL -------------
  let filteredTeachers = Teachers.filter(
    (teacher) => teacher.school === SCHOOL_NAME
  );

  // ------------- SEARCH -------------
  if (search) {
    filteredTeachers = filteredTeachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(search) ||
        teacher.email.toLowerCase().includes(search)
    );
  }

  const count = filteredTeachers.length;

  // ------------- PAGINATION -------------
  const data = filteredTeachers.slice(
    ITEM_PER_PAGE * (page - 1),
    ITEM_PER_PAGE * page
  );

  const columns = [
    { header: "Teacher", accessor: "name" },
    { header: "School", accessor: "school", className: "hidden md:table-cell" },
    { header: "Teacher ID", accessor: "id", className: "hidden lg:table-cell" },
    { header: "Gender", accessor: "sex", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (teacher: Teacher) => (
    <tr
      key={teacher.id}
      className="border-b border-[#DCD0FF]/30 text-sm hover:bg-gradient-to-r hover:from-[#F8F8FF] hover:to-[#DCD0FF]/30 transition-all"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <Image
            src={teacher.photoUrl || "/noAvatar.png"}
            alt={teacher.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-[#8387CC]/30"
          />
          <span className="font-medium text-[#34365C]">{teacher.name}</span>
        </div>
      </td>

      <td className="hidden md:table-cell text-[#505485] py-4 px-6">
        {teacher.school}
      </td>

      <td className="hidden lg:table-cell text-[#505485] py-4 px-6 text-center">
        {teacher.id}
      </td>

      <td className="hidden lg:table-cell text-[#505485] py-4 px-6">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
            teacher.sex === "MALE"
              ? "bg-blue-100 text-blue-700"
              : "bg-pink-100 text-pink-700"
          }`}
        >
          {teacher.sex}
        </span>
      </td>

      <td className="py-4 px-6">
        <Link
          href={`/teachers/${teacher.id}`}
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
          Teachers – {SCHOOL_NAME}
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

export default TeacherListPage;
