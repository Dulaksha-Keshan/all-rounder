"use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Teachers } from "@/app/dashboard/_data/data";

// const SCHOOL_NAME = "Ananda College";

// const TeachersPage = () => {
//   const filteredTeachers = Teachers.filter(
//     (teacher) => teacher.school === SCHOOL_NAME
//   );

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold mb-4">
//         Teachers – {SCHOOL_NAME}
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
//         {filteredTeachers.map((teacher) => (
//           <Link
//             key={teacher.id}
//             href={`/teachers/${teacher.id}`}
//             className="bg-white p-4 rounded-md flex gap-4 hover:shadow-md transition"
//           >
//             <Image
//               src={teacher.photoUrl || "/noAvatar.png"}
//               alt={teacher.name}
//               width={80}
//               height={80}
//               className="w-20 h-20 rounded-full object-cover"
//             />

//             <div className="flex flex-col justify-center">
//               <h2 className="font-semibold text-lg">{teacher.name}</h2>
//               <p className="text-sm text-gray-500">{teacher.email}</p>
//               <span className="text-xs text-gray-400">
//                 {teacher.sex}
//               </span>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TeachersPage;

"use client";

import Image from "next/image";
import Link from "next/link";
import { Teachers } from "@/app/dashboard/_data/data";

const SCHOOL_NAME = "Ananda College";

const TeachersPage = () => {
  const filteredTeachers = Teachers.filter(
    (teacher) => teacher.school === SCHOOL_NAME
  );

  return (
    <div className="flex-1 p-4">
      {/* HEADER */}
      <div className="bg-gradient-to-br from-[#8387CC] to-[#4169E1] p-6 rounded-2xl shadow-xl mb-6">
        <h1 className="text-3xl font-bold text-white">
          Teachers – {SCHOOL_NAME}
        </h1>
        <p className="text-white/80 mt-2">
          {filteredTeachers.length} {filteredTeachers.length === 1 ? 'Teacher' : 'Teachers'}
        </p>
      </div>

      {/* TEACHERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTeachers.map((teacher) => (
          <Link
            key={teacher.id}
            href={`/teachers/${teacher.id}`}
            className="bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] p-6 rounded-2xl flex gap-4 hover:shadow-xl transition-all border-2 border-[#8387CC]/20 hover:border-[#8387CC]/40 group"
          >
            <div className="relative flex-shrink-0">
              <Image
                src={teacher.photoUrl || "/noAvatar.png"}
                alt={teacher.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-white/50 group-hover:ring-[#8387CC]/30 transition-all"
              />
              <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#8387CC] to-[#4169E1] text-white px-2 py-0.5 rounded-full text-xs font-bold shadow-lg">
                #{teacher.id}
              </div>
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <h2 className="font-bold text-lg text-[#34365C] mb-1 truncate">
                {teacher.name}
              </h2>
              <p className="text-sm text-[#505485] mb-1 truncate">
                {teacher.email}
              </p>
              <span className="text-xs text-[#8387CC] font-medium">
                {teacher.sex}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredTeachers.length === 0 && (
        <div className="bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] p-12 rounded-2xl text-center border-2 border-[#8387CC]/20">
          <p className="text-[#34365C] font-semibold text-lg">
            No teachers found for {SCHOOL_NAME}
          </p>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
