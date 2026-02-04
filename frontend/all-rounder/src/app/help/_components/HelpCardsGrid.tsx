/*import HelpCard from "./helpCard";

type HelpType = "student" | "teacher" | "admin" | "resource";

type HelpCardsGridProps = {
  activeHelp: HelpType | null;
  onSelect: (type: HelpType) => void;
};

export default function HelpCardsGrid({
  activeHelp,
  onSelect,
}: HelpCardsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <HelpCard
        title="Student Help"
        description="Help related to student profiles and achievements."
        icon="🎓"
        isActive={activeHelp === "student"}
        onClick={() => onSelect("student")}
      />

      <HelpCard
        title="Teacher Help"
        description="Guidance for verifying and managing students."
        icon="👩‍🏫"
        isActive={activeHelp === "teacher"}
        onClick={() => onSelect("teacher")}
      />

      <HelpCard
        title="School Admin Help"
        description="Support for managing school-level operations."
        icon="🏫"
        isActive={activeHelp === "admin"}
        onClick={() => onSelect("admin")}
      />

      <HelpCard
        title="Resource Sharing Help"
        description="FAQs about uploading and accessing learning resources."
        icon="📚"
        isActive={activeHelp === "resource"}
        onClick={() => onSelect("resource")}
      />
    </div>
  );
}*/

import HelpCard from "./helpCard";

const helpSections = [
  {
    title: "Getting Started",
    items: [
      {
        question: "What is All-Rounder?",
        answer:
          "All-Rounder is a student extracurricular activity platform connecting students, teachers, schools, and organizations."
      },
      {
        question: "How do I create an account?",
        answer: "Click Sign Up and follow the registration steps."
      }
    ]
  },
  {
    title: "Technical Support",
    items: [
      {
        question: "I forgot my password. What should I do?",
        answer: "Use the Forgot Password option on the login page."
      }
    ]
  }
];

export default function HelpCardGrid() {
  return (
    <div className="space-y-6">
      {helpSections.map((section, index) => (
        <HelpCard key={index} section={section} />
      ))}
    </div>
  );
}
