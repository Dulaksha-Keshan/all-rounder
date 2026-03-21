'use client';
import { useState, useEffect } from 'react';
import SplashScreen from './_components/SplashScreen';
import LandingPage from './_components/LandingPage';


export default function SplashToLanding() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Check if this is a navigation (not a reload)
    const isNavigation = sessionStorage.getItem('isNavigating');
    
    if (isNavigation) {
      // Coming from navigation, don't show splash
      sessionStorage.removeItem('isNavigating');
      setShowSplash(false);
    } else {
      // Page reload or first visit - show splash
      setShowSplash(true);
      
      // Hide splash after 3.8 seconds
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 3800);

      return () => clearTimeout(timer);
    }
  }, []);

  return showSplash ? <SplashScreen /> : <LandingPage />;
}