// 'use client';

// import { useState } from 'react';
// import { ChevronDown, Search } from 'lucide-react';
// import { FAQItem } from './types';

// interface FAQSectionProps {
//   faqData: FAQItem[];
//   filteredFAQs: FAQItem[];
//   selectedCategory: string;
//   setSelectedCategory: (category: string) => void;
// }

// export const FAQSection = ({ 
//   faqData, 
//   filteredFAQs, 
//   selectedCategory, 
//   setSelectedCategory 
// }: FAQSectionProps) => {
//   const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  
//   const categories = ['All', ...Array.from(new Set(faqData.map(faq => faq.category)))];

//   return (
//     <section className="faq-section">
//       <div className="container">
//         <div className="section-header">
//           <h2 className="section-title">Frequently Asked Questions</h2>
//           <p className="section-subtitle">Find answers to common questions</p>
//         </div>

//         {/* Category Pills */}
//         <div className="category-filter">
//           {categories.map((category) => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
//             >
//               {category}
//             </button>
//           ))}
//         </div>

//         {/* FAQ List */}
//         <div className="faq-list">
//           {filteredFAQs.map((faq, index) => (
//             <div 
//               key={index} 
//               className={`faq-item ${openFAQ === index ? 'open' : ''}`}
//             >
//               <button
//                 className="faq-question"
//                 onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
//               >
//                 <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
//                 <span className="faq-text">{faq.question}</span>
//                 <div className="faq-icon-wrapper">
//                   <ChevronDown size={20} className="faq-icon" />
//                 </div>
//               </button>
//               <div className="faq-answer-wrapper">
//                 <div className="faq-answer">
//                   <p>{faq.answer}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {filteredFAQs.length === 0 && (
//           <div className="no-results">
//             <div className="no-results-icon">
//               <Search size={48} />
//             </div>
//             <h3>No results found</h3>
//             <p>Try adjusting your search or browse by category</p>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// };