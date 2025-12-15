"use client";

"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid,Tooltip, ResponsiveContainer,} from "recharts";

const ParticipantsChart = ({
  data,
}: {
  data: { day: string; participants: number }[];
}) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
        <XAxis dataKey="day" axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
        <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
        />
        <Line
          type="monotone"
          dataKey="participants"
          stroke="#4169E1"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ParticipantsChart;
