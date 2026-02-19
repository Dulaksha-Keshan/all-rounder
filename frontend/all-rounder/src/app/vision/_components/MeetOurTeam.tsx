// 'use client';

// import { useEffect, useState } from 'react';
// import NextImage from 'next/image';

// const teamMembers = [
//   {
//     name: 'Pathumi Kaweesha',
//     role: 'Group Leader & Backend Developer',
//     description: 'Leads the team while designing and developing reliable backend systems that support smooth application functionality.',
//     image: '/images/team/member01.jpeg',
//   },
//   {
//     name: 'Teneesha Alwis',
//     role: 'Frontend Developer',
//     description: 'Builds responsive and user-friendly interfaces that deliver a smooth and engaging user experience.Designing meaningful and accessible user experiences.',
//     image: '/images/team/member02.jpeg',
//   },
//   {
//     name: 'Kulani Tennakoon',
//     role: 'Frontend Developer',
//     description: 'Develops interactive web interfaces using modern frontend technologies with a focus on performance and usability.',
//     image: '/images/team/member03.jpeg',
//   },
//   {
//     name: 'Imandi Kariyapperuma',
//     role: 'Frontend Developer',
//     description: 'Implements frontend components, ensures responsive design, and enhances usability across devices.',
//     image: '/images/team/member04.jpeg',
//   },
//   {
//     name: 'Dulaksha Jayasinghe',
//     role: 'Backend Developer',
//     description: 'Develops server-side logic, APIs, and databases to ensure secure and efficient application performance.',
//     image: '/images/team/member05.jpeg',
//   },
//   {
//     name: 'Abdul Malik',
//     role: 'Backend Developer',
//     description: 'Builds scalable backend systems, manages databases, and integrates APIs to support application functionality.',
//     image: '/images/team/member06.jpeg',
//   },
// ];

// // duplicate list
// const extendedMembers = [...teamMembers, ...teamMembers];

// export default function MeetOurTeam() {
//   const [index, setIndex] = useState(0);
//   const [animate, setAnimate] = useState(true);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex((prev) => prev + 1);
//     }, 3500);

//     return () => clearInterval(interval);
//   }, []);

//   // RESET WITHOUT BACKWARD ANIMATION
//   useEffect(() => {
//     if (index === teamMembers.length) {
//       setTimeout(() => {
//         setAnimate(false);
//         setIndex(0);
//       }, 700); // match transition duration
//     } else {
//       setAnimate(true);
//     }
//   }, [index]);

//   return (
//     <section className="w-full py-10 bg-white overflow-hidden">
//       {/* TITLE */}
//       <h2 className="text-3xl md:text-4xl font-bold text-center text-[#34365C] mb-8">
//         Meet Our Team
//       </h2>

//       {/* SLIDER WRAPPER */}
//       <div className="relative w-full flex justify-center overflow-hidden">
//         <div
//           className="flex transition-transform duration-700 ease-in-out"
//           style={{
//             transform: `translateX(-${index * 100}%)`,
//           }}
//         >
//           {teamMembers.map((member, i) => (
//             <div
//               key={i}
//               className="min-w-full flex justify-center"
//             >
//               {/* CARD */}
//               <div className="w-[300px] md:w-[500px] h-[400px] bg-[#F3EEFF] border border-[#8387CC]/40 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center">

//                 {/* IMAGE */}
//                 <div className="relative w-50 h-50 rounded-2xl overflow-hidden mb-6 border border-[#8387CC]/40">
//                   <NextImage
//                     src={member.image}
//                     alt={member.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>

//                 {/* NAME */}
//                 <h3 className="text-xl font-bold text-[#34365C]">
//                   {member.name}
//                 </h3>

//                 {/* ROLE */}
//                 <p className="text-sm text-[#6B6FA6] mt-1 mb-4">
//                   {member.role}
//                 </p>

//                 {/* DESCRIPTION */}
//                 <p className="text-gray-700 text-sm leading-relaxed">
//                   {member.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import NextImage from 'next/image';

const teamMembers = [
  {
    name: 'Pathumi Kaweesha',
    role: 'Group Leader & Backend Developer',
    description:
      'Leads the team while designing and developing reliable backend systems that support smooth application functionality.',
    image: '/images/team/member01.jpeg',
  },
  {
    name: 'Teneesha Alwis',
    role: 'Frontend Developer',
    description:
      'Builds responsive and user-friendly interfaces that deliver a smooth and engaging user experience.',
    image: '/images/team/member02.jpeg',
  },
  {
    name: 'Kulani Tennakoon',
    role: 'Frontend Developer',
    description:
      'Develops interactive web interfaces using modern frontend technologies.',
    image: '/images/team/member03.jpeg',
  },
  {
    name: 'Imandi Kariyapperuma',
    role: 'Frontend Developer',
    description:
      'Implements frontend components and enhances usability across devices.',
    image: '/images/team/member04.jpeg',
  },
  {
    name: 'Dulaksha Jayasinghe',
    role: 'Backend Developer',
    description:
      'Develops server-side logic and APIs for secure performance.',
    image: '/images/team/member05.jpeg',
  },
  {
    name: 'Abdul Malik',
    role: 'Backend Developer',
    description:
      'Builds scalable backend systems and integrates APIs.',
    image: '/images/team/member06.jpeg',
  },
];

export default function MeetOurTeam() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % teamMembers.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const getPosition = (index: number) => {
    if (index === current) return 'center';
    if (index === (current - 1 + teamMembers.length) % teamMembers.length)
      return 'left';
    if (index === (current + 1) % teamMembers.length)
      return 'right';
    return 'hidden';
  };

  return (
    <section className="w-full py-20 bg-white overflow-hidden">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#34365C] mb-14">
        Meet Our Team
      </h2>

      <div className="relative flex justify-center items-center h-[450px]">

        {teamMembers.map((member, index) => {
          const position = getPosition(index);

          return (
            <div
              key={index}
              className={`absolute transition-all duration-700 ease-in-out
              ${position === 'center' ? 'z-20 scale-100 opacity-100 translate-x-0' : ''}
              ${position === 'left' ? 'z-10 scale-75 opacity-60 -translate-x-[350px]' : ''}
              ${position === 'right' ? 'z-10 scale-75 opacity-60 translate-x-[350px]' : ''}
              ${position === 'hidden' ? 'opacity-0 scale-50 pointer-events-none' : ''}
              `}
            >
              <div className="w-[320px] md:w-[450px] h-[400px] bg-[#F3EEFF] border border-[#8387CC]/40 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center">

                <div className="relative w-40 h-40 rounded-2xl overflow-hidden mb-6 border border-[#8387CC]/40">
                  <NextImage
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <h3 className="text-xl font-bold text-[#34365C]">
                  {member.name}
                </h3>

                <p className="text-sm text-[#6B6FA6] mt-1 mb-4">
                  {member.role}
                </p>

                <p className="text-gray-700 text-sm leading-relaxed">
                  {member.description}
                </p>

              </div>
            </div>
          );
        })}

      </div>
    </section>
  );
}
