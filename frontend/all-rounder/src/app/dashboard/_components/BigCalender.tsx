
"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

interface EventType {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  timeLabel?: string;
  location?: string;
}

interface BigCalendarProps {
  data: EventType[];
}

const BigCalendar: React.FC<BigCalendarProps> = ({ data }) => {
  const [view, setView] = useState<View>(Views.MONTH); // default view

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <div className="h-full">
      <Calendar
        localizer={localizer}
        events={data}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={handleOnChangeView}
        views={["month", "week", "day"]} // month view added
        style={{ height: 600 }}
        components={{
          event: ({ event }) => (
            <div
              title={`Time: ${event.timeLabel || "N/A"}\nLocation: ${event.location || "N/A"}`}
              className="text-sm"
            >
              <strong>{event.title}</strong>
              <div style={{ fontSize: "0.75em" }}>
                {event.timeLabel ? `Time: ${event.timeLabel}` : ""}
                {event.location ? ` | Location: ${event.location}` : ""}
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default BigCalendar;
