"use client";

import Image from "next/image";
import ParticipantsChart from "./ParticipantChart";
import { Students } from "../_data/data"; // 
import { Events } from "@/app/events/_data/events";

const ParticipantsChartContainer = () => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Count participants per day
  const data = daysOfWeek.map((day) => {
    let participantsCount = 0;

    Students.forEach((student) => {
      if (student.registeredEvents?.some((eventId) => {
        const event = Events.find((e) => e.id === eventId);
        if (!event) return false;

        const eventDate = new Date(event.date);
        const eventDay = eventDate.getDay(); 
        const dayIndex = daysOfWeek.indexOf(day); 
        return eventDay === (dayIndex + 1) % 7; 
      })) {
        participantsCount += 1;
      }
    });

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
