"use client";
import Image from "next/image";
import Link from "next/link";
import { Students, Teachers } from "@/app/dashboard/_data/data";
import { Events } from "@/app/events/_data/events";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const EventsAnalytics = () => {
  // Calculate statistics for each event
  const eventStats = Events.map((event) => {
    const studentParticipants = Students.filter((student) =>
      student.registeredEvents?.some(
        (registration) => Number(registration.eventId) === event.id
      )
    );

    const teacherParticipants = Teachers.filter((teacher) =>
      teacher.registeredEvents?.some(
        (registration) => Number(registration.eventId) === event.id
      )
    );

    const participatingSchools = [
      ...new Set([
        ...studentParticipants.map((s) => s.school),
        ...teacherParticipants.map((t) => t.school),
      ]),
    ];

    return {
      id: event.id,
      title: event.title,
      date: event.date,
      students: studentParticipants.length,
      teachers: teacherParticipants.length,
      total: studentParticipants.length + teacherParticipants.length,
      schools: participatingSchools.length,
    };
  });

  // Overall statistics
  const totalEvents = Events.length;
  const totalStudentParticipations = eventStats.reduce((sum, e) => sum + e.students, 0);
  const totalTeacherParticipations = eventStats.reduce((sum, e) => sum + e.teachers, 0);
  const totalParticipations = totalStudentParticipations + totalTeacherParticipations;

  // Get all unique schools
  const allSchools = [...new Set(Events.map((e) => e.school))];

  // Data for bar chart - top 5 events by participation
  const topEvents = [...eventStats]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((event) => ({
      name: event.title.length > 15 ? event.title.substring(0, 15) + "..." : event.title,
      Students: event.students,
      Teachers: event.teachers,
    }));

  // Data for pie chart - participation type
  const participationTypeData = [
    { name: "Students", value: totalStudentParticipations },
    { name: "Teachers", value: totalTeacherParticipations },
  ];

  // Updated color scheme using brand colors
  const COLORS = ["#8387CC", "#4169E1"];

  // Events by month
  const eventsByMonth = Events.reduce((acc, event) => {
    const month = new Date(event.date).toLocaleString("default", { month: "short" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const monthlyData = Object.entries(eventsByMonth).map(([month, count]) => ({
    month,
    events: count,
  }));

  return (
    <div className="p-6 bg-gradient-to-br from-[#F8F8FF] via-[#DCD0FF]/20 to-[#F8F8FF] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#34365C]">Events Analytics</h1>
          <p className="text-gray-600 text-base mt-2">
            Overall performance and participation metrics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Events */}
          <div className="rounded-2xl bg-gradient-to-br from-[#8387CC] to-[#4169E1] p-6 shadow-xl hover:shadow-2xl transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs bg-white/95 px-3 py-1.5 rounded-full text-[#4169E1] font-semibold">
                Total
              </span>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              {totalEvents}
            </h1>
            <h2 className="text-base font-medium text-white/95">
              Events
            </h2>
          </div>

          {/* Total Participations */}
          <div className="rounded-2xl bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-[#8387CC]/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs bg-[#8387CC] text-white px-3 py-1.5 rounded-full font-semibold">
                All
              </span>
              <svg className="w-6 h-6 text-[#8387CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#34365C]">
              {totalParticipations}
            </h1>
            <h2 className="text-base font-medium text-[#34365C]/80">
              Participations
            </h2>
          </div>

          {/* Student Participations */}
          <div className="rounded-2xl bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-[#8387CC]/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs bg-[#8387CC] text-white px-3 py-1.5 rounded-full font-semibold">
                Students
              </span>
              <svg className="w-6 h-6 text-[#8387CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#34365C]">
              {totalStudentParticipations}
            </h1>
            <h2 className="text-base font-medium text-[#34365C]/80">
              Students
            </h2>
          </div>

          {/* Teacher Participations */}
          <div className="rounded-2xl bg-gradient-to-br from-[#DCD0FF] to-[#F8F8FF] p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-[#8387CC]/20">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs bg-[#4169E1] text-white px-3 py-1.5 rounded-full font-semibold">
                Teachers
              </span>
              <svg className="w-6 h-6 text-[#4169E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-[#34365C]">
              {totalTeacherParticipations}
            </h1>
            <h2 className="text-base font-medium text-[#34365C]/80">
              Teachers
            </h2>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Events Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-[#DCD0FF]/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#34365C]">Top 5 Events by Participation</h2>
              <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topEvents}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#DCD0FF" />
                <XAxis dataKey="name" tick={{ fill: "#34365C", fontSize: 12 }} />
                <YAxis tick={{ fill: "#34365C" }} />
                <Tooltip
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "1px solid #DCD0FF",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                  }}
                />
                <Legend />
                <Bar dataKey="Students" fill="#8387CC" radius={[8, 8, 0, 0]} />
                <Bar dataKey="Teachers" fill="#4169E1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Participation Type Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-[#DCD0FF]/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#34365C]">Participation by Type</h2>
              <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={participationTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {participationTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: "12px", 
                    border: "1px solid #DCD0FF",
                    backgroundColor: "white",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Events List with Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#DCD0FF]/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#34365C]">All Events Overview</h2>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#DCD0FF]">
                  <th className="text-left py-4 px-4 text-sm font-bold text-[#34365C]">Event</th>
                  <th className="text-left py-4 px-4 text-sm font-bold text-[#34365C]">Date</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-[#34365C]">Students</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-[#34365C]">Teachers</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-[#34365C]">Schools</th>
                  <th className="text-center py-4 px-4 text-sm font-bold text-[#34365C]">Total</th>
                </tr>
              </thead>
              <tbody>
                {eventStats.map((event) => (
                  <tr key={event.id} className="border-b border-[#DCD0FF]/30 hover:bg-[#F8F8FF] transition-colors">
                    <td className="py-4 px-4 text-sm font-medium text-[#34365C]">{event.title}</td>
                    <td className="py-4 px-4 text-sm text-[#34365C]/70">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-sm text-center">
                      <span className="bg-[#DCD0FF] text-[#8387CC] px-3 py-1.5 rounded-full text-xs font-bold">
                        {event.students}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-center">
                      <span className="bg-[#DCD0FF] text-[#4169E1] px-3 py-1.5 rounded-full text-xs font-bold">
                        {event.teachers}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-center">
                      <span className="bg-[#DCD0FF] text-[#505485] px-3 py-1.5 rounded-full text-xs font-bold">
                        {event.schools}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-center font-bold text-[#34365C]">
                      {event.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsAnalytics;