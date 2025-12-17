"use client";

import React from "react";
import BigCalendar from "./BigCalender";
import { Events } from "@/app/events/_data/events";

interface BigCalendarContainerProps {
  school: string; // school name to filter events
}

const BigCalendarContainer: React.FC<BigCalendarContainerProps> = ({ school }) => {
  // Filter events for the given school
  const calendarEvents = Events.filter(event => event.school === school).map(event => ({
    title: event.title,
    start: new Date(event.date),
    end: new Date(event.date), 
  }));
  
  
  return (
    <div className="h-[700px] p-4 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">{school} Events</h2>
      <BigCalendar data={calendarEvents} />
    </div>
  );
};

export default BigCalendarContainer;
