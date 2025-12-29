"use client";
import Image from "next/image";
import { Students, Teachers, Schools, Organizations } from "@/app/_data/data";
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

interface EventsAnalyticsProps {
  organizerId?: string;
  type: "School" | "Organization";
}

const EventsAnalytics = ({ organizerId, type }: EventsAnalyticsProps) => {
  // Get organizer name
  const getOrganizerName = () => {
    if (!organizerId) return null;
    
    if (type === "School") {
      const school = Schools.find((s) => s.id === organizerId);
      return school?.name || organizerId;
    } else {
      const org = Organizations.find((o) => o.id === organizerId);
      return org?.name || organizerId;
    }
  };

  const organizerName = getOrganizerName();

  // Filter events based on organizer ID and type
  const filteredEvents = Events.filter((event) => {
    if (organizerId) {
      return event.organizerId === organizerId && event.organizerType === type;
    }
    return true;
  });

  // Filter students based on school or organization ID
  const filteredStudents = Students.filter((student) => {
    if (!organizerId) return true;
    if (type === "School") {
      return student.schoolId === organizerId;
    } else {
      // For organizations, include ALL students (since any student can participate)
      return true;
    }
  });

  // Filter teachers based on school or organization ID
  const filteredTeachers = Teachers.filter((teacher) => {
    if (!organizerId) return true;
    if (type === "School") {
      return teacher.schoolId === organizerId;
    } else {
      // For organizations, include ALL teachers (since any teacher can participate)
      return true;
    }
  });

  // Calculate statistics for each event (using filtered data)
  const eventStats = filteredEvents.map((event) => {
    const studentParticipants = filteredStudents.filter((student) =>
      student.registeredEvents?.some(
        (registration) => Number(registration.eventId) === event.id
      )
    );

    const teacherParticipants = filteredTeachers.filter((teacher) =>
      teacher.registeredEvents?.some(
        (registration) => Number(registration.eventId) === event.id
      )
    );

    const participatingSchoolIds = [
      ...new Set([
        ...studentParticipants.map((s) => s.schoolId),
        ...teacherParticipants.map((t) => t.schoolId),
      ]),
    ];

    return {
      id: event.id,
      title: event.title,
      date: event.date,
      students: studentParticipants.length,
      teachers: teacherParticipants.length,
      total: studentParticipants.length + teacherParticipants.length,
      schools: participatingSchoolIds.length,
    };
  });

  // Overall statistics
  const totalStudentParticipations = eventStats.reduce((sum, e) => sum + e.students, 0);
  const totalTeacherParticipations = eventStats.reduce((sum, e) => sum + e.teachers, 0);
  const totalParticipations = totalStudentParticipations + totalTeacherParticipations;

  // Data for bar chart
  const topEvents = [...eventStats]
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map((event) => ({
      name: event.title.length > 15 ? event.title.substring(0, 15) + "..." : event.title,
      Students: event.students,
      Teachers: event.teachers,
    }));

  // Data for pie chart
  const participationTypeData = [
    { name: "Students", value: totalStudentParticipations },
    { name: "Teachers", value: totalTeacherParticipations },
  ];

  const COLORS = ["#8387CC", "#4169E1"];

  // Dynamic title
  const getTitle = () => {
    if (organizerId && organizerName) {
      return `${type} Analytics - ${organizerName}`;
    }
    return "Events Analytics - All Organizers";
  };

  return (
    <div className="p-6 bg-gradient-to-br from-[var(--secondary-pale-lavender)] via-[var(--secondary-light-lavender)]/20 to-[var(--secondary-pale-lavender)] min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--primary-dark-purple)]">{getTitle()}</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-[var(--primary-purple)] to-[var(--primary-blue)] p-6 shadow-xl border border-[var(--secondary-light-lavender)]/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--white)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--primary-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[var(--white)]">Total Participations</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--white)]">{totalParticipations}</h1>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[var(--secondary-light-lavender)] to-[var(--secondary-pale-lavender)] p-6 shadow-xl border border-[var(--secondary-light-lavender)]/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--white)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--primary-purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[var(--primary-dark-purple)]/70">Student Participations</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--primary-dark-purple)]">{totalStudentParticipations}</h1>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[var(--primary-purple)] to-[var(--primary-blue)] p-6 shadow-xl border border-[var(--secondary-light-lavender)]/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[var(--white)] flex items-center justify-center">
                <svg className="w-5 h-5 text-[var(--primary-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-[var(--white)]">Teacher Participations</span>
            </div>
            <h1 className="text-3xl font-bold text-[var(--white)]">{totalTeacherParticipations}</h1>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Bar Chart */}
          <div className="bg-[var(--white)] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-[var(--secondary-light-lavender)]/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--primary-dark-purple)]">Top 5 Events by Participation</h2>
              <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            {topEvents.length > 0 ? (
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No event data available
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="bg-[var(--white)] rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border border-[var(--secondary-light-lavender)]/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--primary-dark-purple)]">Participation by Type</h2>
              <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            {totalParticipations > 0 ? (
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                No participation data available
              </div>
            )}
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-[var(--white)] rounded-2xl p-6 shadow-xl border border-[var(--secondary-light-lavender)]/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[var(--primary-dark-purple)]">All Events Overview</h2>
            <Image src="/moreDark.png" alt="" width={20} height={20} />
          </div>
          {eventStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[var(--secondary-light-lavender)]">
                    <th className="text-left py-4 px-4 text-sm font-bold text-[var(--primary-dark-purple)]">Event</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-[var(--primary-dark-purple)]">Date</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-[var(--primary-dark-purple)]">Students</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-[var(--primary-dark-purple)]">Teachers</th>
                    {type === "Organization" && (
                      <th className="text-center py-4 px-4 text-sm font-bold text-[var(--primary-dark-purple)]">Schools</th>
                    )}
                    <th className="text-center py-4 px-4 text-sm font-bold text-[var(--primary-dark-purple)]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {eventStats.map((event) => (
                    <tr key={event.id} className="border-b border-[var(--secondary-light-lavender)]/30 hover:bg-[var(--secondary-pale-lavender)] transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-[var(--primary-dark-purple)]">{event.title}</td>
                      <td className="py-4 px-4 text-sm text-[var(--primary-dark-purple)]/70">
                        {new Date(event.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-sm text-center">
                        <span className="bg-[var(--secondary-light-lavender)] text-[var(--primary-purple)] px-3 py-1.5 rounded-full text-xs font-bold">
                          {event.students}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-center">
                        <span className="bg-[var(--secondary-light-lavender)] text-[var(--primary-blue)] px-3 py-1.5 rounded-full text-xs font-bold">
                          {event.teachers}
                        </span>
                      </td>
                      {type === "Organization" && (
                        <td className="py-4 px-4 text-sm text-center">
                          <span className="bg-[var(--secondary-light-lavender)] text-[var(--accent-purple-text)] px-3 py-1.5 rounded-full text-xs font-bold">
                            {event.schools}
                          </span>
                        </td>
                      )}
                      <td className="py-4 px-4 text-sm text-center font-bold text-[var(--primary-dark-purple)]">
                        {event.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              No events found for this {type}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsAnalytics;