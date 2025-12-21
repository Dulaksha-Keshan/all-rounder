// "use client";
// import Image from "next/image";
// import CountChart from "./CountChart";
// import { Students } from "@/app/_data/data";

// const CountChartContainer = () => {
//   // Count boys and girls from the static data
//   const boys = Students.filter((s) => s.sex === "MALE").length;
//   const girls = Students.filter((s) => s.sex === "FEMALE").length;

//   return (
//     <div className="bg-white rounded-xl w-full h-[500px] p-4">
//       {/* TITLE */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-lg font-semibold">Students</h1>
//         <Image src='/images/maleFemale.webp' alt="Male Female" width={20} height={20} />

//       </div>

//       {/* CHART */}
//       <CountChart boys={boys} girls={girls} />

//       {/* BOTTOM */}
//       <div className="flex justify-center gap-16 mt-4">
//         <div className="flex flex-col gap-1 items-center">
//           <div className="w-5 h-5 bg-blue-500 rounded-full" /> {/* Male blue */}
//           <h1 className="font-bold">{boys}</h1>
//           <h2 className="text-xs text-gray-500">
//             Boys ({Math.round((boys / (boys + girls)) * 100)}%)
//           </h2>
//         </div>
//         <div className="flex flex-col gap-1 items-center">
//           <div className="w-5 h-5 bg-purple-500 rounded-full" /> {/* Female purple */}
//           <h1 className="font-bold">{girls}</h1>
//           <h2 className="text-xs text-gray-500">
//             Girls ({Math.round((girls / (boys + girls)) * 100)}%)
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CountChartContainer;


"use client";
import Image from "next/image";
import CountChart from "./CountChart";
import { Students } from "@/app/_data/data";

interface CountChartContainerProps {
  schoolId?: string;
  orgId?: string;
}

const CountChartContainer = ({ schoolId, orgId }: CountChartContainerProps) => {
  // Filter students based on schoolId or orgId
  let filteredStudents = Students;

  if (schoolId) {
    filteredStudents = Students.filter((s) => s.schoolId === schoolId);
  } else if (orgId) {
    filteredStudents = Students.filter((s) => s.organizationId === orgId);
  }

  // Count boys and girls from the filtered data
  const boys = filteredStudents.filter((s) => s.sex === "MALE").length;
  const girls = filteredStudents.filter((s) => s.sex === "FEMALE").length;
  const total = boys + girls;

  return (
    <div className="bg-white rounded-xl w-full h-[500px] p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src='/images/maleFemale.webp' alt="Male Female" width={20} height={20} />
      </div>

      {/* CHART */}
      {total > 0 ? (
        <>
          <CountChart boys={boys} girls={girls} />

          {/* BOTTOM */}
          <div className="flex justify-center gap-16 mt-4">
            <div className="flex flex-col gap-1 items-center">
              <div className="w-5 h-5 bg-blue-500 rounded-full" />
              <h1 className="font-bold">{boys}</h1>
              <h2 className="text-xs text-gray-500">
                Boys ({Math.round((boys / total) * 100)}%)
              </h2>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <div className="w-5 h-5 bg-purple-500 rounded-full" />
              <h1 className="font-bold">{girls}</h1>
              <h2 className="text-xs text-gray-500">
                Girls ({Math.round((girls / total) * 100)}%)
              </h2>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[400px] text-gray-400">
          No student data available
        </div>
      )}
    </div>
  );
};

export default CountChartContainer;

