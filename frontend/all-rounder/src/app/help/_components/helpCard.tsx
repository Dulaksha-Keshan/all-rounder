/*type HelpCardProps = {
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
}*/
export default function HelpCard() {
  return (
    <section className="gradient-purple-blue rounded-2xl p-8 text-white">
      <h3 className="text-2xl font-semibold mb-2">
        Still Need Help?
      </h3>

      <p className="text-white/80 mb-6">
        Our support team is here to assist you.
        Reach out through any of these channels.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-xl p-4">
          <p className="font-semibold">Email Us</p>
          <p className="text-sm opacity-80">
            mail.allrounder.sdgp@gmail.com
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <p className="font-semibold">Live Chat</p>
          <p className="text-sm opacity-80">
            Available 9 AM – 5 PM
          </p>
        </div>

        <div className="bg-white/10 rounded-xl p-4">
          <p className="font-semibold">Call Us</p>
          <p className="text-sm opacity-80">
            +94 71 093 2786
          </p>
        </div>
      </div>
    </section>
  );
}
