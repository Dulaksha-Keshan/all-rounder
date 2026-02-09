'use client';

import { useEffect, useState, useCallback } from "react";
import { usePathname } from 'next/navigation';
import { publicSections } from '../utils/constants';

export function useScrollSection() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 100;

    for (const section of publicSections) {
      const element = document.getElementById(section.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          setActiveSection(section.id);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    if (pathname === "/") {
      handleScroll(); // Check on mount
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setActiveSection(""); // Reset when not on landing page
    }
  }, [pathname, handleScroll]);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveSection(sectionId);
    }
  }, []);

  return { activeSection, scrollToSection };
}