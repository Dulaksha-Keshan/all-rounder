"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import ParticipantsChartContainer from "@/app/dashboard/_components/ParticipantChartContainer";
import { Students, Teachers } from "@/app/dashboard/_data/data";
import { Events } from "@/app/events/_data/events";

const EventAnalytics = () => {
  const params = useParams();
  const eventId = Number(params.id);
  
  // Find the event
  const event = Events.find((e) => e.id === eventId);
  
  if (!event) {
    return <div className="p-6">Event not found</div>;
  }

  // Get participants (students and teachers)
  const studentParticipants = Students.filter((student) =>
    student.registeredEvents?.some(
      (registration) => Number(registration.eventId) === eventId
    )
  );

  const teacherParticipants = Teachers.filter((teacher) =>
    teacher.registeredEvents?.some(
      (registration) => Number(registration.eventId) === eventId
    )
  );

  // Get unique schools from participants
  const participatingSchools = [
    ...new Set([
      ...studentParticipants.map((s) => s.school),
      ...teacherParticipants.map((t) => t.school),
    ]),
  ];

  // Count participants by school
  const schoolStats = participatingSchools.map((school) => {
    const students = studentParticipants.filter((s) => s.school === school).length;
    const teachers = teacherParticipants.filter((t) => t.school === school).length;
    return {
      school,
      students,
      teachers,
      total: students + teachers,
    };
  });

  const totalParticipants = studentParticipants.length + teacherParticipants.length;

  return (
    <div className="p-6 bg-gradient-to-br from-[#F8F8FF] via-[#DCD0FF]/20 to-[#F8F8FF] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{event.title}</h1>
          <p className="text-gray-600 text-sm mt-1">
            Event Analytics • {new Date(event.date).toLocaleDateString()}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Total Participants */}
          <div className="rounded-2xl bg-gradient-to-br from-[#C3EBFA] to-[#4169E1]/30 p-4 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-white px-2 py-1 rounded-full text-[#4169E1] font-semibold">
                Total
              </span>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold my-4 text-gray-800">
              {totalParticipants}
            </h1>
            <h2 className="capitalize text-sm font-medium text-gray-600">
              Participants
            </h2>
          </div>

          {/* Students */}
          <div className="rounded-2xl bg-gradient-to-br from-[#FAE27C] to-[#FBBF24]/30 p-4 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-white px-2 py-1 rounded-full text-[#FBBF24] font-semibold">
                Students
              </span>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold my-4 text-gray-800">
              {studentParticipants.length}
            </h1>
            <h2 className="capitalize text-sm font-medium text-gray-600">
              Students
            </h2>
          </div>

          {/* Teachers */}
          <div className="rounded-2xl bg-gradient-to-br from-[#CFCEFF] to-[#8B5CF6]/30 p-4 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-white px-2 py-1 rounded-full text-[#8B5CF6] font-semibold">
                Teachers
              </span>
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold my-4 text-gray-800">
              {teacherParticipants.length}
            </h1>
            <h2 className="capitalize text-sm font-medium text-gray-600">
              Teachers
            </h2>
          </div>

          {/* Schools */}
          <div className="rounded-2xl bg-gradient-to-br from-[#8387CC] to-[#4169E1] p-4 shadow-lg">
            <div className="flex justify-between items-center">
              <span className="text-[10px] bg-white/90 px-2 py-1 rounded-full text-[#4169E1] font-semibold">
                Schools
              </span>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold my-4 text-white">
              {participatingSchools.length}
            </h1>
            <h2 className="capitalize text-sm font-medium text-white/90">
              Schools
            </h2>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Participation Chart */}
          <div className="lg:col-span-2">
            <ParticipantsChartContainer />
          </div>

          {/* Schools Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-4 h-full">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Schools Breakdown</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {schoolStats
                  .sort((a, b) => b.total - a.total)
                  .map((stat, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-sm text-gray-800 mb-2">
                        {stat.school}
                      </h3>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{stat.students} students</span>
                        <span>{stat.teachers} teachers</span>
                      </div>
                      <div className="mt-2 text-xs font-semibold text-[#4169E1]">
                        Total: {stat.total}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Participants */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Student Participants</h2>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {studentParticipants.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={student.photoUrl || "/noAvatar.png"}
                      alt={student.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.school}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {student.age}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Participants */}
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Teacher Participants</h2>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {teacherParticipants.map((teacher) => (
                <div
                  key={teacher.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={teacher.photoUrl || "/noAvatar.png"}
                      alt={teacher.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-sm">{teacher.name}</p>
                      <p className="text-xs text-gray-500">{teacher.school}</p>
                    </div>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;