
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--secondary-pale-lavender)] px-4">
            <div className="text-center space-y-6 max-w-lg">
                {/* Avatar Container with subtle bounce/float animation */}
                <div className="relative mx-auto w-40 h-40">
                    <div className="absolute inset-0 bg-[var(--primary-purple)]/10 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-full h-full rounded-full border-4 border-[var(--white)] shadow-2xl overflow-hidden bg-[var(--white)]">
                        <Image
                            src="/icons/Avatar.png"
                            alt="All Rounder Mascot"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--primary-dark-purple)] tracking-tight">
                        Oops! Page Not Found
                    </h1>
                    <p className="text-lg text-[var(--accent-purple-text)]">
                        It looks like this page has gone on an adventure without us.
                        Let's get you back on track!
                    </p>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                    <Link
                        href="/home"
                        className="inline-flex items-center px-8 py-3 rounded-xl bg-[var(--primary-purple)] text-white font-semibold shadow-lg shadow-indigo-200 hover:bg-[var(--primary-dark-purple)] hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-in-out group"
                    >
                        <span>Return Home</span>
                        <svg
                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
