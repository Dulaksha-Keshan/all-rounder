// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { 
// //   ChevronDown, 
// //   Search, 
// //   Users, 
// //   Award, 
// //   School, 
// //   BookOpen, 
// //   MessageCircle,
// //   Sparkles,
// //   Zap,
// //   Target,
// //   ArrowRight,
// //   Check,
// //   X,
// //   Trophy
// // } from 'lucide-react';

// // const colors = {
// //   astralBlue: '#8387CC',
// //   lightLavender: '#DCD0FF',
// //   deepIndigo: '#34365C',
// //   ghostWhite: '#F8F8FF',
// //   royalBlue: '#4169E1'
// // };

// // interface FAQItem {
// //   question: string;
// //   answer: string;
// //   category: string;
// // }

// // interface HelpSection {
// //   icon: React.ReactNode;
// //   title: string;
// //   description: string;
// //   links: { label: string; href: string }[];
// //   gradient: string;
// // }

// // const faqData: FAQItem[] = [
// //   {
// //     question: "What is the All-Rounder Platform?",
// //     answer: "All-Rounder is Sri Lanka's national talent ecosystem - a student-centric digital platform where students can record, showcase, and verify their extracurricular achievements. It connects students, teachers, schools, and organizations in one unified system, ensuring that every student's potential is seen, verified, and valued.",
// //     category: "Getting Started"
// //   },
// //   {
// //     question: "How do I create a student profile?",
// //     answer: "To create your profile: 1) Click 'Sign Up' and select 'Student', 2) Fill in your basic information and school details, 3) Verify your email address, 4) Add your achievements in sports, arts, and extracurricular activities, 5) Request verification from your teachers or school administrators. Your profile will become visible once verified.",
// //     category: "Getting Started"
// //   },
// //   {
// //     question: "How does the verification system work?",
// //     answer: "Our verification system ensures authenticity and trust. Teachers and schools are verified through official documentation. Student achievements can be confirmed by authorized teachers or institutional representatives. This prevents false claims and ensures that universities, sponsors, and organizations can confidently rely on the information presented.",
// //     category: "Verification"
// //   },
// //   {
// //     question: "Can my school share resources with other schools?",
// //     answer: "Yes! The platform encourages collaboration through our Resource Sharing feature. Schools can post specific resource requirements (sports equipment, art materials, training facilities), and other schools or institutions with surplus resources can contribute. This builds a culture of mutual support, especially benefiting under-resourced schools.",
// //     category: "For Schools"
// //   },
// //   {
// //     question: "How do leaderboards work?",
// //     answer: "Leaderboards rank students and schools based on verified achievements across sports, arts, and extracurricular activities. They encourage healthy competition, transparency, and motivation while making talent easily discoverable. Rankings are updated regularly based on new verified achievements and participation.",
// //     category: "Features"
// //   },
// //   {
// //     question: "How can I find competitions and events?",
// //     answer: "Visit the Competitions Hub to explore upcoming opportunities across academics, sports, arts, and extracurricular domains. Each event listing includes eligibility criteria, timelines, requirements, and official registration links. The platform centralizes information so you never miss an opportunity, regardless of your location or school background.",
// //     category: "Opportunities"
// //   },
// //   {
// //     question: "What partnerships does the platform offer?",
// //     answer: "We partner with universities, NGOs, companies, and professional organizations to provide students with workshops, competitions, mentorship programs, internships, and scholarships. These partnerships bridge the gap between school-level talent and real-world opportunities, helping students explore career pathways early.",
// //     category: "Opportunities"
// //   },
// //   {
// //     question: "What are digital badges and how do I earn them?",
// //     answer: "Digital badges are rewards for your achievements and consistent engagement. You earn badges by: participating in verified competitions, achieving milestones in your talent areas, maintaining an active and verified profile, and contributing to the community. Badges boost your profile's credibility and are visible to universities and organizations.",
// //     category: "Features"
// //   },
// //   {
// //     question: "Is my information secure on the platform?",
// //     answer: "Yes, we take security seriously. All user data is encrypted and stored securely. Only verified users can access the platform, and students have control over what information is publicly visible. Schools and teachers can only verify achievements they have direct knowledge of, ensuring accountability.",
// //     category: "Privacy & Security"
// //   },
// //   {
// //     question: "How can teachers verify student achievements?",
// //     answer: "Teachers with verified accounts can: 1) Navigate to the student's profile, 2) Review the achievement details submitted by the student, 3) Confirm authenticity if the achievement occurred under their supervision or awareness, 4) Add verification notes if needed. Your verification adds credibility to the student's profile.",
// //     category: "For Teachers"
// //   },
// //   {
// //     question: "Can universities access student profiles?",
// //     answer: "Yes, partner universities and organizations can view verified student profiles to discover talented individuals. However, students maintain privacy controls and can choose which achievements are publicly visible. Only verified achievements are shown, ensuring universities access accurate, trustworthy information.",
// //     category: "For Organizations"
// //   },
// //   {
// //     question: "I forgot my password. What should I do?",
// //     answer: "Click 'Forgot Password' on the login page, enter your registered email address, and follow the password reset instructions sent to your email. If you don't receive the email within 5 minutes, check your spam folder or contact support at support@allrounder.lk",
// //     category: "Account Issues"
// //   }
// // ];

// // const helpSections: HelpSection[] = [
// //   {
// //     icon: <Users size={28} strokeWidth={1.5} />,
// //     title: "For Students",
// //     description: "Discover how to showcase your talents and unlock opportunities",
// //     gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
// //     links: [
// //       { label: "Creating Your Profile", href: "#create-profile" },
// //       { label: "Adding Achievements", href: "#add-achievements" },
// //       { label: "Getting Verified", href: "#verification" },
// //       { label: "Exploring Competitions", href: "#competitions" }
// //     ]
// //   },
// //   {
// //     icon: <School size={28} strokeWidth={1.5} />,
// //     title: "For Schools",
// //     description: "Elevate your institution's presence and empower student growth",
// //     gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
// //     links: [
// //       { label: "School Registration", href: "#school-registration" },
// //       { label: "Managing Student Profiles", href: "#manage-students" },
// //       { label: "Resource Sharing", href: "#resources" },
// //       { label: "Leaderboard Rankings", href: "#rankings" }
// //     ]
// //   },
// //   {
// //     icon: <BookOpen size={28} strokeWidth={1.5} />,
// //     title: "For Teachers",
// //     description: "Guide and authenticate your students' remarkable achievements",
// //     gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
// //     links: [
// //       { label: "Teacher Verification", href: "#teacher-verification" },
// //       { label: "Verifying Achievements", href: "#verify-achievements" },
// //       { label: "Supporting Students", href: "#support" },
// //       { label: "Using the Dashboard", href: "#dashboard" }
// //     ]
// //   },
// //   {
// //     icon: <Award size={28} strokeWidth={1.5} />,
// //     title: "For Organizations",
// //     description: "Connect with verified talent and build meaningful partnerships",
// //     gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
// //     links: [
// //       { label: "Partnership Programs", href: "#partnerships" },
// //       { label: "Posting Opportunities", href: "#post-opportunities" },
// //       { label: "Accessing Talent Pool", href: "#talent-pool" },
// //       { label: "Event Management", href: "#events" }
// //     ]
// //   }
// // ];

// // const HelpPage = () => {
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [openFAQ, setOpenFAQ] = useState<number | null>(null);
// //   const [selectedCategory, setSelectedCategory] = useState<string>('All');
// //   const [mounted, setMounted] = useState(false);

// //   const categories = ['All', ...Array.from(new Set(faqData.map(faq => faq.category)))];

// //   const filteredFAQs = faqData.filter(faq => {
// //     const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
// //     const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
// //     return matchesSearch && matchesCategory;
// //   });

// //   useEffect(() => {
// //     setMounted(true);
// //   }, []);

// //   if (!mounted) return null;

// //   return (
// //     <>
// //       <style jsx global>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

// //         * {
// //           margin: 0;
// //           padding: 0;
// //           box-sizing: border-box;
// //         }

// //         body {
// //           margin: 0;
// //           padding: 0;
// //         }

// //         .help-page {
// //           font-family: 'Outfit', system-ui, -apple-system, sans-serif;
// //           color: ${colors.deepIndigo};
// //           background: ${colors.ghostWhite};
// //           min-height: 100vh;
// //           position: relative;
// //           overflow-x: hidden;
// //         }

// //         /* Background Orbs */
// //         .background-container {
// //           position: fixed;
// //           top: 0;
// //           left: 0;
// //           width: 100%;
// //           height: 100%;
// //           pointer-events: none;
// //           z-index: 0;
// //           overflow: hidden;
// //         }

// //         .orb {
// //           position: absolute;
// //           border-radius: 50%;
// //           filter: blur(100px);
// //           opacity: 0.2;
// //           animation: float 20s ease-in-out infinite;
// //         }

// //         .orb-1 {
// //           width: 600px;
// //           height: 600px;
// //           background: ${colors.royalBlue};
// //           top: -200px;
// //           right: -200px;
// //         }

// //         .orb-2 {
// //           width: 500px;
// //           height: 500px;
// //           background: ${colors.astralBlue};
// //           bottom: -150px;
// //           left: -150px;
// //           animation-delay: -7s;
// //         }

// //         .orb-3 {
// //           width: 400px;
// //           height: 400px;
// //           background: ${colors.lightLavender};
// //           top: 50%;
// //           left: 50%;
// //           transform: translate(-50%, -50%);
// //           animation-delay: -14s;
// //         }

// //         @keyframes float {
// //           0%, 100% { transform: translate(0, 0); }
// //           33% { transform: translate(50px, -50px); }
// //           66% { transform: translate(-30px, 30px); }
// //         }

// //         /* Hero Section */
// //         .hero-section {
// //           position: relative;
// //           padding: 120px 24px 160px;
// //           background: linear-gradient(180deg, ${colors.deepIndigo} 0%, #2a2c4e 100%);
// //           overflow: hidden;
// //           z-index: 1;
// //         }

// //         .hero-grid {
// //           position: absolute;
// //           top: 0;
// //           left: 0;
// //           right: 0;
// //           bottom: 0;
// //           background-image: 
// //             linear-gradient(rgba(131, 135, 204, 0.1) 1px, transparent 1px),
// //             linear-gradient(90deg, rgba(131, 135, 204, 0.1) 1px, transparent 1px);
// //           background-size: 50px 50px;
// //           opacity: 0.3;
// //           animation: gridMove 20s linear infinite;
// //         }

// //         @keyframes gridMove {
// //           0% { transform: translate(0, 0); }
// //           100% { transform: translate(50px, 50px); }
// //         }

// //         .hero-content {
// //           max-width: 900px;
// //           margin: 0 auto;
// //           text-align: center;
// //           position: relative;
// //           z-index: 2;
// //         }

// //         .hero-badge {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 8px;
// //           padding: 10px 24px;
// //           background: rgba(255, 255, 255, 0.1);
// //           border: 1px solid rgba(255, 255, 255, 0.2);
// //           border-radius: 100px;
// //           color: white;
// //           font-size: 14px;
// //           font-weight: 600;
// //           letter-spacing: 0.5px;
// //           margin-bottom: 32px;
// //           backdrop-filter: blur(10px);
// //           animation: badgeFloat 3s ease-in-out infinite;
// //         }

// //         @keyframes badgeFloat {
// //           0%, 100% { transform: translateY(0px); }
// //           50% { transform: translateY(-5px); }
// //         }

// //         .hero-title {
// //           font-size: clamp(40px, 7vw, 72px);
// //           font-weight: 900;
// //           color: white;
// //           margin: 0 0 24px;
// //           line-height: 1.1;
// //           letter-spacing: -2px;
// //         }

// //         .gradient-text {
// //           background: linear-gradient(135deg, ${colors.astralBlue}, ${colors.royalBlue}, #9d7bff);
// //           background-size: 200% 200%;
// //           -webkit-background-clip: text;
// //           -webkit-text-fill-color: transparent;
// //           background-clip: text;
// //           animation: gradientShift 5s ease infinite;
// //         }

// //         @keyframes gradientShift {
// //           0%, 100% { background-position: 0% 50%; }
// //           50% { background-position: 100% 50%; }
// //         }

// //         .hero-subtitle {
// //           font-size: 20px;
// //           color: rgba(255, 255, 255, 0.7);
// //           margin: 0 0 48px;
// //           line-height: 1.6;
// //           font-weight: 400;
// //         }

// //         /* Search */
// //         .search-wrapper {
// //           margin-bottom: 48px;
// //         }

// //         .search-container {
// //           position: relative;
// //           max-width: 700px;
// //           margin: 0 auto;
// //         }

// //         .search-icon {
// //           position: absolute;
// //           left: 24px;
// //           top: 50%;
// //           transform: translateY(-50%);
// //           color: ${colors.astralBlue};
// //           z-index: 2;
// //         }

// //         .search-input {
// //           width: 100%;
// //           padding: 20px 60px 20px 60px;
// //           border: 2px solid rgba(255, 255, 255, 0.1);
// //           border-radius: 16px;
// //           font-size: 16px;
// //           font-weight: 500;
// //           background: rgba(255, 255, 255, 0.95);
// //           backdrop-filter: blur(20px);
// //           box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
// //           transition: all 0.4s ease;
// //           color: ${colors.deepIndigo};
// //         }

// //         .search-input:focus {
// //           outline: none;
// //           border-color: ${colors.royalBlue};
// //           box-shadow: 0 24px 70px rgba(65, 105, 225, 0.3);
// //           transform: translateY(-2px);
// //         }

// //         .search-input::placeholder {
// //           color: #999;
// //         }

// //         .clear-search {
// //           position: absolute;
// //           right: 20px;
// //           top: 50%;
// //           transform: translateY(-50%);
// //           background: ${colors.lightLavender};
// //           border: none;
// //           width: 32px;
// //           height: 32px;
// //           border-radius: 50%;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           cursor: pointer;
// //           transition: all 0.3s ease;
// //           color: ${colors.deepIndigo};
// //         }

// //         .clear-search:hover {
// //           background: ${colors.astralBlue};
// //           color: white;
// //           transform: translateY(-50%) rotate(90deg);
// //         }

// //         .search-results-count {
// //           text-align: center;
// //           margin-top: 16px;
// //           font-size: 14px;
// //           color: rgba(255, 255, 255, 0.6);
// //           animation: fadeIn 0.3s ease;
// //         }

// //         @keyframes fadeIn {
// //           from { opacity: 0; transform: translateY(-10px); }
// //           to { opacity: 1; transform: translateY(0); }
// //         }

// //         /* Stats Grid */
// //         .stats-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
// //           gap: 24px;
// //           max-width: 700px;
// //           margin: 0 auto;
// //         }

// //         .stat-item {
// //           display: flex;
// //           align-items: center;
// //           gap: 12px;
// //           padding: 20px 24px;
// //           background: rgba(255, 255, 255, 0.1);
// //           border: 1px solid rgba(255, 255, 255, 0.15);
// //           border-radius: 12px;
// //           backdrop-filter: blur(10px);
// //           color: white;
// //           transition: all 0.3s ease;
// //         }

// //         .stat-item:hover {
// //           background: rgba(255, 255, 255, 0.15);
// //           transform: translateY(-2px);
// //         }

// //         .stat-value {
// //           font-size: 24px;
// //           font-weight: 800;
// //           line-height: 1;
// //         }

// //         .stat-label {
// //           font-size: 12px;
// //           opacity: 0.7;
// //           font-weight: 500;
// //         }

// //         /* Container */
// //         .container {
// //           max-width: 1300px;
// //           margin: 0 auto;
// //           padding: 0 24px;
// //           position: relative;
// //           z-index: 1;
// //         }

// //         /* Section Headers */
// //         .section-header {
// //           text-align: center;
// //           margin-bottom: 64px;
// //         }

// //         .section-title {
// //           font-size: clamp(32px, 5vw, 48px);
// //           font-weight: 800;
// //           color: ${colors.deepIndigo};
// //           margin: 0 0 16px;
// //           letter-spacing: -1px;
// //         }

// //         .section-subtitle {
// //           font-size: 18px;
// //           color: #666;
// //           margin: 0;
// //           font-weight: 500;
// //         }

// //         /* Quick Help Section */
// //         .quick-help-section {
// //           padding: 100px 24px;
// //           margin-top: -80px;
// //           position: relative;
// //           z-index: 1;
// //         }

// //         .help-grid {
// //           display: grid;
// //           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
// //           gap: 32px;
// //         }

// //         .help-card {
// //           position: relative;
// //           background: white;
// //           padding: 40px 32px;
// //           border-radius: 24px;
// //           border: 1px solid rgba(220, 208, 255, 0.3);
// //           transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
// //           overflow: hidden;
// //         }

// //         .help-card::before {
// //           content: '';
// //           position: absolute;
// //           top: 0;
// //           left: 0;
// //           right: 0;
// //           height: 3px;
// //           background: linear-gradient(90deg, ${colors.astralBlue}, ${colors.royalBlue});
// //           transform: scaleX(0);
// //           transition: transform 0.5s ease;
// //         }

// //         .help-card:hover::before {
// //           transform: scaleX(1);
// //         }

// //         .help-card:hover {
// //           transform: translateY(-8px);
// //           box-shadow: 0 24px 60px rgba(0, 0, 0, 0.12);
// //           border-color: ${colors.astralBlue};
// //         }

// //         .help-card-glow {
// //           position: absolute;
// //           top: 0;
// //           left: 0;
// //           right: 0;
// //           bottom: 0;
// //           background: radial-gradient(circle at top, rgba(220, 208, 255, 0.2), transparent 70%);
// //           opacity: 0;
// //           transition: opacity 0.5s ease;
// //           pointer-events: none;
// //         }

// //         .help-card:hover .help-card-glow {
// //           opacity: 1;
// //         }

// //         .help-card-icon {
// //           width: 72px;
// //           height: 72px;
// //           border-radius: 18px;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           color: white;
// //           margin-bottom: 24px;
// //           box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
// //           transition: all 0.4s ease;
// //         }

// //         .help-card:hover .help-card-icon {
// //           transform: scale(1.1) rotate(5deg);
// //           box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
// //         }

// //         .help-card-title {
// //           font-size: 24px;
// //           font-weight: 700;
// //           color: ${colors.deepIndigo};
// //           margin: 0 0 12px;
// //           letter-spacing: -0.5px;
// //         }

// //         .help-card-description {
// //           font-size: 15px;
// //           color: #666;
// //           margin: 0 0 28px;
// //           line-height: 1.6;
// //         }

// //         .help-card-links {
// //           list-style: none;
// //           padding: 0;
// //           margin: 0;
// //         }

// //         .help-card-links li {
// //           margin-bottom: 12px;
// //         }

// //         .help-link {
// //           display: flex;
// //           align-items: center;
// //           gap: 10px;
// //           color: ${colors.deepIndigo};
// //           text-decoration: none;
// //           font-size: 15px;
// //           font-weight: 600;
// //           transition: all 0.3s ease;
// //           padding: 8px 0;
// //         }

// //         .help-link svg:first-child {
// //           color: ${colors.royalBlue};
// //           flex-shrink: 0;
// //         }

// //         .link-arrow {
// //           margin-left: auto;
// //           opacity: 0;
// //           transform: translateX(-10px);
// //           transition: all 0.3s ease;
// //         }

// //         .help-link:hover {
// //           color: ${colors.royalBlue};
// //           padding-left: 8px;
// //         }

// //         .help-link:hover .link-arrow {
// //           opacity: 1;
// //           transform: translateX(0);
// //         }

// //         /* FAQ Section */
// //         .faq-section {
// //           padding: 80px 24px 100px;
// //           background: linear-gradient(180deg, ${colors.ghostWhite}, white);
// //           position: relative;
// //           z-index: 1;
// //         }

// //         .category-filter {
// //           display: flex;
// //           flex-wrap: wrap;
// //           gap: 12px;
// //           justify-content: center;
// //           margin-bottom: 56px;
// //         }

// //         .category-pill {
// //           position: relative;
// //           padding: 12px 28px;
// //           border: 2px solid ${colors.lightLavender};
// //           background: white;
// //           border-radius: 100px;
// //           font-size: 15px;
// //           font-weight: 600;
// //           color: ${colors.deepIndigo};
// //           cursor: pointer;
// //           transition: all 0.4s ease;
// //           box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
// //         }

// //         .category-pill:hover {
// //           transform: translateY(-2px);
// //           box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
// //           border-color: ${colors.astralBlue};
// //         }

// //         .category-pill.active {
// //           background: linear-gradient(135deg, ${colors.royalBlue}, ${colors.astralBlue});
// //           color: white;
// //           border-color: ${colors.royalBlue};
// //           box-shadow: 0 8px 24px rgba(65, 105, 225, 0.3);
// //         }

// //         .faq-list {
// //           max-width: 950px;
// //           margin: 0 auto;
// //         }

// //         .faq-item {
// //           background: white;
// //           border-radius: 20px;
// //           margin-bottom: 20px;
// //           overflow: hidden;
// //           border: 2px solid rgba(220, 208, 255, 0.2);
// //           transition: all 0.4s ease;
// //         }

// //         .faq-item:hover {
// //           border-color: rgba(131, 135, 204, 0.4);
// //           box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
// //         }

// //         .faq-item.open {
// //           border-color: ${colors.royalBlue};
// //           box-shadow: 0 16px 40px rgba(65, 105, 225, 0.15);
// //         }

// //         .faq-question {
// //           width: 100%;
// //           padding: 28px 32px;
// //           background: none;
// //           border: none;
// //           text-align: left;
// //           font-size: 18px;
// //           font-weight: 700;
// //           color: ${colors.deepIndigo};
// //           cursor: pointer;
// //           display: flex;
// //           align-items: center;
// //           gap: 20px;
// //           transition: all 0.3s ease;
// //         }

// //         .faq-number {
// //           font-size: 14px;
// //           font-weight: 800;
// //           color: ${colors.astralBlue};
// //           opacity: 0.5;
// //           min-width: 32px;
// //         }

// //         .faq-text {
// //           flex: 1;
// //         }

// //         .faq-icon-wrapper {
// //           width: 36px;
// //           height: 36px;
// //           background: ${colors.lightLavender};
// //           border-radius: 50%;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           transition: all 0.4s ease;
// //           flex-shrink: 0;
// //         }

// //         .faq-item.open .faq-icon-wrapper {
// //           background: ${colors.royalBlue};
// //           transform: rotate(180deg);
// //         }

// //         .faq-icon {
// //           color: ${colors.deepIndigo};
// //           transition: color 0.3s ease;
// //         }

// //         .faq-item.open .faq-icon {
// //           color: white;
// //         }

// //         .faq-answer-wrapper {
// //           display: grid;
// //           grid-template-rows: 0fr;
// //           transition: grid-template-rows 0.4s ease;
// //         }

// //         .faq-item.open .faq-answer-wrapper {
// //           grid-template-rows: 1fr;
// //         }

// //         .faq-answer {
// //           overflow: hidden;
// //         }

// //         .faq-answer p {
// //           margin: 0;
// //           padding: 0 32px 28px 84px;
// //           font-size: 16px;
// //           line-height: 1.8;
// //           color: #555;
// //         }

// //         .no-results {
// //           text-align: center;
// //           padding: 80px 24px;
// //         }

// //         .no-results-icon {
// //           width: 120px;
// //           height: 120px;
// //           margin: 0 auto 24px;
// //           background: ${colors.lightLavender};
// //           border-radius: 50%;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           color: ${colors.astralBlue};
// //         }

// //         .no-results h3 {
// //           font-size: 24px;
// //           font-weight: 700;
// //           color: ${colors.deepIndigo};
// //           margin: 0 0 12px;
// //         }

// //         .no-results p {
// //           font-size: 16px;
// //           color: #666;
// //           margin: 0;
// //         }

// //         /* Support Section */
// //         .support-section {
// //           padding: 80px 24px 120px;
// //           background: white;
// //           position: relative;
// //           z-index: 1;
// //         }

// //         .support-card {
// //           position: relative;
// //           max-width: 800px;
// //           margin: 0 auto;
// //           text-align: center;
// //           padding: 72px 48px;
// //           background: linear-gradient(135deg, ${colors.deepIndigo} 0%, #2a2c4e 100%);
// //           border-radius: 32px;
// //           overflow: hidden;
// //         }

// //         .support-card-glow {
// //           position: absolute;
// //           top: -50%;
// //           left: -50%;
// //           width: 200%;
// //           height: 200%;
// //           background: radial-gradient(circle, rgba(131, 135, 204, 0.3), transparent 70%);
// //           animation: rotate 20s linear infinite;
// //         }

// //         @keyframes rotate {
// //           from { transform: rotate(0deg); }
// //           to { transform: rotate(360deg); }
// //         }

// //         .support-icon-wrapper {
// //           position: relative;
// //           width: 120px;
// //           height: 120px;
// //           margin: 0 auto 32px;
// //           background: linear-gradient(135deg, ${colors.astralBlue}, ${colors.royalBlue});
// //           border-radius: 50%;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           color: white;
// //           box-shadow: 0 20px 60px rgba(65, 105, 225, 0.4);
// //           animation: pulse 3s ease-in-out infinite;
// //           z-index: 1;
// //         }

// //         @keyframes pulse {
// //           0%, 100% { transform: scale(1); }
// //           50% { transform: scale(1.05); }
// //         }

// //         .support-title {
// //           position: relative;
// //           font-size: 36px;
// //           font-weight: 800;
// //           color: white;
// //           margin: 0 0 16px;
// //           letter-spacing: -1px;
// //           z-index: 1;
// //         }

// //         .support-text {
// //           position: relative;
// //           font-size: 18px;
// //           color: rgba(255, 255, 255, 0.8);
// //           margin: 0 0 40px;
// //           line-height: 1.6;
// //           max-width: 500px;
// //           margin-left: auto;
// //           margin-right: auto;
// //           z-index: 1;
// //         }

// //         .support-buttons {
// //           position: relative;
// //           display: flex;
// //           gap: 16px;
// //           justify-content: center;
// //           flex-wrap: wrap;
// //           margin-bottom: 32px;
// //           z-index: 1;
// //         }

// //         .btn {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 10px;
// //           padding: 16px 32px;
// //           border-radius: 14px;
// //           font-size: 16px;
// //           font-weight: 700;
// //           text-decoration: none;
// //           transition: all 0.4s ease;
// //           cursor: pointer;
// //           border: 2px solid transparent;
// //         }

// //         .btn-primary {
// //           background: white;
// //           color: ${colors.deepIndigo};
// //         }

// //         .btn-primary:hover {
// //           transform: translateY(-3px);
// //           box-shadow: 0 12px 32px rgba(255, 255, 255, 0.3);
// //         }

// //         .btn-secondary {
// //           background: transparent;
// //           color: white;
// //           border-color: rgba(255, 255, 255, 0.3);
// //         }

// //         .btn-secondary:hover {
// //           background: rgba(255, 255, 255, 0.1);
// //           border-color: white;
// //           transform: translateY(-3px);
// //         }

// //         .support-meta {
// //           position: relative;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           gap: 16px;
// //           font-size: 14px;
// //           color: rgba(255, 255, 255, 0.6);
// //           flex-wrap: wrap;
// //           z-index: 1;
// //         }

// //         .separator {
// //           opacity: 0.3;
// //         }

// //         /* Responsive */
// //         @media (max-width: 768px) {
// //           .hero-section {
// //             padding: 80px 20px 120px;
// //           }

// //           .stats-grid {
// //             grid-template-columns: 1fr;
// //             gap: 16px;
// //           }

// //           .help-grid {
// //             grid-template-columns: 1fr;
// //           }

// //           .faq-answer p {
// //             padding-left: 32px;
// //           }

// //           .support-card {
// //             padding: 48px 24px;
// //           }

// //           .support-buttons {
// //             flex-direction: column;
// //           }

// //           .btn {
// //             width: 100%;
// //             justify-content: center;
// //           }
// //         }
// //       `}</style>

// //       <div className="help-page">
// //         {/* Animated Background */}
// //         <div className="background-container">
// //           <div className="orb orb-1"></div>
// //           <div className="orb orb-2"></div>
// //           <div className="orb orb-3"></div>
// //         </div>

// //         {/* Hero Section */}
// //         <section className="hero-section">
// //           <div className="hero-grid"></div>
// //           <div className="hero-content">
// //             <div className="hero-badge">
// //               <Sparkles size={16} />
// //               <span>Help Center</span>
// //             </div>
            
// //             <h1 className="hero-title">
// //               How can we <span className="gradient-text">help you</span> today?
// //             </h1>
            
// //             <p className="hero-subtitle">
// //               Everything you need to master the All-Rounder Platform
// //             </p>
            
// //             {/* Search Bar */}
// //             <div className="search-wrapper">
// //               <div className="search-container">
// //                 <Search className="search-icon" size={20} />
// //                 <input
// //                   type="text"
// //                   placeholder="Search anything..."
// //                   value={searchQuery}
// //                   onChange={(e) => setSearchQuery(e.target.value)}
// //                   className="search-input"
// //                 />
// //                 {searchQuery && (
// //                   <button 
// //                     className="clear-search" 
// //                     onClick={() => setSearchQuery('')}
// //                     aria-label="Clear search"
// //                   >
// //                     <X size={16} />
// //                   </button>
// //                 )}
// //               </div>
// //               {searchQuery && (
// //                 <div className="search-results-count">
// //                   {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found
// //                 </div>
// //               )}
// //             </div>

// //             {/* Quick Stats */}
// //             <div className="stats-grid">
// //               <div className="stat-item">
// //                 <Zap size={20} />
// //                 <div>
// //                   <div className="stat-value">2.5k+</div>
// //                   <div className="stat-label">Active Users</div>
// //                 </div>
// //               </div>
// //               <div className="stat-item">
// //                 <Target size={20} />
// //                 <div>
// //                   <div className="stat-value">150+</div>
// //                   <div className="stat-label">Schools</div>
// //                 </div>
// //               </div>
// //               <div className="stat-item">
// //                 <Trophy size={20} />
// //                 <div>
// //                   <div className="stat-value">500+</div>
// //                   <div className="stat-label">Achievements</div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Quick Help Sections */}
// //         <section className="quick-help-section">
// //           <div className="container">
// //             <div className="section-header">
// //               <h2 className="section-title">Explore by Role</h2>
// //               <p className="section-subtitle">Choose your path to get started</p>
// //             </div>

// //             <div className="help-grid">
// //               {helpSections.map((section, index) => (
// //                 <div key={index} className="help-card">
// //                   <div className="help-card-glow"></div>
// //                   <div 
// //                     className="help-card-icon"
// //                     style={{ background: section.gradient }}
// //                   >
// //                     {section.icon}
// //                   </div>
// //                   <h3 className="help-card-title">{section.title}</h3>
// //                   <p className="help-card-description">{section.description}</p>
// //                   <ul className="help-card-links">
// //                     {section.links.map((link, linkIndex) => (
// //                       <li key={linkIndex}>
// //                         <a href={link.href} className="help-link">
// //                           <Check size={14} />
// //                           <span>{link.label}</span>
// //                           <ArrowRight size={14} className="link-arrow" />
// //                         </a>
// //                       </li>
// //                     ))}
// //                   </ul>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </section>

// //         {/* FAQ Section */}
// //         <section className="faq-section">
// //           <div className="container">
// //             <div className="section-header">
// //               <h2 className="section-title">Frequently Asked Questions</h2>
// //               <p className="section-subtitle">Find answers to common questions</p>
// //             </div>
            
// //             {/* Category Pills */}
// //             <div className="category-filter">
// //               {categories.map((category) => (
// //                 <button
// //                   key={category}
// //                   onClick={() => setSelectedCategory(category)}
// //                   className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
// //                 >
// //                   {category}
// //                 </button>
// //               ))}
// //             </div>

// //             {/* FAQ List */}
// //             <div className="faq-list">
// //               {filteredFAQs.map((faq, index) => (
// //                 <div 
// //                   key={index} 
// //                   className={`faq-item ${openFAQ === index ? 'open' : ''}`}
// //                 >
// //                   <button
// //                     className="faq-question"
// //                     onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
// //                   >
// //                     <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
// //                     <span className="faq-text">{faq.question}</span>
// //                     <div className="faq-icon-wrapper">
// //                       <ChevronDown size={20} className="faq-icon" />
// //                     </div>
// //                   </button>
// //                   <div className="faq-answer-wrapper">
// //                     <div className="faq-answer">
// //                       <p>{faq.answer}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {filteredFAQs.length === 0 && (
// //               <div className="no-results">
// //                 <div className="no-results-icon">
// //                   <Search size={48} />
// //                 </div>
// //                 <h3>No results found</h3>
// //                 <p>Try adjusting your search or browse by category</p>
// //               </div>
// //             )}
// //           </div>
// //         </section>

// //         {/* Contact Support */}
// //         <section className="support-section">
// //           <div className="container">
// //             <div className="support-card">
// //               <div className="support-card-glow"></div>
// //               <div className="support-icon-wrapper">
// //                 <MessageCircle size={56} strokeWidth={1.5} />
// //               </div>
// //               <h2 className="support-title">Still have questions?</h2>
// //               <p className="support-text">
// //                 Our dedicated support team is ready to assist you with any inquiries
// //               </p>
// //               <div className="support-buttons">
// //                 <a href="mailto:support@allrounder.lk" className="btn btn-primary">
// //                   <MessageCircle size={18} />
// //                   Contact Support
// //                 </a>
// //                 <a href="/feedback" className="btn btn-secondary">
// //                   Send Feedback
// //                   <ArrowRight size={18} />
// //                 </a>
// //               </div>
// //               <div className="support-meta">
// //                 <span>⚡ Average response time: 2 hours</span>
// //                 <span className="separator">•</span>
// //                 <span>📧 support@allrounder.lk</span>
// //               </div>
// //             </div>
// //           </div>
// //         </section>
// //       </div>
// //     </>
// //   );
// // };

// // export default HelpPage;

// 'use client';

// import { useState, useEffect } from 'react';
// import { HeroSection } from './heroSection';
// import { ExploreByRole } from './roleExplorer'
// import { FAQSection } from './FAQSection';
// import { SupportSection } from './supportSection';
// import { GlobalStyles } from './style';
// import { faqData, helpSections } from './data';

// const HelpPage = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState<string>('All');
//   const [mounted, setMounted] = useState(false);

//   const filteredFAQs = faqData.filter(faq => {
//     const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   if (!mounted) return null;

//   return (
//     <>
//       <GlobalStyles />

//       <div className="help-page">
//         {/* Animated Background */}
//         <div className="background-container">
//           <div className="orb orb-1"></div>
//           <div className="orb orb-2"></div>
//           <div className="orb orb-3"></div>
//         </div>

//         {/* Hero Section */}
//         <HeroSection 
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           resultsCount={filteredFAQs.length}
//         />

//         {/* Explore by Role Section */}
//         <ExploreByRole helpSections={helpSections} />

//         {/* FAQ Section */}
//         <FAQSection 
//           faqData={faqData}
//           filteredFAQs={filteredFAQs}
//           selectedCategory={selectedCategory}
//           setSelectedCategory={setSelectedCategory}
//         />

//         {/* Support Section */}
//         <SupportSection />
//       </div>
//     </>
//   );
// };

// export default HelpPage;