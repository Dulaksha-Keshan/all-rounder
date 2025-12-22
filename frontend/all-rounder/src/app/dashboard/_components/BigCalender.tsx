"use client";

import React, { useState } from "react";
import { Calendar, Views, View, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

interface BigCalendarProps {
  data: { title: string; start: Date; end: Date }[];
}

const localizer = momentLocalizer(moment);

const BigCalendar: React.FC<BigCalendarProps> = ({ data }) => {
  const [view, setView] = useState<View>(Views.WEEK);

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
        views={["month", "week", "day"]}
        style={{ height: 600 }}
      />
    </div>
  );
};

export default BigCalendar;
