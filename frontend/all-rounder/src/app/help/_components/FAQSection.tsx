
"use client";

import { useState } from "react";
import FAQItem from "./FAQItem";

type Item = {
  q: string;
  a: React.ReactNode;
};

export default function FAQSection({
  title,
  items,
}: {
  title: string;
  items: Item[];
}) {
  // ❗ null = all closed initially
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-section surface-readable-strong rounded-2xl p-6">
      <h3 className="text-3xl font-semibold text-[#34365C] mb-6">
        {title}
      </h3>

      <div className="space-y-3">
        {items.map((item, index) => (
          <FAQItem
            key={index}
            q={item.q}
            a={item.a}
            open={openIndex === index}
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
          />
        ))}
      </div>
    </div>
  );
}
