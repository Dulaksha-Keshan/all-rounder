"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { School } from "@/app/_type/type";
import { useSchoolStore } from "@/context/useSchoolStore";
import SchoolOverviewTab from "./SchoolOverviewTab";
import SchoolAchievementsTab from "./SchoolAchievementsTab";
import SchoolEventsTab from "./SchoolEventsTab";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import ConfirmationModal from "@/components/ConfirmationModal";

// Added Teachers and Students to the tab list
const tabs = ["Overview", "Achievements", "Events", "Teachers", "Students"];

interface SchoolTabsProps {
  school: School;
  isAdmin: boolean;
}

export default function SchoolTabs({ school, isAdmin }: SchoolTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Overview");
  const [requestSubTab, setRequestSubTab] = useState<"pending" | "processed">("pending");
  const [hasLoadedAllRequests, setHasLoadedAllRequests] = useState(false);
  const [verificationModal, setVerificationModal] = useState<{
    isOpen: boolean;
    action: "APPROVED" | "REJECTED" | null;
    requestId: string | null;
    requestLabel: string;
  }>({
    isOpen: false,
    action: null,
    requestId: null,
    requestLabel: "",
  });

  // Pull states and actions from School Store
  const { 
    schoolTeachers, 
    schoolStudents, 
    fetchSchoolTeachers, 
    fetchSchoolStudents,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    fetchVerificationRequests,
    getAllVerificationRequests,
    updateVerificationStatus,
  } = useSchoolStore();

  const processedRequests = [...approvedRequests, ...rejectedRequests].sort((a, b) => {
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });

  // Hydrate the lists when the component mounts or school ID changes
  useEffect(() => {
    if (school.school_id) {
      fetchSchoolTeachers(school.school_id);
      fetchSchoolStudents(school.school_id);

      if (isAdmin) {
        fetchVerificationRequests(school.school_id);
      }
    }
  }, [
    school.school_id,
    isAdmin,
    fetchSchoolTeachers,
    fetchSchoolStudents,
    fetchVerificationRequests,
  ]);

  useEffect(() => {
    if (
      isAdmin &&
      activeTab === "Teachers" &&
      requestSubTab === "processed" &&
      !hasLoadedAllRequests
    ) {
      getAllVerificationRequests();
      setHasLoadedAllRequests(true);
    }
  }, [isAdmin, activeTab, requestSubTab, hasLoadedAllRequests, getAllVerificationRequests]);

  useEffect(() => {
    setHasLoadedAllRequests(false);
    setRequestSubTab("pending");
  }, [school.school_id]);

  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRequestDisplayName = (request: any) => {
    return request.teacherName || request.teacher?.name || request.user?.name || "Teacher";
  };

  const getRequestDisplayEmail = (request: any) => {
    return request.teacherEmail || request.teacher?.email || request.user?.email || "No email";
  };

  const openVerificationModal = (
    requestId: string,
    requestLabel: string,
    action: "APPROVED" | "REJECTED"
  ) => {
    setVerificationModal({
      isOpen: true,
      action,
      requestId,
      requestLabel,
    });
  };

  const confirmVerificationAction = async () => {
    if (!verificationModal.requestId || !verificationModal.action) return;

    try {
      await updateVerificationStatus(verificationModal.requestId, verificationModal.action);
    } catch (error) {
      console.error("Failed to update verification status:", error);
      alert("Failed to process request.");
    } finally {
      setVerificationModal({ isOpen: false, action: null, requestId: null, requestLabel: "" });
    }
  };

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
              {tab === "Teachers" && isAdmin && pendingRequests.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingRequests.length}
                </span>
              )}
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
          {isAdmin && (
            <div className="mb-8 rounded-xl border border-[#DCD0FF]/70 bg-[#F9F8FF] p-4 md:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-[#34365C]">Teacher Verification Requests</h3>
                <div className="inline-flex rounded-lg bg-white p-1 border border-gray-200">
                  <button
                    onClick={() => setRequestSubTab("pending")}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                      requestSubTab === "pending"
                        ? "bg-[var(--primary-blue)] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Pending ({pendingRequests.length})
                  </button>
                  <button
                    onClick={() => setRequestSubTab("processed")}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                      requestSubTab === "processed"
                        ? "bg-[var(--primary-blue)] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Processed ({processedRequests.length})
                  </button>
                </div>
              </div>

              {requestSubTab === "pending" && (
                <>
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-3">
                      {pendingRequests.map((request) => (
                        <div
                          key={request.id}
                          className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                        >
                          <div>
                            <p className="font-bold text-[#34365C]">{getRequestDisplayName(request)}</p>
                            <p className="text-sm text-gray-500">{getRequestDisplayEmail(request)}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Requested on {formatDate(request.createdAt)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                openVerificationModal(
                                  request.id,
                                  getRequestDisplayName(request),
                                  "APPROVED"
                                )
                              }
                              className="px-3 py-2 text-sm font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors inline-flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                openVerificationModal(
                                  request.id,
                                  getRequestDisplayName(request),
                                  "REJECTED"
                                )
                              }
                              className="px-3 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors inline-flex items-center gap-1"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
                      <p className="text-gray-500 font-medium">No pending teacher verification requests.</p>
                    </div>
                  )}
                </>
              )}

              {requestSubTab === "processed" && (
                <>
                  {processedRequests.length > 0 ? (
                    <div className="space-y-3">
                      {processedRequests.map((request) => (
                        <div
                          key={request.id}
                          className="rounded-lg border border-gray-200 bg-white p-4 flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-bold text-[#34365C]">{getRequestDisplayName(request)}</p>
                            <p className="text-sm text-gray-500">{getRequestDisplayEmail(request)}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Updated on {formatDate(request.updatedAt || request.createdAt)}
                            </p>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full ${
                              request.verificationStatus === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {request.verificationStatus === "APPROVED" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                            {request.verificationStatus}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl bg-white">
                      <p className="text-gray-500 font-medium">No processed verification requests yet.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

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

      <ConfirmationModal
        isOpen={verificationModal.isOpen}
        onClose={() => setVerificationModal({ isOpen: false, action: null, requestId: null, requestLabel: "" })}
        onConfirm={confirmVerificationAction}
        title={verificationModal.action === "APPROVED" ? "Approve Request" : "Reject Request"}
        message={
          verificationModal.action === "APPROVED"
            ? `Are you sure you want to approve ${verificationModal.requestLabel}'s verification request?`
            : `Are you sure you want to reject ${verificationModal.requestLabel}'s verification request?`
        }
        confirmLabel={verificationModal.action === "APPROVED" ? "Yes, Approve" : "Yes, Reject"}
        cancelLabel="Cancel"
        variant={verificationModal.action === "APPROVED" ? "success" : "danger"}
      />
    </>
  );
}