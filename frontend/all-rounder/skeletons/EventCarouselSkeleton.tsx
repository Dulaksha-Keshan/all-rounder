"use client";

export default function EventCarouselSkeleton() {
  return (
    <section className="bg-gradient-to-br from-purple-100 via-[var(--pink-50)] to-purple-100 py-8 sm:py-10 lg:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 animate-pulse">
        <div className="h-10 w-72 mx-auto rounded-lg bg-[var(--secondary-light-lavender)]/70 mb-10" />

        <div className="relative max-w-5xl mx-auto px-12 sm:px-14 lg:px-0">
          <div className="rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[var(--primary-purple)]/20 bg-white overflow-hidden shadow-xl">
            <div className="h-[250px] sm:h-[350px] lg:h-[400px] bg-[var(--secondary-light-lavender)]/40" />

            <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-[var(--white)] to-purple-50 space-y-5">
              <div className="h-7 w-2/3 rounded bg-[var(--secondary-light-lavender)]/60" />
              <div className="h-4 w-full rounded bg-[var(--secondary-light-lavender)]/45" />
              <div className="h-4 w-5/6 rounded bg-[var(--secondary-light-lavender)]/45" />

              <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-2">
                <div className="h-16 rounded-lg bg-[var(--secondary-light-lavender)]/45" />
                <div className="h-16 rounded-lg bg-[var(--secondary-light-lavender)]/45" />
                <div className="h-16 rounded-lg bg-[var(--secondary-light-lavender)]/45" />
              </div>

              <div className="h-11 w-40 mx-auto rounded-xl bg-[var(--secondary-light-lavender)]/60" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 lg:mt-12">
          <div className="h-3 w-10 rounded-full bg-[var(--secondary-light-lavender)]/70" />
          <div className="h-3 w-3 rounded-full bg-[var(--secondary-light-lavender)]/55" />
          <div className="h-3 w-3 rounded-full bg-[var(--secondary-light-lavender)]/55" />
        </div>
      </div>
    </section>
  );
}
