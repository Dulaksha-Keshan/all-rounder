'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navIcons, cssVariables } from './utils/constants';

interface NavIconsProps {
  activeIcon: string | null;
  onIconClick: (id: string) => void;
  variant?: 'desktop' | 'mobile';
}

export function NavIcons({ activeIcon, onIconClick, variant = 'desktop' }: NavIconsProps) {
  const pathname = usePathname();

  if (variant === 'mobile') {
    return (
      <div className="flex items-center justify-around w-full">
        {navIcons.map((nav) => {
          const Icon = nav.icon;
          const isIconActive = pathname === nav.path;
          
          return (
            <Link
              key={nav.id}
              href={nav.path}
              className="flex flex-col items-center gap-1"
              onClick={() => onIconClick(nav.id)}
            >
              <div
                className={`p-2 rounded-full transition ${
                  isIconActive ? "text-white" : ""
                }`}
                style={{
                  backgroundColor: isIconActive ? cssVariables.colors.primaryPurple : 'transparent',
                  color: isIconActive ? 'white' : cssVariables.colors.textMain
                }}
              >
                {Icon && <Icon className="w-5 h-5" />}
              </div>
              <span 
                className="text-xs"
                style={{ 
                  color: isIconActive 
                    ? cssVariables.colors.primaryPurple 
                    : cssVariables.colors.textMuted 
                }}
              >
                {nav.label}
              </span>
            </Link>
          );
        })}
      </div>
    );
  }

  // Desktop version
  return (
    <>
      {navIcons.map((nav) => {
        const Icon = nav.icon;
        const isIconActive = activeIcon === nav.id;
        
        return (
          <Link
            key={nav.id}
            href={nav.path}
            onClick={() => onIconClick(nav.id)}
            className="relative group"
          >
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isIconActive ? "shadow-lg" : ""
              }`}
              style={{
                backgroundColor: isIconActive 
                  ? cssVariables.colors.primaryPurple 
                  : 'transparent',
                color: isIconActive 
                  ? 'white' 
                  : cssVariables.colors.textMain,
                '--hover-bg': cssVariables.colors.secondaryLavender
              } as React.CSSProperties}
            >
              {Icon && <Icon className="w-5 h-5" />}
              <span
                className={`overflow-hidden transition-all duration-300 ${
                  isIconActive ? "max-w-[200px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                {nav.label}
              </span>
            </div>
            {/* Hover tooltip */}
            {!isIconActive && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                style={{ 
                  backgroundColor: cssVariables.colors.primaryDark 
                }}
              >
                {nav.label}
              </div>
            )}
          </Link>
        );
      })}
    </>
  );
}