"use client";

import { useEffect } from "react";

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
