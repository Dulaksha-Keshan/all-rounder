"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  HomeIcon,
  BookOpen,
  Trophy,
  Calendar,
  ChevronDown,
  HelpCircle,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import NextImage from "next/image";

// NEW: Import your global store
import { useUserStore } from "@/context/useUserStore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const { isAuthenticated, userRole, logout } = useUserStore();

  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeIcon, setActiveIcon] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path;

  // Updated to match your backend roles (STUDENT, TEACHER, SCHOOL_ADMIN, ORG_ADMIN)
  const getProfilePath = () => {
    switch (userRole) {
      case "TEACHER":
        return `/user/teacher/${useUserStore.getState().currentUser?.uid}`;
      case "SCHOOL_ADMIN":
        return `/user/school/${useUserStore.getState().currentUser?.school_id}`;
      case "ORG_ADMIN":
        return "/user/organization";
      default:
        // Default covers STUDENT or SUPER_ADMIN
        return `/user/student/${useUserStore.getState().currentUser?.uid}`;
    }
  };

  const handleLogout = async () => {
    try {
      // Call the store's logout action (handles Firebase & API Gateway)
      await logout();
      // Redirect to landing page after successful logout
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // paths and icons for the main navigation - auth user
  const navIcons = [
    { id: "home", label: "Home", icon: HomeIcon, path: "/home" },
    { id: "resources", label: "Resources", icon: BookOpen, path: "/resourceSharing" },
    { id: "events", label: "Events", icon: Calendar, path: "/events" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  ];

  // left side dropdown menu - auth user
  const sideMenuItems = [
    { label: "Help & FAQs", icon: HelpCircle, path: "/help" },
    { label: "About Us", icon: Users, path: "/vision" },
  ];

  useEffect(() => {
    const currentNav = navIcons.find((nav) => isActive(nav.path));
    if (currentNav) setActiveIcon(currentNav.id);
  }, [pathname]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  /* ---------------- PUBLIC NAVBAR ---------------- */

  if (!isAuthenticated) {
    return (
      <>
        {/* Desktop Public Navbar */}
        <nav className="fixed top-4 left-4 right-4 z-50 hidden md:block pointer-events-none">
          <div className="pointer-events-auto bg-gradient-to-r from-white/80 via-[#F8F7FF]/80 to-white/80 backdrop-blur-xl rounded-[50px] shadow-2xl border-2 border-[#DCD0FF]/50 px-6 py-2">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0"
              >
                {/* Logo */}
                <div className="relative h-center w-auto">
                  <NextImage
                    src="/icons/Logo.png"
                    alt="All-Rounder Logo"
                    width={200}
                    height={60}
                    className="h-auto w-29 object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Public Navigation Links - Desktop view */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => router.push("/")}
                  className="text-[#34365C] hover:text-[#8387CC] transition font-semibold text-sm"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("AboutUs")}
                  className="text-[#34365C] hover:text-[#8387CC] transition font-semibold text-sm"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection("Features")}
                  className="text-[#34365C] hover:text-[#8387CC] transition font-semibold text-sm"
                >
                  Features
                </button>
                <button
                  onClick={() => router.push("/vision")}
                  className="text-[#34365C] hover:text-[#8387CC] transition font-semibold text-sm"
                >
                  Vision
                </button>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <Link
                  href="/login"
                  className="px-6 py-2 bg-gradient-to-r from-[#8387CC] via-[#6B73C8] to-[#4169E1] hover:from-[#6B73C8] hover:to-[#3557c1] text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:scale-105 text-sm"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Public Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 md:hidden lg:hidden bg-gradient-to-r from-white/80 via-[#F8F7FF]/80 to-white/80 backdrop-blur-xl shadow-lg border-b-2 border-[#DCD0FF]/50">
          <div className="flex items-center justify-between px-4 py-2.5">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-center w-auto">
                <NextImage
                  src="/icons/Logo.png"
                  alt="All-Rounder Logo"
                  width={200}
                  height={60}
                  className="h-auto w-29 object-contain"
                  priority
                />
              </div>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-[#DCD0FF]/50 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#34365C]" />
              ) : (
                <Menu className="w-5 h-5 text-[#34365C]" />
              )}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="bg-gradient-to-b from-white/90 to-[#F8F7FF]/90 backdrop-blur-md border-t-2 border-[#DCD0FF]/50 px-4 py-4 space-y-3">
              {["Home", "AboutUs", "Features", "Vision"].map((section) => (
                <button
                  key={section}
                  onClick={() => {
                    if (section === "Vision") {
                      router.push("/vision");
                    } else {
                      scrollToSection(section);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-[#34365C] hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50 rounded-lg transition font-medium"
                >
                  {/* Public Navigation Links - Mobile view */}
                  {section === "Home"
                    ? "Home"
                    : section === "AboutUs"
                      ? "About Us"
                      : section === "Features"
                        ? "Features"
                        : "Vision"}
                </button>
              ))}

              <div className="flex items-center justify-end pt-3 border-t border-[#DCD0FF]/50">
                <Link
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-2 bg-gradient-to-r from-[#8387CC] via-[#6B73C8] to-[#4169E1] hover:from-[#6B73C8] hover:to-[#3557c1] text-white font-semibold rounded-full transition-all shadow-lg hover:shadow-xl"
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

  /* ---------------- AUTHENTICATED NAVBAR ---------------- */

  // Helper to format the role for display (e.g., "SCHOOL_ADMIN" -> "School Admin")
  const displayRole = userRole ? userRole.replace('_', ' ').toLowerCase() : "User";

  return (
    <>
      {/* Desktop Authenticated Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 hidden lg:block pointer-events-none">
        <div className="pointer-events-auto bg-gradient-to-r from-white/80 via-[#F8F7FF]/80 to-white/80 backdrop-blur-xl rounded-[50px] shadow-2xl border-2 border-[#DCD0FF]/50 px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSideMenuOpen(!sideMenuOpen)}
                className="p-1.5 rounded-full hover:bg-[#DCD0FF]/50 transition-all hover:scale-110"
              >
                <Menu className="w-5 h-5 text-[#34365C]" />
              </button>

              <Link
                href="/home"
                className="flex items-center gap-2 hover:opacity-80 transition"
              >
                {/* Logo */}
                <div className="relative h-center w-auto">
                  <NextImage
                    src="/icons/Logo.png"
                    alt="All-Rounder Logo"
                    width={200}
                    height={60}
                    className="h-auto w-29 object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Center Icons */}
            <div className="flex items-center gap-2">
              {navIcons.map((nav) => {
                const Icon = nav.icon;
                const isIconActive = activeIcon === nav.id;

                return (
                  <Link
                    key={nav.id}
                    href={nav.path}
                    onClick={() => setActiveIcon(nav.id)}
                    className="relative group"
                  >
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 ${isIconActive
                        ? "bg-gradient-to-r from-[#8387CC] via-[#6B73C8] to-[#4169E1] text-white shadow-lg"
                        : "hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50 text-[#34365C]"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span
                        className={`overflow-hidden transition-all duration-300 font-medium text-sm ${isIconActive
                          ? "max-w-[200px] opacity-100"
                          : "max-w-0 opacity-0"
                          }`}
                      >
                        {nav.label}
                      </span>
                    </div>

                    {!isIconActive && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gradient-to-r from-[#34365C] to-[#8387CC] text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg">
                        {nav.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Account */}
            <div className="flex items-center gap-3">
              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAccountDropdown(!accountDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8387CC] to-[#4169E1] flex items-center justify-center text-white shadow-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm capitalize text-[#34365C] font-semibold hidden lg:block">
                    {useUserStore.getState().currentUser?.name || 'User'} ({displayRole})
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#34365C] hidden lg:block" />
                </button>

                {accountDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setAccountDropdown(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-gradient-to-br from-white/95 via-[#F8F7FF]/95 to-[#F0EFFF]/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-[#DCD0FF]/50 py-2 z-50">
                      <div className="px-4 py-3 border-b border-[#DCD0FF]/50">
                        <div className="text-xs text-gray-500 font-medium">
                          Signed in as
                        </div>
                        <div className="text-sm capitalize text-[#34365C] font-semibold">
                          {useUserStore.getState().currentUser?.name || 'User'} 
                        </div>
                      </div>

                      <Link
                        href={`${getProfilePath()}`}
                        onClick={() => setAccountDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50 transition text-[#34365C]"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm font-medium">My Profile</span>
                      </Link>

                      <div className="border-t border-[#DCD0FF]/50 mt-2 pt-2">
                        <button
                          onClick={() => {
                            handleLogout();
                            setAccountDropdown(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50 transition text-red-600 w-full rounded-lg"
                        >
                          <LogOut className="w-4 h-4" />
                          <span
                            className="text-sm font-medium">
                            Logout
                          </span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Side Menu Dropdown - Desktop only */}
      {sideMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm hidden lg:block"
            onClick={() => setSideMenuOpen(false)}
          />
          <div className="fixed top-20 left-4 z-50 w-64 bg-gradient-to-br from-white/90 via-[#F8F7FF]/90 to-[#F0EFFF]/90 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-[#DCD0FF]/50 py-4 hidden lg:block">
            <div className="px-4 pb-3 border-b border-[#DCD0FF]/50">
              <h3 className="text-sm font-bold text-[#34365C]">
                Quick Links
              </h3>
            </div>

            {sideMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setSideMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50 transition text-[#34365C]"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* Mobile Authenticated Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-gradient-to-r from-white/80 via-[#F8F7FF]/80 to-white/80 backdrop-blur-xl shadow-lg border-b-2 border-[#DCD0FF]/50">
        <div className="flex items-center justify-between px-4 py-2.5">
          <Link href="/home" className="flex items-center gap-2">
            {/* Logo */}
            <div className="relative h-center w-auto">
              <NextImage
                src="/icons/Logo.png"
                alt="All-Rounder Logo"
                width={200}
                height={60}
                className="h-auto w-29 object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-[#DCD0FF]/50 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-[#34365C]" />
              ) : (
                <Menu className="w-5 h-5 text-[#34365C]" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="bg-gradient-to-b from-white/90 to-[#F8F7FF]/90 backdrop-blur-md border-t-2 border-[#DCD0FF]/50 px-4 py-4 space-y-3">
            {/* Navigation Icons */}
            {navIcons.map((nav) => {
              const Icon = nav.icon;
              return (
                <Link
                  key={nav.id}
                  href={nav.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActiveIcon(nav.id);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeIcon === nav.id
                    ? "bg-gradient-to-r from-[#8387CC] via-[#6B73C8] to-[#4169E1] text-white shadow-lg"
                    : "text-[#34365C] hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-semibold">{nav.label}</span>
                </Link>
              );
            })}

            {/* Profile & Logout */}
            <div className="border-t border-[#DCD0FF]/50 pt-3 mt-3">
              <Link
                href={getProfilePath()}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50 transition text-[#34365C] rounded-lg"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">My Profile</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-red-50/50 transition text-red-600 w-full rounded-lg mt-2"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>

            {/* Quick Links */}
            <div className="border-t border-[#DCD0FF]/50 pt-3">
              <div className="px-4 pb-2">
                <h3 className="text-xs font-bold text-[#34365C] opacity-60">
                  Quick Links
                </h3>
              </div>
              {sideMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-[#DCD0FF]/50 hover:to-[#F0EFFF]/50 transition text-[#34365C] rounded-lg"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
