

"use client";

import Image from "next/image";
import { Students, Teachers } from "../_data/data";

interface UserCardProps {
  type: "teacher" | "student";
  school?: string; // optional school filter
}

const UserCard = ({ type, school }: UserCardProps) => {
  // Count users based on type and school
  let count = 0;

  if (type === "student") {
    count = school
      ? Students.filter((s) => s.school === school).length
      : Students.length;
  }

  if (type === "teacher") {
    count = school
      ? Teachers.filter((t) => t.school === school).length
      : Teachers.length;
  }

  // Card background
  const bgColor = type === "student" ? "bg-[#DCD0FF]" : "bg-[#8387CC]";

  return (
    <div className={`rounded-2xl ${bgColor} p-4 flex-1 min-w-[130px]`}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
          2024/25
        </span>
        <Image
          src={
            type === "student"
              ? "/images/Dashboard/student.png"
              : "/images/Dashboard/teacher.png"
          }
          alt={type}
          width={20}
          height={20}
        />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count}</h1>
      <h2 className="capitalize text-lg font-medium text-white">{type}s</h2>
    </div>
  );
};

export default UserCard;
