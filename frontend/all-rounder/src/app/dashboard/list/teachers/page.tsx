
import Pagination from "../../_components/Pagination";
import Table from "../../_components/Table";
import TableSearch from "../../_components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import { Teachers } from "../../_data/data";
import { Teacher } from "../../_types/type"; // import your existing data

const ITEM_PER_PAGE = 5; // define in-file
const SCHOOL_NAME = "Ananda College";

const TeacherListPage = ({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) => {
  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Teacher ID", accessor: "teacherId", className: "hidden md:table-cell" },
    { header: "School", accessor: "school", className: "hidden md:table-cell" },
    { header: "Gender", accessor: "sex", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
  ];

  const renderRow = (item: Teacher) => (
    <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      {/* INFO */}
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photoUrl || "/noAvatar.png"}
          alt={item.name}
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>

      {/* ID */}
      <td className="hidden md:table-cell">{item.id}</td>

      {/* SCHOOL */}
      <td className="hidden md:table-cell">{item.school}</td>

      {/* GENDER */}
      <td className="hidden lg:table-cell">{item.sex}</td>

      {/* ACTIONS */}
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
        
        </div>
      </td>
    </tr>
  );

  // ---------------- FILTER + SEARCH + PAGINATION ----------------
  const page = searchParams?.page ? parseInt(searchParams.page) : 1;
  const search = searchParams?.search || "";

  // Filter by school
  let filteredData = Teachers.filter((t) => t.school === SCHOOL_NAME);

  // Search by name
  if (search) {
    filteredData = filteredData.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  const count = filteredData.length;

  // Pagination
  const data = filteredData.slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Teachers – {SCHOOL_NAME}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
         
          </div>
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={page} count={count}/>
    </div>
  );
};

export default TeacherListPage;
