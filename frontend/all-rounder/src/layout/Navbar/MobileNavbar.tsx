'use client';

import Link from 'next/link';
import { Award, Menu, User } from "lucide-react";
import { UserDropdown } from '../Navbar/UserDropdown';
import { NavIcons } from '../Navbar/NavIcons';
import { useNavbar } from '../Navbar/hooks/useNavbar';
import { cssVariables } from '../Navbar/utils/constants';

interface MobileAuthNavbarProps {
  userType?: "student" | "teacher" | "school" | "organization";
  onLogout?: () => void;
  onMenuToggle: () => void;
}

export function MobileAuthNavbar({ userType, onLogout, onMenuToggle }: MobileAuthNavbarProps) {
  const {
    accountDropdown,
    toggleAccountDropdown,
    activeIcon,
    setActiveIcon
  } = useNavbar();

  return (
    <nav
      className="fixed top-2 left-2 right-2 z-50 lg:hidden"
      style={{
        backgroundColor: cssVariables.colors.cardBg,
        borderColor: cssVariables.colors.secondaryLavender
      }}
    >
      <div className="rounded-[30px] shadow-2xl border-2 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Menu Icon + Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
              style={{
                backgroundColor: 'transparent',
                '--hover-bg': cssVariables.colors.secondaryLavender
              } as React.CSSProperties}
            >
              <Menu
                className="w-5 h-5"
                style={{ color: cssVariables.colors.textMain }}
              />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <Award className="w-7 h-7" style={{ color: cssVariables.colors.primaryPurple }} />
              <span
                className="font-bold text-base hidden sm:block"
                style={{ color: cssVariables.colors.textMain }}
              >
                All-Rounder
              </span>
            </Link>
          </div>

          {/* Right: User Account */}
          <button
            onClick={toggleAccountDropdown}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#DCD0FF] transition"
            style={{
              backgroundColor: 'transparent',
              '--hover-bg': cssVariables.colors.secondaryLavender
            } as React.CSSProperties}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: cssVariables.colors.primaryPurple }}
            >
              <User className="w-4 h-4" />
            </div>
            <span
              className="text-xs capitalize hidden sm:block"
              style={{ color: cssVariables.colors.textMain }}
            >
              {userType}
            </span>
          </button>

          {/* Mobile Account Dropdown */}
          <UserDropdown
            userType={userType}
            isOpen={accountDropdown}
            onToggle={toggleAccountDropdown}
            onLogout={onLogout}
            variant="mobile"
          />
        </div>

        {/* Mobile Bottom Navigation Icons */}
        <div
          className="flex items-center justify-around mt-3 pt-3"
          style={{ borderColor: cssVariables.colors.gray200 }}
        >
          <NavIcons
            activeIcon={activeIcon}
            onIconClick={setActiveIcon}
            variant="mobile"
          />
        </div>
      </div>
    </nav>
  );
}