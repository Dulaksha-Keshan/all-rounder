// 'use client';

// export default function AboutAllRounder() {
//   return (
//     <section className="relative w-full bg-gradient-to-r from-[#34365C] via-[#3B3E70] to-[#34365C] text-white py-24 overflow-hidden">

//       {/* Decorative Stars */}
//       <div className="absolute inset-0 pointer-events-none">
//         <span className="absolute top-16 left-24 text-3xl opacity-20">✦</span>
//         <span className="absolute top-32 right-32 text-4xl opacity-20">★</span>
//         <span className="absolute bottom-24 left-1/4 text-2xl opacity-20">✦</span>
//         <span className="absolute bottom-20 right-20 text-3xl opacity-20">★</span>
//         <span className="absolute top-1/2 left-10 text-xl opacity-15">✦</span>
//       </div>

//       {/*  Content */}
//       <div className="relative z-10 px-6">
//         <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
//           About All-Rounder
//         </h2>

//         <div className="w-16 h-1 bg-[#8387CC] mx-auto rounded-full mb-6" />

//         <div className="max-w-3xl mx-auto text-center text-[#E6E6FF] leading-relaxed text-lg">
//           <p>
//             All-Rounder was created to redefine how student success is seen and celebrated.
//             Beyond grades and exams, every student carries achievements, creativity,
//             leadership, and growth that deserve recognition.
//           </p>

//           <p className="mt-4">
//             Our platform brings these stories together into one secure, verified,
//             and inclusive digital space—empowering students to showcase who they truly
//             are and helping educators and institutions recognize potential beyond
//             the classroom.
//           </p>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

export default function AboutAllRounder() {
  return (
    <section className="relative w-full bg-gradient-to-r from-[#34365C] via-[#3B3E70] to-[#34365C] text-white py-24 overflow-hidden">

      {/* ⭐ Blinking Stars (Friend Style) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top */}
        <span className="absolute top-14 left-16 text-4xl text-[#DCD0FF] opacity-20 animate-pulse">★</span>
        <span className="absolute top-28 right-28 text-3xl text-[#8387CC] opacity-20 animate-pulse delay-100">★</span>

        {/* Middle */}
        <span className="absolute top-1/2 left-10 text-2xl text-[#DCD0FF] opacity-15 animate-pulse delay-200">★</span>
        <span className="absolute top-1/3 right-16 text-3xl text-[#8387CC] opacity-20 animate-pulse delay-300">★</span>

        {/* Bottom */}
        <span className="absolute bottom-24 left-1/4 text-4xl text-[#DCD0FF] opacity-20 animate-pulse delay-400">★</span>
        <span className="absolute bottom-16 right-20 text-3xl text-[#8387CC] opacity-20 animate-pulse delay-500">★</span>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          About All-Rounder
        </h2>

        <div className="w-16 h-1 bg-[#8387CC] mx-auto rounded-full mb-6" />

        <div className="max-w-3xl mx-auto text-center text-[#E6E6FF] leading-relaxed text-lg">
          <p>
            All-Rounder was created to redefine how student success is seen and celebrated.
            Beyond grades and exams, every student carries achievements, creativity,
            leadership, and growth that deserve recognition.
          </p>

          <p className="mt-4">
            Our platform brings these stories together into one secure, verified,
            and inclusive digital space—empowering students to showcase who they truly
            are and helping educators and institutions recognize potential beyond
            the classroom.
          </p>
        </div>
      </div>
    </section>
  );
}
