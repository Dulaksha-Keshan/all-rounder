// "use client";

// import React, { useState } from "react";
// import { Calendar, Views, View, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// interface BigCalendarProps {
//   data: { title: string; start: Date; end: Date }[];
// }

// const localizer = momentLocalizer(moment);

// const BigCalendar: React.FC<BigCalendarProps> = ({ data }) => {
//   const [view, setView] = useState<View>(Views.WEEK);

//   const handleOnChangeView = (selectedView: View) => {
//     setView(selectedView);
//   };

//   return (
//     <div className="h-full">
//       <Calendar
//         localizer={localizer}
//         events={data}
//         startAccessor="start"
//         endAccessor="end"
//         view={view}
//         onView={handleOnChangeView}
//         views={["month", "week", "day"]}
//         style={{ height: 600 }}
//       />
//     </div>
//   );
// };

// export default BigCalendar;


"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";

const localizer = momentLocalizer(moment);

interface EventType {
  title: string;
  start: Date;
  end: Date;
  time?: string;
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
              title={`Time: ${event.time || "N/A"}\nLocation: ${event.location || "N/A"}`}
              className="text-sm"
            >
              <strong>{event.title}</strong>
              <div style={{ fontSize: "0.75em" }}>
                {event.time ? `Time: ${event.time}` : ""}
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
