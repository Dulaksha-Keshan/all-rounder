// "use client";

// import { useState } from "react";
// import FaqItem from "./FAQItem";

// type FAQItemType = {
//   q: string;
//   a: React.ReactNode; // ✅ FIX
// };


// export default function FaqSection({
//   title,
//   items
// }: {
//   title: string;
//   items: { q: string; a: React.ReactNode }[];
// }) {
//   const [openIndex, setOpenIndex] = useState<number | null>(0);

//   return (
//     <div className="faq-section bg-[#F3EEFF] rounded-2xl shadow-sm p-6">
//       <h3 className="text-3xl font-semibold text-primary-dark mb-4">
//         {title}
//       </h3>

//       <div className="space-y-2">
//         {items.map((item, i) => (
//           <FaqItem
//             key={i}
//             {...item}
//             open={openIndex === i}
//             onClick={() =>
//               setOpenIndex(openIndex === i ? null : i)
//             }
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
// "use client";

// import FaqItem from "./FAQItem";

// export default function FaqSection({
//   title,
//   items,
// }: {
//   title: string;
//   items: { q: string; a: React.ReactNode }[];
// }) {
//   return (
//     <div className="faq-section bg-[#F3EEFF] rounded-2xl shadow-sm p-6">
//       <h3 className="text-3xl font-semibold text-primary-dark mb-6">
//         {title}
//       </h3>

//       <div className="space-y-4">
//         {items.map((item, i) => (
//           <FaqItem key={i} q={item.q} a={item.a} />
//         ))}
//       </div>
//     </div>
//   );
// }
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
    <div className="faq-section bg-[#F3EEFF] rounded-2xl shadow-sm p-6">
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
