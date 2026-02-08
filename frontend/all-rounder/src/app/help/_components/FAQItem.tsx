// "use client";

// type FAQItemProps = {
//   q: string;
//   a: React.ReactNode;
//   //open: boolean;
//   //onClick: () => void;
// };

// export default function FAQItem({
//   q,
//   a,
//   //open,
//   //onClick,
// }: 
// FAQItemProps) {
//   return (
//     <div
//       className="faq-item-card border rounded-xl px-4 py-3 cursor-pointer transition faq-item-card"
//       onClick={onClick}
//     >
//       <div className="flex justify-between items-center">
//         <p className="text-lg font-medium faq-question">{q}</p>

//         <span
//           className={`transition-transform ${
//             open ? "rotate-180" : ""
//           }`}
//         >
//           ⌄
//         </span>
//       </div>

//       {open && (
//         <p className="mt-3 text-base leading-relaxed faq-answer">
//           {a}
//         </p>
//       )}
//     </div>
//   );
// }
// export default function FAQItem({ q, a }: FAQItemProps) {
//   return (
//     <div className="faq-item-card bg-white border border-[#34365C]/20 rounded-xl px-4 py-4">
//       <p className="text-lg font-semibold text-[#34365C]">
//         {q}
//       </p>

//       <div className="mt-3 text-base leading-relaxed text-[#505485]">
//         {a}
//       </div>
//     </div>
//   );
// }
// "use client";

// type FAQItemProps = {
//   q: string;
//   a: React.ReactNode;
// };

// export default function FAQItem({ q, a }: FAQItemProps) {
//   return (
//     <div className="faq-item-card bg-white border border-[#34365C]/20 rounded-xl px-4 py-4">
//       <p className="text-lg font-semibold text-[#34365C]">
//         {q}
//       </p>

//       <div className="mt-3 text-base leading-relaxed text-[#505485]">
//         {a}
//       </div>
//     </div>
//   );
// }
"use client";

type FAQItemProps = {
  q: string;
  a: React.ReactNode;
  open: boolean;
  onClick: () => void;
};

export default function FAQItem({ q, a, open, onClick }: FAQItemProps) {
  return (
    <div
      className="faq-item-card bg-white border border-[#34365C]/20 rounded-xl px-5 py-4 cursor-pointer transition"
      onClick={onClick}
    >
      {/* QUESTION */}
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium text-[#34365C]">
          {q}
        </p>

        <span
          className={`transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ⌄
        </span>
      </div>

      {/* ANSWER (DROPDOWN) */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? "grid-rows-[1fr] mt-3" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden text-[#505485] leading-relaxed">
          {a}
        </div>
      </div>
    </div>
  );
}
