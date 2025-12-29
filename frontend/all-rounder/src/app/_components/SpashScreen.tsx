'use client';
import { useEffect, useState } from 'react';

export default function SplashScreenV2() {
  const [animationState, setAnimationState] = useState('initial');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timeline = [
      { state: 'text-in', delay: 100 },
      { state: 'avatar-in', delay: 900 },
      { state: 'magic', delay: 1400 },
      { state: 'transform', delay: 1600 },
      { state: 'bounce', delay: 2100 },
      { state: 'fly-away', delay: 2800 },
    ];

    timeline.forEach(({ state, delay }) => {
      setTimeout(() => setAnimationState(state), delay);
    });

    // Start fade out and redirect after 3.5 seconds
    setTimeout(() => setFadeOut(true), 3500);
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
          {/* "ALL-ROUNDER" text - starts white, transforms to gradient */}
          <div 
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black transition-all duration-800 ${
              animationState === 'transform' || animationState === 'bounce'
                ? 'bg-gradient-to-r from-[var(--secondary-light-lavender)] via-[var(--primary-purple)] to-[var(--secondary-light-lavender)] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(220,208,255,0.9)]'
                : 'text-[var(--white)]'
            } ${
              animationState === 'initial' 
                ? 'opacity-0 -translate-x-[100px] sm:-translate-x-[200px] scale-75' 
                : animationState === 'text-in' || animationState === 'avatar-in' || animationState === 'magic' || animationState === 'transform' || animationState === 'bounce'
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 -translate-x-[200px] sm:-translate-x-[400px] -rotate-[20deg]'
            } text-center sm:text-left`}
            style={{
              fontFamily: "'Righteous', 'Fredoka', 'Poppins', sans-serif",
              letterSpacing: '0.05em'
            }}
          >
            ALL-ROUNDER
          </div>

          {/* Cute star avatar next to text */}
          <div 
            className={`transition-all duration-600 ${
              animationState === 'initial' 
                ? 'opacity-0 translate-x-[150px] sm:translate-x-[300px] -rotate-45 scale-50' 
                : animationState === 'avatar-in'
                ? 'opacity-100 translate-x-0 rotate-0 scale-100'
                : animationState === 'magic'
                ? 'opacity-100 translate-x-0 rotate-12 scale-110 drop-shadow-[0_0_50px_rgba(220,208,255,1)]'
                : animationState === 'transform' || animationState === 'bounce'
                ? 'opacity-100 translate-x-0 -translate-y-5 rotate-0 scale-100 drop-shadow-[0_4px_30px_rgba(220,208,255,0.8)]'
                : animationState === 'fly-away'
                ? 'opacity-0 translate-x-[200px] sm:translate-x-[400px] rotate-[20deg]'
                : 'opacity-0 translate-x-[150px] sm:translate-x-[300px] -rotate-45 scale-50'
            }`}
          >
            <img 
              src="/avatar.png"
              alt="Star Avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
            />
          </div>

          {/* Magic sparkle/burst effect when avatar appears */}
          {animationState === 'magic' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Central burst */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 sm:w-24 lg:w-32 h-20 sm:h-24 lg:h-32 bg-gradient-to-r from-[var(--secondary-light-lavender)] to-[var(--primary-purple)] rounded-full opacity-70 animate-ping"></div>
              
              {/* Radiating sparkles */}
              <div className="absolute top-0 left-1/2 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-[var(--white)] rounded-full animate-ping"></div>
              <div className="absolute bottom-0 left-1/2 w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-[var(--secondary-light-lavender)] rounded-full animate-ping delay-75"></div>
              <div className="absolute top-1/2 left-0 w-2 sm:w-2.5 lg:w-3 h-2 sm:h-2.5 lg:h-3 bg-[var(--primary-purple)] rounded-full animate-ping delay-100"></div>
              <div className="absolute top-1/2 right-0 w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-[var(--white)] rounded-full animate-ping delay-150"></div>
              <div className="absolute top-1/4 left-1/4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[var(--secondary-light-lavender)] rounded-full animate-ping delay-200"></div>
              <div className="absolute bottom-1/4 right-1/4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[var(--white)] rounded-full animate-ping delay-100"></div>
            </div>
          )}

          {/* Subtle sparkles during transform */}
          {(animationState === 'transform' || animationState === 'bounce') && (
            <>
              <div className="absolute -top-4 sm:-top-6 left-1/4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[var(--white)] rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 sm:-bottom-6 right-1/4 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[var(--secondary-light-lavender)] rounded-full animate-pulse delay-75"></div>
              <div className="absolute top-1/2 -left-6 sm:-left-8 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[var(--primary-purple)] rounded-full animate-pulse delay-150"></div>
              <div className="absolute top-1/4 -right-4 sm:-right-6 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[var(--white)] rounded-full animate-pulse delay-100"></div>
            </>
          )}
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