"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  isAuthenticated?: boolean;
  userType?: "student" | "teacher" | "school" | "organization";
  onLogout?: () => void;
}

export default function Navbar({
  isAuthenticated = false,
  userType,
  onLogout,
}: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const publicLinks = [
    { path: "/", label: "Home" },
    { path: "/#AboutUs", label: "About Us" },
    { path: "/#Features", label: "Features" },
    { path: "/#Events", label: "Events" },
    { path: "/login", label: "Login" },
  ];

  const getProfilePath = () => {
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
  };

  const authenticatedLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: getProfilePath(), label: "My Profile" },
    { path: "/resources", label: "Resources" },
    { path: "/donations", label: "Donations" },
    { path: "/competitions", label: "Competitions" },
    { path: "/onboarding", label: "Learn More" },
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo (Replace src with your custom logo image) */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="All-Rounder Logo"
              className="h-10 sm:h-12 lg:h-15 w-auto"
            />
        
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-md transition ${
                  isActive(link.path)
                    ? "bg-[#8387CC] text-white"
                    : "text-[#34365C] hover:bg-[#DCD0FF]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
                
                {/* User avatar placeholder */}
                <div className="flex items-center gap-2">
                  <img
                    src="/user.png"
                    alt="User"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="capitalize text-sm text-[#34365C]">
                    {userType}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-[#4169E1] hover:bg-[#3557c1] text-white rounded-md transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (custom image optional) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-[#DCD0FF]"
          >
            <img
              src={mobileMenuOpen ? "/close.png" : "/menu.png"}
              alt="Menu"
              className="w-6 h-6"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-3 space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md transition ${
                  isActive(link.path)
                    ? "bg-[#8387CC] text-white"
                    : "text-[#34365C] hover:bg-[#DCD0FF]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <div className="pt-3 mt-3 border-t border-gray-300">
                <div className="flex items-center gap-2 px-3 py-2">
                  <img
                    src="/user.png"
                    alt="User"
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="capitalize">{userType}</span>
                </div>

                <button
                  onClick={() => {
                    onLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-[#4169E1] hover:bg-[#3557c1] text-white rounded-md mt-2"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}