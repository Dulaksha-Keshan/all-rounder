"use client";

import { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Check, X, Sun, Moon } from "lucide-react";
import { useUserStore } from "@/context/useUserStore";
import { useStudentStore } from "@/context/useStudentStore";
import { useTeacherStore } from "@/context/useTeacherStore";

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
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const {
    isAuthenticated: storeAuth,
    userRole: storeRole,
    currentUser,
    followRequests,
    acceptFollowRequest,
    declineFollowRequest,
    logout
  } = useUserStore();

  const { students } = useStudentStore();
  const { teachers } = useTeacherStore();

  // Use props if provided, otherwise fallback to store
  const isAuth = isAuthenticated || storeAuth;
  const type = userType || storeRole;

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Track active section based on scroll position
  useEffect(() => {
    if (!isAuth && pathname === "/") {
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
  }, [isAuth, pathname]);

  const isActive = (path: string) => {
    // For authenticated users, check pathname
    if (isAuth) {
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
    { path: "", label: "Login" },
  ];

  const getProfilePath = () => {
    switch (type) {
      case "teacher":
        return "/teacher-profile";
      case "school":
        return "/school-profile";
      case "organization":
        return "/organization-profile";
      default:
        return "/user/student/" + (currentUser?.id || "1");
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

  const links = isAuth ? authenticatedLinks : publicLinks;

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
    <nav className="bg-[var(--white)] sticky top-0 z-50 shadow-lg border-b border-[var(--gray-200)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={isAuth ? "/home" : "/"} className="flex items-center gap-2">
            <div className="relative h-10 sm:h-12 lg:h-15 w-auto">
              {/* Using a rough aspect ratio based on typical logo dims, but letting css control height */}
              <NextImage
                src="/icons/Logo.png"
                alt="All-Rounder Logo"
                width={200}
                height={60}
                className="h-10 sm:h-12 lg:h-15 w-auto object-contain"
                priority
              />
            </div>
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
                className={`px-3 py-2 rounded-md transition ${isActive(link.path)
                  ? "bg-[var(--primary-purple)] text-white"
                  : "text-[var(--text-main)] hover:bg-[var(--secondary-light-lavender)]/30"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Notifications / Follow Requests */}
            {isAuthenticated && (
              <div className="relative mr-4">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg bg-[var(--secondary-light-lavender)]/20 text-[var(--primary-purple)] hover:bg-[var(--secondary-light-lavender)] transition-all relative"
                >
                  <Bell size={20} />
                  {followRequests.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                  )}
                </button>

                {/* Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[var(--card-bg)] rounded-xl shadow-xl border border-[var(--gray-200)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-4 border-b border-[var(--gray-100)]">
                      <h3 className="font-bold text-[var(--text-main)]">Notifications</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {followRequests.length === 0 ? (
                        <div className="p-8 text-center text-[var(--text-muted)]">
                          <p className="text-sm">No new notifications</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-[var(--gray-100)]">
                          {followRequests.map(requestId => {
                            const requestUser = students.find(s => s.id === requestId) || teachers.find(t => t.id === requestId);
                            if (!requestUser) return null;

                            return (
                              <div key={requestId} className="p-4 hover:bg-[var(--gray-50)] transition-colors">
                                <div className="flex items-start gap-3">
                                  <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                    <NextImage src={requestUser.photoUrl || "/images/no-avatar.png"} alt={requestUser.name} fill className="object-cover" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-[var(--text-main)] truncate">{requestUser.name}</p>
                                    <p className="text-xs text-[var(--text-muted)] mb-3">Wants to follow you</p>

                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => acceptFollowRequest(requestId)}
                                        className="flex-1 py-1.5 bg-[var(--primary-blue)] text-white text-xs font-bold rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                                      >
                                        <Check size={14} /> Accept
                                      </button>
                                      <button
                                        onClick={() => declineFollowRequest(requestId)}
                                        className="flex-1 py-1.5 bg-[var(--gray-100)] text-[var(--gray-700)] text-xs font-bold rounded-md hover:bg-[var(--gray-200)] transition-colors flex items-center justify-center gap-1"
                                      >
                                        <X size={14} /> Decline
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-[var(--secondary-light-lavender)]/20 text-[var(--primary-purple)] hover:bg-[var(--secondary-light-lavender)] transition-all"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {isAuth && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-300">
                <div className="flex items-center gap-2">
                  <NextImage
                    src="/icons/Avatar.png"
                    alt="User"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="capitalize text-sm text-[var(--text-main)]">
                    {type}
                  </span>
                </div>

                <button
                  onClick={() => logout && logout()}
                  className="px-4 py-2 bg-[var(--primary-blue)] hover:shadow-lg text-white rounded-md transition font-bold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-[var(--secondary-light-lavender)]/20 text-[var(--primary-purple)]"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-[var(--secondary-light-lavender)]"
            >
              <NextImage
                src={mobileMenuOpen ? "/icons/close.jpeg" : "/icons/menu.png"}
                alt="Menu"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[var(--white)] border-t border-[var(--gray-200)] pb-4">
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
                className={`block px-3 py-2 rounded-md transition ${isActive(link.path)
                  ? "bg-[var(--primary-purple)] text-white font-bold"
                  : "text-[var(--text-main)] hover:bg-[var(--secondary-light-lavender)]/30"
                  }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuth && (
              <div className="pt-3 mt-3 border-t border-gray-300">
                <div className="flex items-center gap-2 px-3 py-2">
                  <NextImage
                    src="/icons/Avatar.png"
                    alt="User"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="capitalize">{type}</span>
                </div>

                <button
                  onClick={() => {
                    logout?.();
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
