'use client';
import { useEffect, useState } from 'react';

export default function SplashScreenV2() {
  const [animationState, setAnimationState] = useState('initial');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timeline = [
      { state: 'text-in', delay: 100 },
      { state: 'avatar-in', delay: 800 },
      { state: 'glow', delay: 1400 },
      { state: 'complete', delay: 1800 },
    ];

    timeline.forEach(({ state, delay }) => {
      setTimeout(() => setAnimationState(state), delay);
    });

    // Start fade out and redirect after 2.3 seconds
    setTimeout(() => setFadeOut(true), 2300);
  }, []);

  if (fadeOut) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-[var(--primary-dark-purple)] flex items-center justify-center overflow-hidden z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-20 sm:w-28 lg:w-32 h-20 sm:h-28 lg:h-32 bg-[var(--primary-purple)] rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-24 sm:w-32 lg:w-40 h-24 sm:h-32 lg:h-40 bg-[var(--secondary-light-lavender)] rounded-full blur-2xl sm:blur-3xl animate-pulse delay-75"></div>
        <div className="absolute top-20 sm:top-40 right-20 sm:right-40 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 bg-[var(--white)] rounded-full blur-xl sm:blur-2xl animate-pulse delay-150"></div>
      </div>

      {/* Main content container */}
      <div className="relative flex items-center justify-center w-full h-full px-4">
        
        {/* Text and Avatar side by side */}
        <div className="absolute flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
          {/* "ALL-ROUNDER" text with smooth gradient animation */}
          <div 
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black transition-all duration-700 ${
              animationState === 'glow' || animationState === 'complete'
                ? 'bg-gradient-to-r from-[var(--secondary-light-lavender)] via-[var(--primary-purple)] to-[var(--secondary-light-lavender)] bg-clip-text text-transparent animate-pulse'
                : 'text-[var(--white)]'
            } ${
              animationState === 'initial' 
                ? 'opacity-0 -translate-x-[100px] sm:-translate-x-[200px] scale-90' 
                : 'opacity-100 translate-x-0 scale-100'
            } text-center sm:text-left`}
            style={{
              fontFamily: "'Righteous', 'Fredoka', 'Poppins', sans-serif",
              letterSpacing: '0.05em',
              filter: animationState === 'glow' || animationState === 'complete' ? 'drop-shadow(0 0 20px rgba(220,208,255,0.6))' : 'none'
            }}
          >
            ALL-ROUNDER
          </div>

          {/* Cute star avatar with smooth entrance */}
          <div 
            className={`transition-all duration-700 ${
              animationState === 'initial' 
                ? 'opacity-0 scale-0 rotate-180' 
                : animationState === 'avatar-in' || animationState === 'glow' || animationState === 'complete'
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-0 rotate-180'
            }`}
            style={{
              filter: animationState === 'glow' || animationState === 'complete' ? 'drop-shadow(0 0 15px rgba(220,208,255,0.5))' : 'none'
            }}
          >
            <img 
              src="/avatar.png"
              alt="Star Avatar"
              className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 ${
                animationState === 'glow' ? 'animate-bounce' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-1.5 sm:gap-2">
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[var(--secondary-light-lavender)] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[var(--white)] rounded-full animate-bounce delay-75"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[var(--primary-purple)] rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
}