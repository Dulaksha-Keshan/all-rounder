"use client";

import { Suspense, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, notFound } from "next/navigation";
import Table from "@/app/dashboard/_components/Table";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import GoBackButton from "@/components/GoBackButton";
import { Teachers, Schools } from "@/app/_data/data";
import { Teacher } from "@/app/_type/type";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const ITEM_PER_PAGE = 10;

interface TeacherListPageProps {
    params: Promise<{
        schoolId: string;
    }>;
}

const TeacherListPageContent = ({ schoolId }: { schoolId: string }) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page")
        ? parseInt(searchParams.get("page") as string)
        : 1;
    const search = searchParams.get("search")?.toLowerCase() || "";

    // Find the school - show 404 if not found
    const school = Schools.find((s) => s.id === schoolId);

    if (!school) {
        notFound();
    }

    // ------------- FILTER BY SCHOOL ID -------------
    let filteredTeachers = Teachers.filter(
        (teacher) => teacher.schoolId === schoolId
    );

    // ------------- SEARCH -------------
    if (search) {
        filteredTeachers = filteredTeachers.filter(
            (teacher) =>
                teacher.name.toLowerCase().includes(search) ||
                teacher.email.toLowerCase().includes(search)
        );
    }

    const count = filteredTeachers.length;

    // ------------- PAGINATION -------------
    const data = filteredTeachers.slice(
        ITEM_PER_PAGE * (page - 1),
        ITEM_PER_PAGE * page
    );

    const columns = [
        { header: "Teacher", accessor: "name" },
        { header: "Email", accessor: "email", className: "hidden md:table-cell" },
        { header: "Teacher ID", accessor: "id", className: "hidden lg:table-cell" },
        { header: "Gender", accessor: "sex", className: "hidden lg:table-cell" },
        { header: "Actions", accessor: "action" },
    ];

    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        if (!tableRef.current) return;
        const rows = tableRef.current.querySelectorAll('tbody tr');
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

    const renderRow = (teacher: Teacher) => (
        <tr
            key={teacher.id}
            className="border-b border-[var(--gray-100)] text-sm hover:bg-[var(--gray-50)] transition-all opacity-0"
        >
            <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                    <Image
                        src={teacher.photoUrl || "/noAvatar.png"}
                        alt={teacher.name}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-[var(--primary-purple)]/30"
                    />
                    <span className="font-bold text-[var(--text-main)]">{teacher.name}</span>
                </div>
            </td>

            <td className="hidden md:table-cell text-[var(--text-muted)] py-4 px-6">
                {teacher.email}
            </td>

            <td className="hidden lg:table-cell text-[var(--text-muted)] py-4 px-6 text-center">
                <span className="bg-[var(--secondary-light-lavender)] text-[var(--primary-purple)] px-3 py-1 rounded-full text-xs font-bold">
                    #{teacher.id}
                </span>
            </td>

            <td className="hidden lg:table-cell text-[var(--text-muted)] py-4 px-6">
                <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${teacher.sex === "MALE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-pink-100 text-pink-700"
                        }`}
                >
                    {teacher.sex}
                </span>
            </td>

            <td className="py-4 px-6">
                <Link
                    href={`/dashboard/schools/${schoolId}/teachers/${teacher.id}`}
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
                        Teachers – {school.name}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">{school.location}</p>
                </div>
                <SearchBar />
            </div>

            {/* STATS */}
            <div className="mb-4 p-4 bg-[var(--gray-50)] rounded-lg border border-[var(--gray-200)]">
                <p className="text-sm text-[var(--text-main)]">
                    <span className="font-extrabold text-xl text-[var(--primary-purple)]">{count}</span> teachers on staff
                </p>
            </div>

            {/* TABLE */}
            <div ref={tableRef} className="bg-[var(--white)] rounded-xl overflow-hidden border border-[var(--gray-200)] shadow-sm">
                {data.length > 0 ? (
                    <Table columns={columns} data={data} renderRow={renderRow} />
                ) : (
                    <div className="py-12 text-center text-gray-400">
                        <p className="text-lg">No teachers found</p>
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

const TeacherListPage = ({ params }: TeacherListPageProps) => {
    const { schoolId } = use(params);
    return (
        <Suspense fallback={<div>Loading Teachers...</div>}>
            <TeacherListPageContent schoolId={schoolId} />
        </Suspense>
    );
};

export default TeacherListPage;
