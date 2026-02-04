"use client";

type FAQItemProps = {
  q: string;
  a: string;
  open: boolean;
  onClick: () => void;
};

export default function FAQItem({
  q,
  a,
  open,
  onClick,
}: FAQItemProps) {
  return (
    <div
      className="border rounded-xl px-4 py-3 cursor-pointer transition faq-item-card"
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium faq-question">{q}</p>

        <span
          className={`transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ⌄
        </span>
      </div>

      {open && (
        <p className="mt-3 text-base leading-relaxed faq-answer">
          {a}
        </p>
      )}
    </div>
  );
}
