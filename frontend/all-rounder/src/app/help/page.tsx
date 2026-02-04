"use client";

import { useState } from "react";
import FAQSection from "./_components/FAQSection";

type FAQItemType = {
  q: string;
  a: string;
};

export default function HelpPage() {
  const [search, setSearch] = useState("");

  // 🔍 Filter logic (searches both question & answer)
  const filterItems = (items: FAQItemType[]) => {
    if (!search.trim()) return items;

    return items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    );
  };

  // 📦 FAQ DATA (clean & reusable)
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
        a: `All-Rounder supports multiple user roles to ensure proper access and verification.

The main user types include:
• Students – to showcase skills and achievements
• Teachers – to verify and mentor students
• Schools – to manage and monitor student activities
• Organizations – to host events, competitions, and opportunities`,
      },
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
        a: `Resource sharing enables users to upload and access learning materials such as notes, guides, and reference content.
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
        a: `First, try refreshing the page or clearing your browser cache.
        Ensure you have a stable internet connection and are using an updated browser.
        If the issue persists, contact our support team.`,
      },
      {
        q: "How do I report a bug or issue?",
        a: `You can report bugs or technical issues by contacting our support team via email or live chat.
            Please include screenshots or a clear description to help us resolve the issue faster.
            User feedback helps improve the platform continuously.`,
      },
    ],
  },
];

  return (
    <main className="bg-[var(--secondary-pale-lavender)] min-h-screen py-16 px-4">
      {/* HEADER */}
      <section className="text-center max-w-3xl mx-auto mb-12">
        <div className="mx-auto w-14 h-14 rounded-full gradient-purple-blue flex items-center justify-center text-white text-xl mb-4">
          ?
        </div>

        <h1 className="text-7xl font-semibold text-primary-dark mb-2">
          Need Help? We're Here!
        </h1>

        <p className="text-gray-600 text-lg">
          Find answers to frequently asked questions about All-Rounder.
          Can’t find what you’re looking for? Contact our support team below.
        </p>

        {/* 🔍 SEARCH BAR */}
        <input
          type="text"
          placeholder="Search for questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[var(--primary-purple)]"
        />
      </section>

      {/* FAQ SECTIONS */}
      <div className="max-w-4xl mx-auto space-y-8">
        {faqData.map((section, index) => {
          const filteredItems = filterItems(section.items);

          if (filteredItems.length === 0) return null;

          return (
            <FAQSection
              key={index}
              title={section.title}
              items={filteredItems}
            />
          );
        })}
      </div>
      {/* STILL NEED HELP SECTION */}
<section className="max-w-4xl mx-auto mt-16 rounded-2xl gradient-purple-blue p-8 text-white shadow-lg">
  <h2 className="text-5xl font-semibold text-center mb-2">
    Still Need Help?
  </h2>

  <p className="text-center text-xl opacity-90 mb-6">
    Our support team is here to assist you. Reach out through any of these channels
  </p>

  <div className="grid md:grid-cols-3 gap-4">
    {/* Email */}
    <div className="bg-white/10 rounded-2xl p-5 text-center">
      <div className="text-2xl mb-2">✉️</div>
      <p className="font-medium ">Email Us</p>
      <p className="text-sm opacity-90">
        mail.allrounder.sdgp@gmail.com
      </p>
    </div>

    {/* Live Chat */}
    <div className="bg-white/10 rounded-2xl p-5 text-center">
      <div className="text-2xl mb-2">💬</div>
      <p className="font-medium">Live Chat</p>
      <p className="text-sm opacity-90">
        Available 9 AM – 5 PM
      </p>
    </div>

    {/* Call */}
    <div className="bg-white/10 rounded-2xl p-5 text-center">
      <div className="text-2xl mb-2">📞</div>
      <p className="font-medium">Call Us</p>
      <p className="text-sm opacity-90">
        +94 71 090 3786
      </p>
    </div>
  </div>
</section>

    </main>
  );
}
