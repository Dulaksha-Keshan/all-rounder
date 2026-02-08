// 'use client';

// import { Search, X, Sparkles, Zap, Target, Trophy } from 'lucide-react';
// import { colors } from './types';

// interface HeroSectionProps {
//   searchQuery: string;
//   setSearchQuery: (query: string) => void;
//   resultsCount: number;
// }

// export const HeroSection = ({ searchQuery, setSearchQuery, resultsCount }: HeroSectionProps) => {
//   return (
//     <section className="hero-section">
//       <div className="hero-grid"></div>
//       <div className="hero-content">
//         <div className="hero-badge">
//           <Sparkles size={16} />
//           <span>Help Center</span>
//         </div>

//         <h1 className="hero-title">
//           How can we <span className="gradient-text">help you</span> today?
//         </h1>

//         <p className="hero-subtitle">
//           Everything you need to master the All-Rounder Platform
//         </p>

//         {/* Search Bar */}
//         <div className="search-wrapper">
//           <div className="search-container">
//             <Search className="search-icon" size={20} />
//             <input
//               type="text"
//               placeholder="Search anything..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />
//             {searchQuery && (
//               <button 
//                 className="clear-search" 
//                 onClick={() => setSearchQuery('')}
//                 aria-label="Clear search"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//           {searchQuery && (
//             <div className="search-results-count">
//               {resultsCount} result{resultsCount !== 1 ? 's' : ''} found
//             </div>
//           )}
//         </div>

//         {/* Quick Stats */}
//         <div className="stats-grid">
//           <div className="stat-item">
//             <Zap size={20} />
//             <div>
//               <div className="stat-value">2.5k+</div>
//               <div className="stat-label">Active Users</div>
//             </div>
//           </div>
//           <div className="stat-item">
//             <Target size={20} />
//             <div>
//               <div className="stat-value">150+</div>
//               <div className="stat-label">Schools</div>
//             </div>
//           </div>
//           <div className="stat-item">
//             <Trophy size={20} />
//             <div>
//               <div className="stat-value">500+</div>
//               <div className="stat-label">Achievements</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };