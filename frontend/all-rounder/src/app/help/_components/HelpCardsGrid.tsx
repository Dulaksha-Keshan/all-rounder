import HelpCard from "./helpCard";

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
}
