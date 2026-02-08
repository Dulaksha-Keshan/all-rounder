// 'use client';

// import { useState } from 'react';
// import { Check, ArrowRight, X } from 'lucide-react';
// import { HelpSection } from './types';

// interface ExploreByRoleProps {
//   helpSections: HelpSection[];
// }

// export const ExploreByRole = ({ helpSections }: ExploreByRoleProps) => {
//   const [selectedSection, setSelectedSection] = useState<HelpSection | null>(null);

//   return (
//     <>
//       <section className="quick-help-section">
//         <div className="container">
//           <div className="section-header">
//             <h2 className="section-title">Explore by Role</h2>
//             <p className="section-subtitle">Choose your path to get started</p>
//           </div>

//           <div className="help-grid">
//             {helpSections.map((section, index) => (
//               <div 
//                 key={index} 
//                 className="help-card"
//                 onClick={() => setSelectedSection(section)}
//                 style={{ cursor: 'pointer' }}
//               >
//                 <div className="help-card-glow"></div>
//                 <div 
//                   className="help-card-icon"
//                   style={{ background: section.gradient }}
//                 >
//                   {section.icon}
//                 </div>
//                 <h3 className="help-card-title">{section.title}</h3>
//                 <p className="help-card-description">{section.description}</p>
//                 <ul className="help-card-links">
//                   {section.links.map((link, linkIndex) => (
//                     <li key={linkIndex}>
//                       <a 
//                         href={link.href} 
//                         className="help-link"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <Check size={14} />
//                         <span>{link.label}</span>
//                         <ArrowRight size={14} className="link-arrow" />
//                       </a>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Modal */}
//       {selectedSection && (
//         <div className="modal-overlay" onClick={() => setSelectedSection(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <button 
//               className="modal-close"
//               onClick={() => setSelectedSection(null)}
//               aria-label="Close modal"
//             >
//               <X size={24} />
//             </button>
            
//             <div 
//               className="modal-icon"
//               style={{ background: selectedSection.gradient }}
//             >
//               {selectedSection.icon}
//             </div>
            
//             <h2 className="modal-title">{selectedSection.title}</h2>
            
//             <p className="modal-description">{selectedSection.content}</p>
            
//             <div className="modal-links">
//               <h3 className="modal-links-title">Quick Links</h3>
//               <ul className="modal-links-list">
//                 {selectedSection.links.map((link, index) => (
//                   <li key={index}>
//                     <a href={link.href} className="modal-link">
//                       <Check size={16} />
//                       <span>{link.label}</span>
//                       <ArrowRight size={16} />
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };