import Image from "next/image";

export default function Loading() {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[var(--secondary-pale-lavender)] gap-4">
            <div className="relative">
                {/* Pulse effect background */}
                <div className="absolute inset-0 bg-[var(--primary-purple)]/20 rounded-full animate-ping" />

                {/* Avatar Image */}
                <div className="relative w-20 h-20 rounded-full border-4 border-[var(--primary-purple)] overflow-hidden shadow-xl animate-pulse">
                    <Image
                        src="/icons/Avatar.png"
                        alt="Loading..."
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Loading Text */}
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-xl font-bold text-[var(--primary-dark-purple)] tracking-wider">
                    All-Rounder
                </h2>
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-blue)] animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-purple)] animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 rounded-full bg-[var(--primary-dark-purple)] animate-bounce"></span>
                </div>
                <p className="text-sm font-medium text-[var(--accent-purple-text)] animate-pulse">
                    Loading your experience...
                </p>
            </div>
        </div>
    );
}
