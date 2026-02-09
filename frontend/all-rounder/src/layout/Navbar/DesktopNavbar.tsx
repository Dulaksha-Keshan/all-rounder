'use client';

import Link from 'next/link';
import { Award, Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useDarkMode } from '../Navbar/hooks/useDarkMode';
import { NavIcons } from '../Navbar/NavIcons';
import { UserDropdown } from './UserDropdown';
import { useNavbar } from '../Navbar/hooks/useNavbar';
import { cssVariables } from './utils/constants';

interface DesktopAuthNavbarProps {
  userType?: "student" | "teacher" | "school" | "organization";
  onLogout?: () => void;
  onMenuToggle: () => void;
}

export function DesktopAuthNavbar({ userType, onLogout, onMenuToggle }: DesktopAuthNavbarProps) {
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <nav className="fixed top-4 left-4 right-4 z-50 hidden lg:block">
      <div 
        className="rounded-[50px] shadow-2xl border-2 px-6 py-3"
        style={{ 
          backgroundColor: cssVariables.colors.cardBg,
          borderColor: cssVariables.colors.secondaryLavender 
        }}
      >
        <div className="flex items-center justify-between">
          {/* Left: Menu Icon + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
              style={{ 
                backgroundColor: 'transparent',
                '--hover-bg': cssVariables.colors.secondaryLavender 
              } as React.CSSProperties}
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" style={{ color: cssVariables.colors.textMain }} />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
              <Award className="w-8 h-8" style={{ color: cssVariables.colors.primaryPurple }} />
              <span 
                className="font-bold text-lg hidden xl:block"
                style={{ color: cssVariables.colors.textMain }}
              >
                All-Rounder
              </span>
            </Link>
          </div>

          {/* Center: Icon Navigation */}
          <div className="flex items-center gap-2">
            <NavIcons activeIcon={activeIcon} onIconClick={setActiveIcon} />
          </div>

          {/* Right: User Account & Dark Mode */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
              style={{ 
                backgroundColor: 'transparent',
                '--hover-bg': cssVariables.colors.secondaryLavender 
              } as React.CSSProperties}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" style={{ color: cssVariables.colors.textMain }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: cssVariables.colors.textMain }} />
              )}
            </button>
            <UserDropdown
              userType={userType}
              isOpen={accountDropdown}
              onToggle={() => setAccountDropdown(!accountDropdown)}
              onLogout={onLogout}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}