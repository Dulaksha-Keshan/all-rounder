import UserCard from "../_components/UserCard";
import CountChartContainer from "../_components/CountChartContainer";
import BigCalendarContainer from "../_components/BigCalendarContainer";
import { EventList } from "@/app/events/_components/EventList";
import Menu from "../_components/Menu";
import Image from "next/image";

const OrganizationDashboard = () => {
  const organizationName = "IEEE Sri Lanka Section";
  
  // Mock data for the organization
  const mockEvents = [
    { 
      id: 1, 
      title: "Inter-School Sports Meet", 
      date: "2024-12-22",
      school: "All Schools",
      type: "Sports"
    },
    { 
      id: 2, 
      title: "Annual Education Conference", 
      date: "2024-12-28",
      school: organizationName,
      type: "Conference"
    },
    { 
      id: 3, 
      title: "Teacher Training Workshop", 
      date: "2025-01-05",
      school: organizationName,
      type: "Workshop"
    },
  ];

  return (
    <div className="h-screen flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-gradient-to-b from-[#34365C] to-[#4169E1] p-4 shadow-xl">
        <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="brightness-0 invert" />
          <span className="hidden lg:block font-bold text-white">All-Rounder</span>
        </div>
        <Menu />
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gradient-to-br from-[#F8F8FF] via-[#DCD0FF]/20 to-[#F8F8FF] overflow-scroll">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{organizationName}</h1>
              <p className="text-gray-600 text-sm mt-1">Organization Dashboard Overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <UserCard type="student" />
              <UserCard type="teacher" />

              {/* Events Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#8387CC] to-[#4169E1] p-4 flex-1 min-w-[130px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-white/90 px-2 py-1 rounded-full text-[#4169E1] font-semibold">
                    2024/25
                  </span>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="19" r="1.5"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold my-4 text-white">
                  {mockEvents.length}
                </h1>
                <h2 className="capitalize text-sm font-medium text-white/90">
                  Events
                </h2>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Stats Chart */}
              <div className="lg:col-span-1">
                <CountChartContainer />
              </div>

              {/* Right Column - Calendar and Events */}
              <div className="lg:col-span-2 space-y-6">
                <BigCalendarContainer school={organizationName} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;