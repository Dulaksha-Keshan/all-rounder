
import { Students, Teachers, Schools } from "@/app/_data/data";
import { Events } from "@/app/events/_data/events";
import UserCard from "@/app/dashboard/_components/UserCard";
import CountChartContainer from "@/app/dashboard/_components/CountChartContainer";
import BigCalendarContainer from "@/app/dashboard/_components/BigCalendarContainer";
import Menu from "@/app/dashboard/_components/Menu";
import Image from "next/image";
import { notFound } from "next/navigation";


interface SchoolDashboardProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export default async function SchoolDashboard({ params }: SchoolDashboardProps) {
  const { schoolId } = await params;

  // Find the school to get its name
  const school = Schools.find((s) => s.id === schoolId);
  
  // If school not found, show 404
  if (!school) {
    notFound();
  }

  // Filter data by schoolId
  const schoolStudents = Students.filter((s) => s.schoolId === schoolId);
  const schoolTeachers = Teachers.filter((t) => t.schoolId === schoolId);
  const schoolEvents = Events.filter(
    (e) => e.organizerId === schoolId && e.organizerType === "School"
  );

  return (

    <div className="h-screen flex">
      {/* LEFT SIDEBAR */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] bg-gradient-to-b from-[var(--primary-dark-purple)] to-[var(--primary-blue)] p-4 shadow-xl">
        {/* <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className="brightness-0 invert" 
          />
          <span className="hidden lg:block font-bold text-[var(--white)]">All-Rounder</span>
        </div> */}
        <Menu schoolId={schoolId} />
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gradient-to-br from-[var(--secondary-pale-lavender)] via-[var(--secondary-light-lavender)]/20 to-[var(--secondary-pale-lavender)] overflow-scroll">
        <div className="p-6">
          <div className="max-w-[1400px] mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-[var(--primary-dark-purple)]">{school.name}</h1>
              <p className="text-gray-600">{school.location}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <UserCard type="student" schoolId={schoolId} />
              <UserCard type="teacher" schoolId={schoolId} />
              
              {/* Events Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[var(--primary-purple)] to-[var(--primary-blue)] p-4 flex-1 min-w-[130px] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-[var(--white)]/90 px-2 py-1 rounded-full text-[var(--primary-blue)] font-semibold">
                    2024/25
                  </span>
                  <svg className="w-5 h-5 text-[var(--white)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="5" r="1.5"/>
                    <circle cx="12" cy="12" r="1.5"/>
                    <circle cx="12" cy="19" r="1.5"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-semibold my-4 text-[var(--white)]">
                  {schoolEvents.length}
                </h1>
                <h2 className="capitalize text-sm font-medium text-[var(--white)]/90">
                  Events
                </h2>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Students Chart */}
              <div className="lg:col-span-1">
                <CountChartContainer schoolId={schoolId}/>
              </div>

              {/* Right Column - Calendar and Events */}
              <div className="lg:col-span-2 space-y-6">
                <BigCalendarContainer schoolId={schoolId} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
    
  );
}