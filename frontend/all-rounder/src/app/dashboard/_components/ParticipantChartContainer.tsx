"use client";

import Image from "next/image";
import ParticipantsChart from "./ParticipantChart";
import { useStudentStore } from "@/context/useStudentStore";
import { useEventStore } from "@/context/useEventStore";

const ParticipantsChartContainer = () => {
  const { students } = useStudentStore();
  const { events } = useEventStore();
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Count participants per day
  const data = daysOfWeek.map((day) => {
    // Note: registeredEvents was removed from schema, so participation counts are set to 0
    let participantsCount = 0;

    return {
      day,
      participants: participantsCount,
    };
  });

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-semibold">Weekly Participation</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      <ParticipantsChart data={data} />
    </div>
  );
};

export default ParticipantsChartContainer;
