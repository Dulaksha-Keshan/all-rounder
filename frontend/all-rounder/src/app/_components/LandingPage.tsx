import { Trophy, Palette, Users } from 'lucide-react';
import FeatureCard from './FeatureCard';
import { EventDetails } from './Events';
import { HeroSection } from './Hero';
import Footer from './Footer';
import Header from './navibar';


export default function LandingPage() {
  return (
    
    <div className="flex flex-col min-h-screen bg-[var(--gray-100)]"> 
      {/* Header */}
      <Header/>

      <main className="flex-grow">
        <HeroSection/>

        {/* Our Vision & Mission */}
        <div className="mx-4 sm:mx-8 lg:mx-16 mt-12 sm:mt-16 lg:mt-20 sm:mb-8"
        id= "AboutUs">
          <div className="mb-6 sm:mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--primary-dark-purple)] mb-2">Our Vision & Mission</h2>
            <p className="text-[var(--gray-600)] text-base sm:text-lg lg:text-xl px-4">Empowering students to showcase their unique journey through three core pillars that define our platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Create */}
            <div className="bg-purple-100 rounded-xl p-6 sm:p-8 shadow-lg border-2 border-[var(--secondary-light-lavender)] hover:border-[var(--primary-purple)] transition-all hover:shadow-xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--primary-purple)] to-[var(--primary-blue)] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Palette className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--white)]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--primary-dark-purple)] mb-3 sm:mb-4">Create</h3>
              <p className="text-justify text-[var(--gray-700)] leading-relaxed mb-4 text-base sm:text-lg">
                Build a comprehensive digital portfolio that captures your student journey. From achievements to creative projects and leadership all in one powerful profile.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--secondary-light-lavender)] text-[var(--accent-purple-text)] rounded-full text-xs sm:text-sm font-medium">BUILD</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--secondary-light-lavender)] text-[var(--accent-purple-text)] rounded-full text-xs sm:text-sm font-medium">SHOWCASE</span>
              </div>
            </div>

          {/* Contribute */}
            <div className="bg-purple-100 rounded-xl p-6 sm:p-8 shadow-lg border-2 border-[var(--secondary-light-lavender)] hover:border-[var(--primary-purple)] transition-all hover:shadow-xl">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--primary-purple)] to-[var(--primary-blue)] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--white)]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--primary-dark-purple)] mb-3 sm:mb-4">Contribute</h3>
              <p className="text-justify text-[var(--gray-700)] leading-relaxed mb-4 text-base sm:text-lg">
                Share your voice, and experiences with a vibrant community. Engage meaningfully through our social feed, support peers, and contribute to a collaborative environment.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--secondary-light-lavender)] text-[var(--accent-purple-text)] rounded-full text-xs sm:text-sm font-medium">CONNECT</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--secondary-light-lavender)] text-[var(--accent-purple-text)] rounded-full text-xs sm:text-sm font-medium">ENGAGE</span>
              </div>
            </div>

          {/* Celebrate */}
            <div className="bg-purple-100 rounded-xl p-6 sm:p-8 shadow-lg border-2 border-[var(--secondary-light-lavender)] hover:border-[var(--primary-purple)] transition-all hover:shadow-xl md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[var(--primary-purple)] to-[var(--primary-blue)] rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--white)]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--primary-dark-purple)] mb-3 sm:mb-4">Celebrate</h3>
              <p className="text-justify text-[var(--gray-700)] leading-relaxed mb-4 text-base sm:text-lg">
                Recognize and honor every milestone. Get verified recognition from educators, and receive the acknowledgment you deserve for your hard work and dedication.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--secondary-light-lavender)] text-[var(--accent-purple-text)] rounded-full text-xs sm:text-sm font-medium">ACHIEVE</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[var(--secondary-light-lavender)] text-[var(--accent-purple-text)] rounded-full text-xs sm:text-sm font-medium">RECOGNIZE</span>
              </div>
            </div>
          </div>
        
          <div className='flex justify-center mt-4 sm:mt-5'>
            <button className="px-6 sm:px-9 py-2.5 sm:py-3 bg-[var(--primary-purple)] text-[var(--white)] rounded-lg text-base sm:text-lg font-medium hover:bg-[var(--primary-blue)] mt-5">
              → Learn More
            </button>
          </div>
        </div>

      {/* Explore Our Features Section */}
        <div className="mb-12 sm:mb-16 mt-0"
        id= "Features">
          <FeatureCard />
        </div>

      {/* Built for students section */}
        <div className="mb-12 sm:mb-16 mx-4 sm:mx-8 lg:mx-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--primary-dark-purple)] mb-3 sm:mb-4 text-center px-4">
            Empowering Every Stakeholder
          </h2>
          <p className="text-base sm:text-lg text-[var(--gray-600)] mb-8 sm:mb-12 text-center max-w-3xl mx-auto px-4">
            Learn how student profiles help teachers guide students, help parents track accomplishments, and assist students in tracking their own progress and planning their future.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* For Students */}
            <div className="bg-gradient-to-br from-[var(--secondary-light-lavender)] to-[var(--secondary-pale-lavender)] rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-[var(--primary-purple)]/20">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--primary-dark-purple)] mb-4 sm:mb-6 flex items-center gap-3">
                For Students
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Set, cultivate, & nurture a detailed record of accomplishments</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Track your efforts & achievements over time</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Use it with college admissions coaches and advisors</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Build a portfolio that tells your complete story</span>
                </li>
              </ul>
            </div>

          {/* For Teachers */}
            <div className="bg-gradient-to-br from-[var(--secondary-light-lavender)] to-[var(--secondary-pale-lavender)] rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-[var(--primary-purple)]/20">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--primary-dark-purple)] mb-4 sm:mb-6 flex items-center gap-3">
                For Teachers
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>View, curate, and recognize students who inspire</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Approve and verify student activities efficiently</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Foster an inclusive, engaging social learning layer</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Guide students in crafting stronger profiles</span>
                </li>
              </ul>
            </div>

          {/* For Schools */}
            <div className="bg-gradient-to-br from-[var(--secondary-light-lavender)] to-[var(--secondary-pale-lavender)] rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all border-2 border-[var(--primary-purple)]/20 md:col-span-2 lg:col-span-1">
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--primary-dark-purple)] mb-4 sm:mb-6 flex items-center gap-3">
                For Schools
              </h3>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Streamline verification with a single advisor system</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Ensure data privacy with no PII leakage</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Monitor student engagement and achievements</span>
                </li>
                <li className="flex items-start text-sm sm:text-base text-[var(--primary-dark-purple)]">
                  <span className="mr-2 sm:mr-3 text-[var(--primary-purple)] font-bold text-base sm:text-lg flex-shrink-0">✓</span>
                  <span>Build a culture of recognition and excellence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      {/*  Events Section */}
      <div id="Events"><EventDetails/></div> 
      
        
      </main>
      {/* Footer Section */}
      <Footer/>
      
     </div> 

  );
}