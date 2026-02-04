"use client";

import { useEffect } from "react";
import { User, AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--secondary-pale-lavender)] text-[var(--primary-dark-purple)]">
            <div className="w-24 h-24 rounded-full bg-[var(--gray-100)] flex items-center justify-center mb-6 border-4 border-[var(--white)] shadow-md">
                <AlertCircle size={48} className="text-[var(--primary-purple)]" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-4 py-2 bg-[var(--primary-purple)] text-white rounded-md hover:bg-[var(--primary-dark-purple)] transition-colors"
            >
                Try again
            </button>
        </div>
    );
}
