// import BigCalendar from "./BigCalender";
// import { Events } from "@/app/events/_data/events";

// interface BigCalendarContainerProps {
//   schoolId: string;  // ← Changed from 'school' to 'schoolId'
// }

// const BigCalendarContainer = async ({ schoolId }: BigCalendarContainerProps) => {
//   // Filter events where organizerId matches schoolId and organizerType is "School"
//   const filteredEvents = Events.filter(
//     (event) => event.organizerId === schoolId && event.organizerType === "School"
//   );

//   const data = filteredEvents.map((event) => ({
//     title: event.title,
//     start: new Date(event.date),
//     end: new Date(event.date),
//     time: event.time,
//     location: event.location,
//   }));

//   return (
//     <div className="h-[700px] p-4 bg-white rounded-md shadow">
//       <h2 className="text-xl font-semibold mb-4">School Events</h2>
//       <BigCalendar data={data} />
//     </div>
//   );
// };

// export default BigCalendarContainer;

import BigCalendar from "./BigCalender";
import { Events } from "@/app/events/_data/events";

interface BigCalendarContainerProps {
  schoolId?: string;
  organizerId?: string;
  type?: "School" | "Organization";
}

const BigCalendarContainer = async ({ 
  schoolId, 
  organizerId, 
  type = "School" 
}: BigCalendarContainerProps) => {
  // Determine which ID to use
  const id = schoolId || organizerId;
  
  // Filter events based on type
  const filteredEvents = Events.filter((event) => {
    if (!id) return false;
    return event.organizerId === id && event.organizerType === type;
  });

  const data = filteredEvents.map((event) => ({
    title: event.title,
    start: new Date(event.date),
    end: new Date(event.date),
    time: event.time,
    location: event.location,
  }));

  // Dynamic title based on type
  const title = type === "School" ? "School Events" : "Organization Events";

  return (
    <div className="h-[700px] p-4 bg-white rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <BigCalendar data={data} />
    </div>
  );
};

export default BigCalendarContainer;