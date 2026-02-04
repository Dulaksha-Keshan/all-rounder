"use client";

import { Calendar } from "lucide-react";
import Link from "next/link";

const events = [
    {
        title: "Math Olympiad Finals",
        date: "Dec 5, 2025",
        type: "Competition",
        color: "bg-blue-100 text-blue-600"
    },
    {
        title: "Art Exhibition Submission",
        date: "Dec 10, 2025",
        type: "Exhibition",
        color: "bg-purple-100 text-purple-600"
    },
    {
        title: "Scholarship Application",
        date: "Dec 15, 2025",
        type: "Opportunity",
        color: "bg-indigo-100 text-indigo-600"
    }
];

export default function UpcomingEvents() {
    return (
        <div className="bg-[var(--white)] rounded-2xl p-6 shadow-sm border border-[var(--gray-200)]">
            <h2 className="text-lg font-bold text-[var(--primary-dark-purple)] mb-4">Upcoming Events</h2>

            <div className="space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="flex gap-4 p-3 rounded-xl hover:bg-[var(--gray-50)] transition-colors cursor-pointer">
                        <div className="w-12 h-12 rounded-lg bg-[var(--secondary-pale-lavender)] flex items-center justify-center flex-shrink-0 text-[var(--primary-purple)]">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-[var(--primary-dark-purple)] text-sm line-clamp-1">
                                {event.title}
                            </h3>
                            <p className="text-xs text-[var(--gray-600)] mt-1">{event.date}</p>
                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-2 font-medium ${event.color}`}>
                                {event.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <Link
                href="/calendar"
                className="block w-full text-center text-sm text-[var(--primary-blue)] font-medium mt-6 hover:underline"
            >
                View All Events
            </Link>
        </div>
    );
}
