"use client";

import { useState, useEffect } from "react";
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
  const [activeSection, setActiveSection] = useState("");

  // Track active section based on scroll position
  useEffect(() => {
    if (!isAuthenticated && pathname === "/") {
      const handleScroll = () => {
        const sections = ["Home", "AboutUs", "Features", "Events"];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (
              scrollPosition >= offsetTop &&
              scrollPosition < offsetTop + offsetHeight
            ) {
              setActiveSection(section);
              break;
            }
          }
        }
      };

      handleScroll(); // Check on mount
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isAuthenticated, pathname]);

  const isActive = (path: string) => {
    // For authenticated users, check pathname
    if (isAuthenticated) {
      return pathname === path;
    }
    
    // For public links on landing page
    if (path === "/") {
      return pathname === "/" && activeSection === "Home";
    }
    
    // Check if it's a hash link
    if (path.startsWith("/#")) {
      const section = path.split("#")[1];
      return pathname === "/" && activeSection === section;
    }
    
    // For other paths like /login
    return pathname === path;
  };

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
    { path: "/home", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: getProfilePath(), label: "My Profile" },
    { path: "/resources", label: "Resources" },
    { path: "/donations", label: "Donations" },
    { path: "/competitions", label: "Competitions" },
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  const handleLinkClick = (path: string, e?: React.MouseEvent) => {
    setMobileMenuOpen(false);
    
    // Handle hash navigation for same page
    if (path.startsWith("/#")) {
      e?.preventDefault();
      const section = path.split("#")[1];
      setActiveSection(section); // Immediately set active section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2">
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
                onClick={(e) => {
                  // Set navigation flag BEFORE Next.js navigation happens
                  if (!link.path.startsWith("/#")) {
                    sessionStorage.setItem('isNavigating', 'true');
                  }
                  handleLinkClick(link.path, e);
                }}
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

          {/* Mobile Menu Button */}
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
                onClick={(e) => {
                  // Set navigation flag BEFORE Next.js navigation happens
                  if (!link.path.startsWith("/#")) {
                    sessionStorage.setItem('isNavigating', 'true');
                  }
                  handleLinkClick(link.path, e);
                }}
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