import { Students, Teachers } from "../_data/data";
import { Events } from "@/app/events/_data/events";
import UserCard from "../_components/UserCard";
import CountChartContainer from "../_components/CountChartContainer";
import BigCalendarContainer from "../_components/BigCalendarContainer";
import { EventList } from "@/app/events/_components/EventList";

const SchoolDashboard = () => {
  const schoolName = "Ananda College";
  const schoolStudents = Students.filter((s) => s.school === schoolName);
  const schoolTeachers = Teachers.filter((t) => t.school === schoolName);
  const schoolEvents = Events.filter((e) => e.school === schoolName);

  return (
    <div className="min-h-screen bg-[#F8F8FF] p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <UserCard type="student" />
          <UserCard type="teacher" />
          
          {/* Events Card */}
          <div className="rounded-2xl bg-[#DCD0FF] p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
                2024/25
              </span>
              <svg className="w-5 h-5 text-[#505485]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5"/>
                <circle cx="12" cy="12" r="1.5"/>
                <circle cx="12" cy="19" r="1.5"/>
              </svg>
            </div>
            <h1 className="text-2xl font-semibold my-4 text-[#34365C]">
              {schoolEvents.length}
            </h1>
            <h2 className="capitalize text-sm font-medium text-[#505485]">
              Events
            </h2>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Students Chart */}
          <div className="lg:col-span-1">
            <CountChartContainer />
          </div>

          {/* Right Column - Calendar and Events */}
          <div className="lg:col-span-2 space-y-6">
            <BigCalendarContainer school={schoolName} />
            <EventList events={schoolEvents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolDashboard;

