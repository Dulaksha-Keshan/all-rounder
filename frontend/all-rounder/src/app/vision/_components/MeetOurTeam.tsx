'use client';

import { useEffect, useState } from 'react';

const teamMembers = [
  {
    name: 'Pathumi Kaweesha',
    role: 'Group Leader & Backend Developer',
    description: 'BLeads the team while designing and developing reliable backend systems that support smooth application functionality.',
    image: '/team/member01.jpeg',
  },
  {
    name: 'Teneesha Alwis',
    role: 'Frontend Developer',
    description: 'Builds responsive and user-friendly interfaces that deliver a smooth and engaging user experience.Designing meaningful and accessible user experiences.',
    image: '/team/member02.jpeg',
  },
  {
    name: 'Kulani Tennakoon',
    role: 'Frontend Developer',
    description: 'Develops interactive web interfaces using modern frontend technologies with a focus on performance and usability.',
    image: '/team/member03.png',
  },
  {
    name: 'Imandi Kariyapperuma',
    role: 'Frontend Developer',
    description: 'Implements frontend components, ensures responsive design, and enhances usability across devices.',
    image: '/team/member04.jpeg',
  },
  {
    name: 'Dulaksha Jayasinghe',
    role: 'Backend Developer',
    description: 'Develops server-side logic, APIs, and databases to ensure secure and efficient application performance.',
    image: '/team/member05.jpeg',
  },
  {
    name: 'Abdul Malik',
    role: 'Backend Developer',
    description: 'Builds scalable backend systems, manages databases, and integrates APIs to support application functionality.',
    image: '/team/member06.jpeg',
  },
];

// duplicate list
const extendedMembers = [...teamMembers, ...teamMembers];

export default function MeetOurTeam() {
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // RESET WITHOUT BACKWARD ANIMATION
  useEffect(() => {
    if (index === teamMembers.length) {
      setTimeout(() => {
        setAnimate(false);
        setIndex(0);
      }, 700); // match transition duration
    } else {
      setAnimate(true);
    }
  }, [index]);

  return (
    <section className="w-full py-24 bg-white overflow-hidden">
      {/* TITLE */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#34365C] mb-16">
        Meet Our Team
      </h2>

      {/* SLIDER WRAPPER */}
      <div className="relative w-full flex justify-center overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {teamMembers.map((member, i) => (
            <div
              key={i}
              className="min-w-full flex justify-center"
            >
              {/* CARD */}
              <div className="w-[300px] md:w-[550px] h-[360px] bg-[#F3EEFF] border border-[#8387CC]/40 rounded-3xl shadow-lg p-8 flex flex-col items-center text-center">

                {/* IMAGE */}
                <div className="w-32 h-32 rounded-2xl overflow-hidden mb-6 border border-[#8387CC]/40">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* NAME */}
                <h3 className="text-xl font-bold text-[#34365C]">
                  {member.name}
                </h3>

                {/* ROLE */}
                <p className="text-sm text-[#6B6FA6] mt-1 mb-4">
                  {member.role}
                </p>

                {/* DESCRIPTION */}
                <p className="text-gray-700 text-sm leading-relaxed">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
