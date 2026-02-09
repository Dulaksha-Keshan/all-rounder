'use client';

import Link from 'next/link';
import { User, LogOut } from "lucide-react";
import { useNavbar } from './hooks/useNavbar';
import { cssVariables } from './utils/constants';

interface UserDropdownProps {
  userType?: string;
  isOpen: boolean;
  onToggle: () => void;
  onLogout?: () => void;
  variant?: 'desktop' | 'mobile';
}

export function UserDropdown({ 
  userType, 
  isOpen, 
  onToggle, 
  onLogout, 
  variant = 'desktop' 
}: UserDropdownProps) {
  const { getProfilePath } = useNavbar();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        onClick={onToggle}
      />
      
      {/* Dropdown Panel */}
      <div 
        className={`absolute ${
          variant === 'mobile' ? 'top-12 right-0' : 'top-full right-0 mt-2'
        } w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 py-2 z-50`}
        style={{ 
          backgroundColor: cssVariables.colors.cardBg,
          borderColor: cssVariables.colors.secondaryLavender 
        }}
      >
        {/* User Info */}
        <div className="px-4 py-3" style={{ borderColor: cssVariables.colors.gray200 }}>
          <div 
            className="text-xs"
            style={{ color: cssVariables.colors.textMuted }}
          >
            Signed in as
          </div>
          <div 
            className="text-sm capitalize"
            style={{ color: cssVariables.colors.textMain }}
          >
            {userType}
          </div>
        </div>

        {/* Profile Link */}
        <Link
          href={getProfilePath(userType)}
          onClick={onToggle}
          className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F8FF] transition"
          style={{ 
            color: cssVariables.colors.textMain,
            '--hover-bg': cssVariables.colors.secondaryPaleLavender 
          } as React.CSSProperties}
        >
          <User className="w-4 h-4" />
          <span className="text-sm">My Profile</span>
        </Link>

        {/* Logout Button */}
        <div className="mt-2 pt-2" style={{ borderColor: cssVariables.colors.gray200 }}>
          <button
            onClick={() => {
              onLogout?.();
              onToggle();
            }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 w-full"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}