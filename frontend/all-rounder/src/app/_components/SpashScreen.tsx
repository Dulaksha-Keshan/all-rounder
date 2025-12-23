'use client';
import React, { useEffect, useRef, useState } from 'react';

export default function SplashScreen() {
  const [animationState, setAnimationState] = useState('initial');
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timeline = [
      { state: 'text-in', delay: 100 },
      { state: 'avatar-in', delay: 900 },
      { state: 'bounce', delay: 1500 },
      { state: 'fly-away', delay: 2200 },
      { state: 'logo-in', delay: 2600 },
      { state: 'tagline-in', delay: 3000 },
      { state: 'complete', delay: 3400 },
    ];

    timeline.forEach(({ state, delay }) => {
      setTimeout(() => setAnimationState(state), delay);
    });

    // Start fade out and hide after 4 seconds
    setTimeout(() => setFadeOut(true), 4000);
  }, []);

  if (fadeOut) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-gradient-to-br  bg-[#34365C] flex items-center justify-center overflow-hidden z-50 transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#8387CC] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#DCD0FF] rounded-full blur-3xl animate-pulse delay-75"></div>
        <div className="absolute top-40 right-40 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse delay-150"></div>
      </div>

      {/* Main content container */}
      <div className="relative flex items-center justify-center w-full h-full">
        
        {/* Text and Avatar side by side */}
        <div className="absolute flex items-center gap-8">
          {/* "ALL-ROUNDER" text */}
          <div 
            className={`text-5xl md:text-7xl font-black text-white transition-all duration-800 ${
              animationState === 'initial' 
                ? 'opacity-0 -translate-x-[200px] scale-75' 
                : animationState === 'text-in' || animationState === 'avatar-in' || animationState === 'bounce'
                ? 'opacity-100 translate-x-0 scale-100'
                : 'opacity-0 -translate-x-[400px] -rotate-[20deg]'
            }`}
          >
            ALL-ROUNDER
          </div>

          {/* Cute star avatar next to text */}
          <div 
            className={`transition-all duration-600 ${
              animationState === 'initial' 
                ? 'opacity-0 translate-x-[300px] -rotate-45 scale-50' 
                : animationState === 'avatar-in'
                ? 'opacity-100 translate-x-0 rotate-0 scale-100'
                : animationState === 'bounce'
                ? 'opacity-100 translate-x-0 -translate-y-5 rotate-0 scale-100'
                : animationState === 'fly-away' || animationState === 'logo-in' || animationState === 'tagline-in' || animationState === 'complete'
                ? 'opacity-0 translate-x-[400px] rotate-[20deg]'
                : 'opacity-0 translate-x-[300px] -rotate-45 scale-50'
            }`}
          >
            <img 
              src="/avatar.png"
              alt="Star Avatar"
              className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_4px_20px_rgba(220,208,255,0.5)]"
            />
          </div>
        </div>

        {/* Main logo */}
        <div 
          className={`flex flex-col items-center transition-all duration-800 ${
            animationState === 'logo-in' || animationState === 'tagline-in'
              ? 'opacity-100 scale-100'
              : animationState === 'complete'
              ? 'opacity-100 scale-105 drop-shadow-[0_0_30px_rgba(220,208,255,0.8)]'
              : 'opacity-0 scale-50'
          }`}
        >
          <img 
            src="/logo.png"
            alt="All-Rounder Logo"
            className="w-64 h-64 md:w-80 md:h-80 object-contain"
          />
          <div 
            className={`mt-4 text-xl md:text-2xl font-semibold text-center text-white transition-all duration-600 ${
              animationState === 'tagline-in' || animationState === 'complete'
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-5'
            }`}
          >
            <span className="text-[#DCD0FF]">Celebrate.</span>{' '}
            <span className="text-white">Connect.</span>{' '}
            <span className="text-[#8387CC]">Contribute.</span>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-[#DCD0FF] rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce delay-75"></div>
          <div className="w-3 h-3 bg-[#8387CC] rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
}