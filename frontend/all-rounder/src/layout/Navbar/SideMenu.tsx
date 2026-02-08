'use client';

import Link from 'next/link';
import { X, GraduationCap, Users, HelpCircle } from "lucide-react";
import { sideMenuItems, cssVariables } from './utils/constants';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideMenu({ isOpen, onClose }: SideMenuProps) {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Side Menu Panel */}
      <div 
        className="fixed top-20 lg:top-24 left-2 lg:left-4 w-64 rounded-3xl shadow-2xl border-2 py-6 z-50 animate-in slide-in-from-left"
        style={{ 
          backgroundColor: cssVariables.colors.cardBg,
          borderColor: cssVariables.colors.secondaryLavender 
        }}
      >
        {/* Header */}
        <div className="px-6 mb-4 flex items-center justify-between">
          <h3 
            className="text-lg"
            style={{ color: cssVariables.colors.textMain }}
          >
            Menu
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#DCD0FF] transition lg:hidden"
            style={{ 
              backgroundColor: 'transparent',
              '--hover-bg': cssVariables.colors.secondaryLavender 
            } as React.CSSProperties}
          >
            <X className="w-5 h-5" style={{ color: cssVariables.colors.textMain }} />
          </button>
        </div>
        
        {/* Menu Items */}
        <div className="space-y-1">
          {sideMenuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-6 py-3 hover:bg-[#F8F8FF] transition"
              style={{ 
                color: cssVariables.colors.textMain,
                '--hover-bg': cssVariables.colors.secondaryPaleLavender 
              } as React.CSSProperties}
            >
              {getIcon(item.icon)}
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}