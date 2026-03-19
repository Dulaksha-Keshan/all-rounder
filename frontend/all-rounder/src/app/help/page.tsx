
"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import FAQSection from "./_components/FAQSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FAQItemType = {
  q: string;
  a: React.ReactNode;
};

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const supportRef = useRef<HTMLElement>(null);
  const faqContainerRef = useRef<HTMLDivElement>(null);

  /* ⭐ Header stars animation */
  useEffect(() => {
    gsap.to(".big-star", {
      opacity: 0.2,
      scale: 1.3,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      stagger: 0.6,
    });

    gsap.to(".float-star", {
      y: -14,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 1,
    });

    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.querySelectorAll(".help-hero-item"),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
        }
      );
    }
  }, []);

  /* 📜 FAQ scroll animation (WORKING & SAFE) */
/* 📜 FAQ scroll animation (FIXED FOR ROUTE REDIRECT) */


useLayoutEffect(() => {
  const hoverCleanups: Array<() => void> = [];
  const ctx = gsap.context(() => {
    const sections = gsap.utils.toArray<HTMLElement>(".faq-section");

    sections.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          once: true,
        },
        opacity: 0,
        y: 34,
        duration: 0.65,
        ease: "power2.out",
      });

      const onEnter = () => {
        gsap.to(section, {
          y: -4,
          boxShadow: "0 14px 30px rgba(52, 54, 92, 0.14)",
          duration: 0.25,
          ease: "power2.out",
        });
      };

      const onLeave = () => {
        gsap.to(section, {
          y: 0,
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          duration: 0.3,
          ease: "power2.out",
        });
      };

      section.addEventListener("mouseenter", onEnter);
      section.addEventListener("mouseleave", onLeave);
      hoverCleanups.push(() => {
        section.removeEventListener("mouseenter", onEnter);
        section.removeEventListener("mouseleave", onLeave);
      });
    });

    if (supportRef.current) {
      gsap.fromTo(
        supportRef.current,
        { y: 24, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: "power2.out",
          scrollTrigger: {
            trigger: supportRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    }

    ScrollTrigger.refresh();
  }, faqContainerRef);

  return () => {
    hoverCleanups.forEach((cleanup) => cleanup());
    ctx.revert();
  };
}, []);




  /* 🔍 Search filter */
  const filterItems = (items: FAQItemType[]) => {
    if (!search.trim()) return items;
    return items.filter((item) =>
      item.q.toLowerCase().includes(search.toLowerCase())
    );
  };

  /* 📦 FAQ DATA */
  const faqData = [
  {
    title: "Getting Started",
    items: [
      {
        q: "What is All-Rounder?",
        a: `All-Rounder is a comprehensive student extracurricular activities sharing platform designed to go beyond academics.
          It connects students, teachers, schools, and organizations into one trusted ecosystem where achievements, skills, and participation can be showcased digitally.
        The platform helps students build a verified profile of their talents, while institutions and organizations can discover, validate, and support student potential.`,
      },
      {
        q: "How do I create an account?",
        a: `You can create an account by signing up using your personal email address or your institution-provided credentials.
          Once registered, you’ll be guided through a simple onboarding process where you select your user type and complete your profile details.
        Account creation is free and only takes a few minutes.`,
      },
      {
  q: "What are the different user types?",
  a: (
    <>
      All-Rounder supports multiple user roles to ensure proper access and verification.
      <br />
      The main user types include:
      <br />
      • <strong>Students</strong> – to showcase skills and achievements
      <br />
      • <strong>Teachers</strong> – to verify and mentor students
      <br />
      • <strong>Schools</strong> – to manage and monitor student activities
      <br />
      • <strong>Organizations</strong> – to host events, competitions, and opportunities
    </>
  ),
}

    ],
  },
  {
    title: "Account & Verification",
    items: [
      {
        q: "How does student verification work?",
        a: `Student verification is handled through their registered educational institution.
        After signing up, students submit basic institutional details, which are reviewed by teachers or school administrators to confirm authenticity.
        This process ensures that all student profiles on the platform are genuine and trustworthy.`,
      },
      {
        q: "What employment proof do teachers need?",
        a: `Teachers are required to submit official employment proof issued by their school or educational institution.
            This may include appointment letters, staff ID details, or other recognized documents.
            Verification helps maintain credibility and prevents misuse of teacher privileges.`,
      },
       
      {
        q: "What happens when students turn 20?",
        a: `When students reach the age limit, their account is transitioned to alumni status.
            Their achievements, certifications, and participation history remain intact and accessible.
            This allows users to continue showcasing their journey even after leaving school.`,
      },
    ],
  },
  {
    title: "Features & Functionality",
    items: [
      {
        q: "What is the Talent Platform?",
        a: `The Talent Platform allows students to showcase their verified skills, achievements, and extracurricular involvement.
            Profiles can include competitions, volunteering, leadership roles, and certifications.
            This creates a digital portfolio that can be shared with schools, organizations, and future employers.`,
      },
      {
        q: "How does resource sharing work?",
        a: `Resource sharing enables users to upload and access learning materials such as textbooks, instruments, and sports equipment.
            Resources can be shared within the community to support collaborative learning.
            Uploaded content is moderated to maintain quality and relevance.`,
      },
      {
        q: "How do I register for competitions?",
        a: `Competition registrations are managed through the Events Hub.
            Students can browse upcoming events, check eligibility criteria, and register directly through the platform.
            Notifications and updates are sent once registration is confirmed.`,
      },
      {
        q: "What are digital badges?",
        a: `Digital badges are verified recognitions awarded for participation, achievements, and milestones.
            They act as visual proof of involvement and skill development.
            Badges are displayed on user profiles and can be shared externally.`,
      },
    ],
  },
  {
    title: "Privacy & Security",
    items: [
      {
        q: "Is my personal information safe?",
        a: `Yes, your personal data is protected using secure authentication and industry-standard security practices.
            Sensitive information is encrypted and access is strictly controlled.
            All-Rounder prioritizes user privacy and data protection.`,
      },
      {
        q: "Who can see my profile?",
        a: `Profile visibility depends on your selected privacy settings.
            You can choose whether your profile is public, restricted to institutions, or visible only to approved users.
            These settings can be changed at any time.`,
      },
      {
        q: "Can I delete my account?",
        a: `Yes, you can permanently delete your account from the account settings section.
            Once deleted, your personal data and profile information will be removed from the platform.
            This action is irreversible.`,
      },
    ],
  },
  {
    title: "Organizations & Events",
    items: [
      {
        q: "How can organizations post events?",
        a: `Organizations must first complete a verification process to ensure legitimacy.
            Once verified, they can create and publish events through their dashboard.
            Events become visible to eligible students across the platform.`,
      },
      {
        q: "What information should be included in an event?",
        a: `Each event should clearly include essential details such as the event date, venue, eligibility criteria, and a detailed description.
            Providing accurate information helps students understand and prepare effectively.
            Additional instructions or requirements can also be added.`,
      },
    ],
  },
  {
    title: "Technical Support",
    items: [
      {
        q: "I forgot my password. What should I do?",
        a: `If you forget your password, use the “Forgot Password” option on the login page.
        You will receive a password reset link via your registered email.
        Follow the instructions to securely create a new password.`,
      },
      {
        q: "The website isn’t loading properly. What should I do?",
        a: `Try refreshing the page first. 
            If it still doesn’t work, check your internet connection or use an updated browser. 
            If the problem continues, please contact support.`,
      },
      {
        q: "How do I report a bug or issue?",
        a: `You can report bugs or technical issues by contacting our support team via email.
            Please include screenshots or a clear description to help us resolve the issue faster.
            User feedback helps improve the platform continuously.`,
      },
    ],
  },
];
  return (
    <main className="bg-[var(--secondary-pale-lavender)] min-h-screen px-4">

      {/* HEADER */}
      <section ref={headerRef} className="relative bg-[#34365C] py-24 text-white w-screen -mx-4 overflow-hidden">
        {/* ⭐ Decorative Stars */}
{/*LEFT SIDE*/}
<span className="big-star float-star absolute top-20 left-10 text-4xl opacity-70">★</span>
<span className="big-star float-star absolute bottom-24 left-16 text-3xl opacity-60">★</span>

{/* RIGHT SIDE */}
<span className="big-star float-star absolute top-24 right-12 text-5xl opacity-80">★</span>
<span className="big-star float-star absolute bottom-20 right-20 text-4xl opacity-70">★</span>

{/* TOP */}
<span className="big-star float-star absolute top-8 left-1/3 text-3xl opacity-60">★</span>
<span className="big-star float-star absolute top-10 right-1/3 text-3xl opacity-60">★</span>



        <div className="text-center max-w-3xl mx-auto">
          <h1 className="help-hero-item text-6xl font-semibold mb-4">
            Need Help? <span className="text-[var(--primary-purple)]">We’re Here</span>
          </h1>

          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="help-hero-item relative z-10 mt-6 w-full max-w-xl rounded-xl px-5 py-4 text-white bg-white/10 border border-white/30"
          />
        </div>
      </section>

      {/* FAQ SECTIONS */}
      <div ref={faqContainerRef} className="max-w-4xl mx-auto mt-16 mb-24 space-y-8">
        {faqData.map((section, index) => {
          const filtered = filterItems(section.items);
          if (filtered.length === 0) return null;

          return (
            <FAQSection
              key={index}
              title={section.title}
              items={filtered}
            />
          );
        })}
      </div>

      {/* STILL NEED HELP */}
      <section ref={supportRef} className="max-w-4xl mx-auto mt-16 mb-16 rounded-2xl bg-[#2d337a] p-8 text-white shadow-lg">
       <h2 className="text-5xl font-semibold text-center mb-2">
            Still Need Help?
      </h2>

  <p className="text-center text-xl opacity-90 mb-6">
    Our support team is here to assist you. Reach out through any of these channels
  </p>

   <div className="grid md:grid-cols-3 gap-4">
  <div className="md:col-span-3 flex justify-center">
    <div className="bg-white/10 rounded-2xl p-5 text-center w-full max-w-sm">
      <div className="text-2xl mb-2">✉️</div>
      <p className="font-medium">Email Us</p>
      <a
        href="mailto:mail.allrounder.sdgp@gmail.com"
        className="text-sm opacity-90 hover:underline"
      >
        mail.allrounder.sdgp@gmail.com
      </a>
    </div>
  </div>
</div>

</section>

      <div className="h-24 bg-[var(--secondary-pale-lavender)]" />
    </main>
  );
}
