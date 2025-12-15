'use client';

export default function VisionHero() {
  return (
    <section className="relative w-full bg-[#34365C] text-white py-20 overflow-hidden">
      
      {/* Decorative stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-20 text-4xl opacity-20">✦</div>
        <div className="absolute top-32 right-32 text-5xl opacity-20">★</div>
        <div className="absolute bottom-20 left-1/3 text-3xl opacity-20">✦</div>
        <div className="absolute bottom-24 right-24 text-4xl opacity-20">★</div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <p className="text-sm text-[#DCD0FF] mb-4">
          Home · Vision
        </p>

        <h1 className="text-4xl md:text-6xl font-bold mb-3 ">
          Our Vision & <span className="text-[#4169E1]">Mission</span>
        </h1>

        <p className="max-w-3xl text-xl text-[#DCD0FF] opacity-90">
          Empowering students to showcase their unique journey throug three core pillars that define our platform.
        </p>
      </div>
    </section>
  );
}
