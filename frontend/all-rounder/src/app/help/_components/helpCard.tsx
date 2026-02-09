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
        group relative bg-gradient-to-br from-[#F4F1FF] to-white rounded-2xl p-8 text-left border-2
        ${
          isActive
            ? "border-indigo-500 shadow-xl shadow-indigo-200/50 scale-105"
            : "border-indigo-200 hover:border-indigo-300"
        }
        hover:shadow-2xl hover:scale-105 hover:-translate-y-2
        transition-all duration-500 ease-out
        overflow-hidden
        w-full h-full
      `}
    >
      {/* Animated gradient overlay on hover */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-br from-indigo-400/0 to-purple-400/0 
        group-hover:from-indigo-400/5 group-hover:to-purple-400/5
        transition-all duration-500 rounded-2xl
      `}
      ></div>

      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-lg shadow-indigo-400/50"></div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with bounce animation */}
        <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#35355F] mb-3 group-hover:text-indigo-600 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>

        {/* Animated underline */}
        <div className="mt-4 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>

        {/* Arrow indicator */}
        <div className="mt-4 flex items-center gap-2 text-indigo-500 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
          <span className="text-sm font-semibold">Learn more</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Corner decoration */}
      <div
        className={`
        absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl 
        ${isActive ? "from-indigo-400/20" : "from-indigo-400/0 group-hover:from-indigo-400/10"}
        to-transparent rounded-tl-full transition-all duration-500
      `}
      ></div>
    </button>
  );
}
