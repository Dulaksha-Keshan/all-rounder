"use client";

import Image from "next/image";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

const data = [
  { name: "Achieved", value: 68, fill: "#4169E1" }, // blue
  { name: "Remaining", value: 32, fill: "#8387CC" }, // purple
];

const Performance = () => {
  return (
    <div className="bg-white p-4 rounded-md h-80 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Performance</h1>
        <Image src="/moreDark.png" alt="" width={16} height={16} />
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            cx="50%"
            cy="55%"
            innerRadius={70}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold text-[#34365C]">68%</h1>
        <p className="text-xs text-gray-400">Engagement Score</p>
      </div>

      {/* Footer */}
      <h2 className="font-medium absolute bottom-16 left-0 right-0 text-center text-gray-600">
        Jan 2025 – Jun 2025
      </h2>
    </div>
  );
};

export default Performance;
