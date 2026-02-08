// import { FAQItem, HelpSection } from './types';
// import { Users, Award, School, BookOpen } from 'lucide-react';

// export const faqData: FAQItem[] = [
//   {
//     question: "What is the All-Rounder Platform?",
//     answer: "All-Rounder is Sri Lanka's national talent ecosystem - a student-centric digital platform where students can record, showcase, and verify their extracurricular achievements. It connects students, teachers, schools, and organizations in one unified system, ensuring that every student's potential is seen, verified, and valued.",
//     category: "Getting Started"
//   },
//   {
//     question: "How do I create a student profile?",
//     answer: "To create your profile: 1) Click 'Sign Up' and select 'Student', 2) Fill in your basic information and school details, 3) Verify your email address, 4) Add your achievements in sports, arts, and extracurricular activities, 5) Request verification from your teachers or school administrators. Your profile will become visible once verified.",
//     category: "Getting Started"
//   },
//   {
//     question: "How does the verification system work?",
//     answer: "Our verification system ensures authenticity and trust. Teachers and schools are verified through official documentation. Student achievements can be confirmed by authorized teachers or institutional representatives. This prevents false claims and ensures that universities, sponsors, and organizations can confidently rely on the information presented.",
//     category: "Verification"
//   },
//   {
//     question: "Can my school share resources with other schools?",
//     answer: "Yes! The platform encourages collaboration through our Resource Sharing feature. Schools can post specific resource requirements (sports equipment, art materials, training facilities), and other schools or institutions with surplus resources can contribute. This builds a culture of mutual support, especially benefiting under-resourced schools.",
//     category: "For Schools"
//   },
//   {
//     question: "How do leaderboards work?",
//     answer: "Leaderboards rank students and schools based on verified achievements across sports, arts, and extracurricular activities. They encourage healthy competition, transparency, and motivation while making talent easily discoverable. Rankings are updated regularly based on new verified achievements and participation.",
//     category: "Features"
//   },
//   {
//     question: "How can I find competitions and events?",
//     answer: "Visit the Competitions Hub to explore upcoming opportunities across academics, sports, arts, and extracurricular domains. Each event listing includes eligibility criteria, timelines, requirements, and official registration links. The platform centralizes information so you never miss an opportunity, regardless of your location or school background.",
//     category: "Opportunities"
//   },
//   {
//     question: "What partnerships does the platform offer?",
//     answer: "We partner with universities, NGOs, companies, and professional organizations to provide students with workshops, competitions, mentorship programs, internships, and scholarships. These partnerships bridge the gap between school-level talent and real-world opportunities, helping students explore career pathways early.",
//     category: "Opportunities"
//   },
//   {
//     question: "What are digital badges and how do I earn them?",
//     answer: "Digital badges are rewards for your achievements and consistent engagement. You earn badges by: participating in verified competitions, achieving milestones in your talent areas, maintaining an active and verified profile, and contributing to the community. Badges boost your profile's credibility and are visible to universities and organizations.",
//     category: "Features"
//   },
//   {
//     question: "Is my information secure on the platform?",
//     answer: "Yes, we take security seriously. All user data is encrypted and stored securely. Only verified users can access the platform, and students have control over what information is publicly visible. Schools and teachers can only verify achievements they have direct knowledge of, ensuring accountability.",
//     category: "Privacy & Security"
//   },
//   {
//     question: "How can teachers verify student achievements?",
//     answer: "Teachers with verified accounts can: 1) Navigate to the student's profile, 2) Review the achievement details submitted by the student, 3) Confirm authenticity if the achievement occurred under their supervision or awareness, 4) Add verification notes if needed. Your verification adds credibility to the student's profile.",
//     category: "For Teachers"
//   },
//   {
//     question: "Can universities access student profiles?",
//     answer: "Yes, partner universities and organizations can view verified student profiles to discover talented individuals. However, students maintain privacy controls and can choose which achievements are publicly visible. Only verified achievements are shown, ensuring universities access accurate, trustworthy information.",
//     category: "For Organizations"
//   },
//   {
//     question: "I forgot my password. What should I do?",
//     answer: "Click 'Forgot Password' on the login page, enter your registered email address, and follow the password reset instructions sent to your email. If you don't receive the email within 5 minutes, check your spam folder or contact support at support@allrounder.lk",
//     category: "Account Issues"
//   }
// ];

// export const helpSections: HelpSection[] = [
//   {
//     icon: <Users size={28} strokeWidth={1.5} />,
//     title: "For Students",
//     description: "Discover how to showcase your talents and unlock opportunities",
//     gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//     content: "As a student on the All-Rounder Platform, you can create a comprehensive profile showcasing your achievements in sports, arts, and extracurricular activities. Your profile serves as your digital portfolio, verified by teachers and schools to ensure authenticity. Explore competitions, connect with mentors, earn digital badges, and get discovered by universities and organizations looking for talented individuals like you.",
//     links: [
//       { label: "Creating Your Profile", href: "#create-profile" },
//       { label: "Adding Achievements", href: "#add-achievements" },
//       { label: "Getting Verified", href: "#verification" },
//       { label: "Exploring Competitions", href: "#competitions" }
//     ]
//   },
//   {
//     icon: <School size={28} strokeWidth={1.5} />,
//     title: "For Schools",
//     description: "Elevate your institution's presence and empower student growth",
//     gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
//     content: "Schools can register on the platform to manage student profiles, verify achievements, and showcase institutional excellence. Use the leaderboard system to track your school's performance, share resources with other institutions, and participate in inter-school competitions. The platform helps you maintain transparency, celebrate student success, and attract prospective students and partnerships.",
//     links: [
//       { label: "School Registration", href: "#school-registration" },
//       { label: "Managing Student Profiles", href: "#manage-students" },
//       { label: "Resource Sharing", href: "#resources" },
//       { label: "Leaderboard Rankings", href: "#rankings" }
//     ]
//   },
//   {
//     icon: <BookOpen size={28} strokeWidth={1.5} />,
//     title: "For Teachers",
//     description: "Guide and authenticate your students' remarkable achievements",
//     gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
//     content: "Teachers play a crucial role in the verification ecosystem. 
//     Your verified account allows you to authenticate student achievements, provide mentorship, and support students in their journey. Use the dashboard to track students you've verified, participate in educational programs, and contribute to building a trustworthy talent ecosystem. Your endorsement adds significant credibility to student profiles.",
//     links: [
//       { label: "Teacher Verification", href: "#teacher-verification" },
//       { label: "Verifying Achievements", href: "#verify-achievements" },
//       { label: "Supporting Students", href: "#support" },
//       { label: "Using the Dashboard", href: "#dashboard" }
//     ]
//   },
//   {
//     icon: <Award size={28} strokeWidth={1.5} />,
//     title: "For Organizations",
//     description: "Connect with verified talent and build meaningful partnerships",
//     gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
//     content: "Organizations, universities, and NGOs can partner with the All-Rounder Platform to discover verified talent, post opportunities, and engage with students nationwide. Access a curated pool of talented students, organize competitions and workshops, offer internships and scholarships, and build your employer brand. All student data is verified, ensuring you connect with genuine talent.",
//     links: [
//       { label: "Partnership Programs", href: "#partnerships" },
//       { label: "Posting Opportunities", href: "#post-opportunities" },
//       { label: "Accessing Talent Pool", href: "#talent-pool" },
//       { label: "Event Management", href: "#events" }
//     ]
//   }
// ];