type HelpCardProps = {
  title: string;
  description: string;
  icon: string;
  isActive?: boolean;
  onClick: () => void;
};

export default function HelpCard({
  title,
  description,
  icon,
  isActive,
  onClick,
}: HelpCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-[#F4F1FF] rounded-2xl p-6 text-left border
        ${isActive
          ? "border-indigo-500 ring-2 ring-indigo-200"
          : "border-indigo-200"}
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
      `}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-[#35355F]">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mt-2">
        {description}
      </p>
    </button>
  );
}

