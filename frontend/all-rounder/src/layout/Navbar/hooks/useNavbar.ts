'use client';

import { useState, useCallback } from "react";
import { usePathname } from 'next/navigation';

export function useNavbar() {
  const pathname = usePathname();
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const toggleSideMenu = useCallback(() => {
    setSideMenuOpen(prev => !prev);
  }, []);

  const toggleAccountDropdown = useCallback(() => {
    setAccountDropdown(prev => !prev);
  }, []);

  const closeAllMenus = useCallback(() => {
    setMobileMenuOpen(false);
    setSideMenuOpen(false);
    setAccountDropdown(false);
  }, []);

  const getProfilePath = useCallback((userType?: string) => {
    switch (userType) {
      case "teacher":
        return "/teacher-profile";
      case "school":
        return "/school-profile";
      case "organization":
        return "/organization-profile";
      default:
        return "/profile";
    }
  }, []);

  return {
    pathname,
    activeIcon,
    mobileMenuOpen,
    sideMenuOpen,
    accountDropdown,
    setActiveIcon,
    toggleMobileMenu,
    toggleSideMenu,
    toggleAccountDropdown,
    closeAllMenus,
    getProfilePath,
  };
}