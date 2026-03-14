"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { School } from "@/app/_type/type";
import { useSchoolStore } from "@/context/useSchoolStore";
import SchoolOverviewTab from "./SchoolOverviewTab";
import SchoolAchievementsTab from "./SchoolAchievementsTab";
import SchoolEventsTab from "./SchoolEventsTab";

// Added Teachers and Students to the tab list
const tabs = ["Overview", "Achievements", "Events", "Teachers", "Students"];

interface SchoolTabsProps {
  school: School;
  isAdmin: boolean;
}

export default function SchoolTabs({ school, isAdmin }: SchoolTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");

  // Pull states and actions from School Store
  const { 
    schoolTeachers, 
    schoolStudents, 
    fetchSchoolTeachers, 
    fetchSchoolStudents 
  } = useSchoolStore();

  // Hydrate the lists when the component mounts or school ID changes
  useEffect(() => {
    if (school.school_id) {
      fetchSchoolTeachers(school.school_id);
      fetchSchoolStudents(school.school_id);
    }
  }, [school.school_id, fetchSchoolTeachers, fetchSchoolStudents]);

  return (
    <>
      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-[#DCD0FF]/50 overflow-x-auto hide-scrollbar">
        <div className="flex w-max min-w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-4 font-bold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)] bg-[var(--primary-blue)]/5"
                  : "text-gray-500 hover:text-[#34365C] hover:bg-gray-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "Overview" && <SchoolOverviewTab school={school} />}
      {activeTab === "Achievements" && <SchoolAchievementsTab />}
      {activeTab === "Events" && <SchoolEventsTab />}

      {/* TEACHERS TAB */}
      {activeTab === "Teachers" && (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-[#DCD0FF]/50 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#34365C]">School Faculty</h2>
            {/* Only admin can directly add a teacher */}
            {isAdmin && (
              <button className="text-sm font-bold text-[var(--primary-blue)] hover:underline">
                + Add Teacher
              </button>
            )}
          </div>
          
          {schoolTeachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {schoolTeachers.map((teacher: any) => (
                <div 
                  key={teacher.uid}
                  onClick={() => router.push(`/user/teacher/${teacher.uid}`)} // Adjust route if needed
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-[#8387CC] hover:shadow-md transition-all cursor-pointer bg-gray-50/50"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {teacher.name?.charAt(0).toUpperCase() || 'T'}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-[#34365C] truncate">{teacher.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{teacher.subject || teacher.designation || 'Educator'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 font-medium">No teachers have joined this school yet.</p>
            </div>
          )}
        </div>
      )}

      {/* STUDENTS TAB */}
      {activeTab === "Students" && (
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-[#DCD0FF]/50 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#34365C]">Enrolled Students</h2>
          </div>
          
          {schoolStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {schoolStudents.map((student: any) => (
                <div 
                  key={student.uid}
                  onClick={() => router.push(`/user/student/${student.uid}`)} // Adjust route if needed
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-[#4169E1] hover:shadow-md transition-all cursor-pointer bg-gray-50/50"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {student.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-[#34365C] truncate">{student.name}</h4>
                    <p className="text-xs text-gray-500 truncate">Grade {student.grade || 'N/A'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 font-medium">No students have enrolled in this school yet.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}