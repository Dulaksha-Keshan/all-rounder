"use client";

import { useState } from "react";
import FaqItem from "./FAQItem";

export default function FaqSection({
  title,
  items
}: {
  title: string;
  items: { q: string; a: string }[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-3xl font-semibold text-primary-dark mb-4">
        {title}
      </h3>

      <div className="space-y-2">
        {items.map((item, i) => (
          <FaqItem
            key={i}
            {...item}
            open={openIndex === i}
            onClick={() =>
              setOpenIndex(openIndex === i ? null : i)
            }
          />
        ))}
      </div>
    </div>
  );
}
