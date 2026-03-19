"use client";

import { Suspense, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, notFound } from "next/navigation";
import Table from "@/app/dashboard/_components/Table";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import GoBackButton from "@/components/GoBackButton";
import { useSchoolStore } from "@/context/useSchoolStore";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const ITEM_PER_PAGE = 10;

interface StudentListPageProps {
    params: Promise<{
        schoolId: string;
    }>;
}

const StudentListPageContent = ({ schoolId }: { schoolId: string }) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page")
        ? parseInt(searchParams.get("page") as string)
        : 1;
    const search = searchParams.get("search")?.toLowerCase() || "";

    const {
        getSchoolById,
        fetchSchools,
        schools,
        schoolStudents,
        fetchSchoolStudents,
        isLoading,
    } = useSchoolStore();

    useEffect(() => {
        if (!schools.length) {
            void fetchSchools();
        }
        void fetchSchoolStudents(schoolId);
    }, [schools.length, fetchSchools, fetchSchoolStudents, schoolId]);

    // Find the school - show 404 if not found
    const school = getSchoolById(schoolId);

    if (isLoading && !school) {
        return <div className="p-6 text-[var(--text-main)]">Loading students...</div>;
    }

    if (!school) {
        notFound();
    }

    // ------------- FILTER & SEARCH (Backend already filters by schoolId) -------------
    let filteredStudents = schoolStudents;

    // ------------- SEARCH BY NAME OR ABOUT FIELD -------------
    if (search) {
        filteredStudents = filteredStudents.filter(
            (student) =>
                student.name.toLowerCase().includes(search) ||
                (student.about && student.about.toLowerCase().includes(search))
        );
    }

    const count = filteredStudents.length;

    // ------------- PAGINATION -------------
    const data = filteredStudents.slice(
        ITEM_PER_PAGE * (page - 1),
        ITEM_PER_PAGE * page
    );

    const columns = [
        { header: "Student", accessor: "name" },
        { header: "About", accessor: "about", className: "hidden md:table-cell" },
        { header: "Profile", accessor: "profile_picture", className: "hidden lg:table-cell" },
        { header: "Actions", accessor: "action" },
    ];

    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (!tableRef.current) return;
        const rows = tableRef.current.querySelectorAll('tbody tr');
        
        // Guard: only animate if rows exist
        if (rows.length === 0) {
            console.log("No rows found to animate");
            return;
        }
        
        gsap.fromTo(rows,
            { y: 10, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.4,
                stagger: 0.05,
                ease: "power2.out"
            }
        );
    }, [data]);

    const renderRow = (student: any) => (
        <tr
            key={student.uid}
            className="border-b border-[var(--gray-100)] text-sm hover:bg-[var(--gray-50)] transition-all opacity-0"
        >
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <Image
                        src={student.profile_picture || "/noAvatar.png"}
                        alt={student.name}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-[var(--primary-purple)]/30"
                    />
                    <span className="font-bold text-[var(--text-main)]">{student.name}</span>
                </div>
            </td>
            <td className="hidden md:table-cell text-[var(--text-muted)] py-4 px-6 max-w-xs truncate">
                {student.about || "—"}
            </td>
            <td className="hidden lg:table-cell text-[var(--text-muted)] py-4 px-6">
                {student.profile_picture ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ✓ Set
                    </span>
                ) : (
                    <span className="text-xs text-gray-400">—</span>
                )}
            </td>
            <td className="py-4 px-6">
                <Link
                    href={`/dashboard/schools/${schoolId}/students/${student.uid}`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary-purple)] to-[var(--primary-blue)] text-[var(--white)] rounded-lg text-xs font-medium hover:shadow-md transition-all"
                >
                    View Profile
                </Link>
            </td>
        </tr>
    );

    return (
        <div className="bg-[var(--white)] p-8 m-4 rounded-2xl shadow-xl border border-[var(--gray-200)] transition-all duration-300">
            {/* TOP BAR */}
            <div className="mb-4">
                <GoBackButton variant="solid" />
            </div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--primary-dark-purple)]">
                        Students – {school.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">{school.address}</p>
                </div>
                <SearchBar />
            </div>

            {/* STATS */}
            <div className="mb-4 p-4 bg-[var(--gray-50)] rounded-lg border border-[var(--gray-200)]">
                <p className="text-sm text-[var(--text-main)]">
                    <span className="font-extrabold text-xl text-[var(--primary-blue)]">{count}</span> students enrolled in total
                </p>
            </div>

            {/* TABLE */}
            <div ref={tableRef} className="bg-[var(--white)] rounded-xl overflow-hidden border border-[var(--gray-200)] shadow-sm">
                {data.length > 0 ? (
                    <Table columns={columns} data={data} renderRow={renderRow} />
                ) : (
                    <div className="py-12 text-center text-gray-400">
                        <p className="text-lg">No students found</p>
                        {search && (
                            <p className="text-sm mt-2">Try adjusting your search criteria</p>
                        )}
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            {count > 0 && <Pagination page={page} count={count} />}
        </div>
    );
};

const StudentListPage = ({ params }: StudentListPageProps) => {
    const { schoolId } = use(params);
    return (
        <Suspense fallback={<div>Loading Students...</div>}>
            <StudentListPageContent schoolId={schoolId} />
        </Suspense>
    );
};

export default StudentListPage;
