'use client';

import Link from 'next/link';
import { Award, Menu, X } from "lucide-react";
import { useState } from "react";
import { useScrollSection } from '../Navbar/hooks/useScrollSection';
import { publicSections, cssVariables } from './utils/constants';

export function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollToSection } = useScrollSection();

  const handleMobileNavClick = (section: string) => {
    scrollToSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Public Navbar */}
      <nav className="fixed top-0 left-1.5 right-1.5 z-50 md:block">
        <div className="flex items-center justify-center px-8 py-0">
          <div
            className="rounded-[40px] shadow-2xl border-2 px-8 py-4 flex items-center justify-between gap-8 w-full max-w-7xl mx-auto"
            style={{
              backgroundColor: cssVariables.colors.cardBg,
              borderColor: cssVariables.colors.secondaryLavender
            }}
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0">
              <Award className="w-10 h-10" style={{ color: cssVariables.colors.primaryPurple }} />
              <span
                className="font-bold text-xl"
                style={{ color: cssVariables.colors.textMain }}
              >
                All-Rounder
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-8">
              {publicSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="transition font-medium capitalize"
                  style={{
                    color: cssVariables.colors.textMain,
                    '--hover-color': cssVariables.colors.primaryPurple
                  } as React.CSSProperties}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                href="/login"
                className="px-6 py-2 text-white rounded-full transition shadow-lg"
                style={{
                  backgroundColor: cssVariables.colors.primaryBlue,
                  '--hover-bg': '#3557c1'
                } as React.CSSProperties}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Public Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 md:hidden shadow-lg border-b-2"
        style={{
          backgroundColor: cssVariables.colors.cardBg,
          borderColor: cssVariables.colors.secondaryLavender
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Award className="w-8 h-8" style={{ color: cssVariables.colors.primaryPurple }} />
            <span
              className="font-bold text-lg"
              style={{ color: cssVariables.colors.textMain }}
            >
              All-Rounder
            </span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
            style={{
              backgroundColor: 'transparent',
              '--hover-bg': cssVariables.colors.secondaryLavender
            } as React.CSSProperties}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" style={{ color: cssVariables.colors.textMain }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: cssVariables.colors.textMain }} />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div
            className="border-t-2 px-4 py-4 space-y-3"
            style={{
              backgroundColor: cssVariables.colors.cardBg,
              borderColor: cssVariables.colors.secondaryLavender
            }}
          >
            {publicSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleMobileNavClick(section.id)}
                className="block w-full text-left px-4 py-2 rounded-lg transition"
                style={{
                  color: cssVariables.colors.textMain,
                  '--hover-bg': cssVariables.colors.secondaryPaleLavender
                } as React.CSSProperties}
              >
                {section.label}
              </button>
            ))}
            <div
              className="flex items-center justify-between pt-3 border-t"
              style={{ borderColor: cssVariables.colors.gray200 }}
            >
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-2 text-white rounded-full transition"
                style={{
                  backgroundColor: cssVariables.colors.primaryBlue,
                  '--hover-bg': '#3557c1'
                } as React.CSSProperties}
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}