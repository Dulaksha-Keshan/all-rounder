'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Award, Menu, X, User, LogOut, LayoutDashboard, BookOpen, Gift, Trophy, Calendar, ChevronDown, Sun, Moon, HelpCircle, Users, GraduationCap, HomeIcon,  } from "lucide-react";
import { useState, useEffect } from "react";

interface NavbarProps {
  isAuthenticated?: boolean;
  userType?: "student" | "teacher" | "school" | "organization";
  onLogout?: () => void;
}

export function Navbar({ isAuthenticated = false, userType, onLogout }: NavbarProps) {
  const pathname = usePathname();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  //const isActive = (path: string) => pathname === path;

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
    { path: "", label: "Login" },
  ];

  // Determine the profile path based on user type
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

  // Navigation icons for authenticated users
  const navIcons = [
    // { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    // { id: "resources", label: "Resources", icon: BookOpen, path: "/resources" },
    // { id: "donations", label: "Donations", icon: Gift, path: "/donations" },
    // { id: "events", label: "Events", icon: Calendar, path: "/competitions" },
    // { id: "leaderboard", label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
    { id: "home", path: "/home", label: "Home", icon: HomeIcon},
    { id: "dashboard", path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "resources", path: "/resources", label: "Resources", icon: BookOpen },
    { id: "donations", path: "/donations", label: "Donations", icon: Gift },
    { id: "competitions", path: "/competitions", label: "Competitions", icon: Calendar },
    { id: "profile", path: getProfilePath(), label: "My Profile", icon: User },
  ];

  const links = isAuthenticated ? navIcons : publicLinks;

  // Set active icon based on current path
  useEffect(() => {
    const currentNav = navIcons.find(nav => isActive(nav.path));
    if (currentNav) {
      setActiveIcon(currentNav.id);
    }
  }, [pathname]);

  const scrollToSection = (path: string, e?: React.MouseEvent) => {
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
  
    const element = document.getElementById(path.split("#")[1]);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

 
  // Public (Unauthenticated) Navbar
  if (!isAuthenticated) {
    return (
      <>
        {/* Desktop Public Navbar */}
        <nav className="fixed top-0 left-1.5 right-1.5 z-50 md:block">
          <div className="flex items-center justify-center px-8 py-0">
            {/* Single white hanging panel with everything inside */}
            <div className="bg-white rounded-[40px] shadow-2xl border-2 border-[#DCD0FF]
                              px-8 py-4 flex items-center justify-between gap-8
                              w-full max-w-7xl mx-auto">

              {/* Left: Logo */}
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition flex-shrink-0">
                <Award className="w-10 h-10 text-[#8387CC]" />
                <span className="font-bold text-xl text-[#34365C]">All-Rounder</span>
              </Link>

              {/* Middle: Navigation Links */}
              <div className="flex items-center gap-8">
                <button
                  onClick={() => scrollToSection('home')}
                  className="text-[#34365C] hover:text-[#8387CC] transition font-medium"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-[#34365C] hover:text-[#8387CC] transition font-medium"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-[#34365C] hover:text-[#8387CC] transition font-medium"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('events')}
                  className="text-[#34365C] hover:text-[#8387CC] transition font-medium"
                >
                  Events
                </button>
              </div>

              {/* Right: Login and Dark Mode Toggle */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-[#34365C]" />
                  ) : (
                    <Moon className="w-5 h-5 text-[#34365C]" />
                  )}
                </button>
                <Link
                  href="/login"
                  className="px-6 py-2 bg-[#4169E1] hover:bg-[#3557c1] text-white rounded-full transition shadow-lg"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Public Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white shadow-lg border-b-2 border-[#DCD0FF]">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Award className="w-8 h-8 text-[#8387CC]" />
              <span className="font-bold text-lg text-[#34365C]">All-Rounder</span>
            </Link>

            {/* Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#34365C]" />
              ) : (
                <Menu className="w-6 h-6 text-[#34365C]" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="bg-white border-t-2 border-[#DCD0FF] px-4 py-4 space-y-3">
              <button
                onClick={() => {
                  scrollToSection('home');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-[#34365C] hover:bg-[#F8F8FF] rounded-lg transition"
              >
                Home
              </button>
              <button
                onClick={() => {
                  scrollToSection('about');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-[#34365C] hover:bg-[#F8F8FF] rounded-lg transition"
              >
                About Us
              </button>
              <button
                onClick={() => {
                  scrollToSection('features');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-[#34365C] hover:bg-[#F8F8FF] rounded-lg transition"
              >
                Features
              </button>
              <button
                onClick={() => {
                  scrollToSection('events');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-[#34365C] hover:bg-[#F8F8FF] rounded-lg transition"
              >
                Events
              </button>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-[#34365C]" />
                  ) : (
                    <Moon className="w-5 h-5 text-[#34365C]" />
                  )}
                </button>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-6 py-2 bg-[#4169E1] hover:bg-[#3557c1] text-white rounded-full transition"
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

  // Authenticated Navbar
  return (
    <>
      {/* Desktop Authenticated Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 hidden lg:block">
        <div className="bg-white rounded-[50px] shadow-2xl border-2 border-[#DCD0FF] px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Menu Icon + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSideMenuOpen(!sideMenuOpen)}
                className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6 text-[#34365C]" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
                <Award className="w-8 h-8 text-[#8387CC]" />
                <span className="font-bold text-lg text-[#34365C] hidden xl:block">All-Rounder</span>
              </Link>
            </div>

            {/* Center: Icon Navigation */}
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
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        isIconActive
                          ? "bg-[#8387CC] text-white shadow-lg"
                          : "hover:bg-[#DCD0FF] text-[#34365C]"
                      }`}
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
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-[#34365C] text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {nav.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right: User Account */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdown(!accountDropdown)}
                className="flex items-center gap-3 px-4 py-2 rounded-full hover:bg-[#DCD0FF] transition"
              >
                <div className="w-10 h-10 rounded-full bg-[#8387CC] flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-sm capitalize text-[#34365C] hidden lg:block">{userType}</span>
                <ChevronDown className="w-4 h-4 text-[#34365C] hidden lg:block" />
              </button>

              {/* Account Dropdown */}
              {accountDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setAccountDropdown(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-[#DCD0FF] py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="text-xs text-gray-500">Signed in as</div>
                      <div className="text-sm capitalize text-[#34365C]">{userType}</div>
                    </div>
                    <Link
                      href={getProfilePath()}
                      onClick={() => setAccountDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F8FF] transition text-[#34365C]"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Profile</span>
                    </Link>
                    <div className="border-t border-gray-200 mt-2 pt-2">
                      <button
                        onClick={() => {
                          onLogout?.();
                          setAccountDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Authenticated Navbar */}
      <nav className="fixed top-2 left-2 right-2 z-50 lg:hidden">
        <div className="bg-white rounded-[30px] shadow-2xl border-2 border-[#DCD0FF] px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Menu Icon + Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSideMenuOpen(!sideMenuOpen)}
                className="p-2 rounded-full hover:bg-[#DCD0FF] transition"
              >
                <Menu className="w-5 h-5 text-[#34365C]" />
              </button>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Award className="w-7 h-7 text-[#8387CC]" />
                <span className="font-bold text-base text-[#34365C] hidden sm:block">All-Rounder</span>
              </Link>
            </div>

            {/* Right: User Account */}
            <button
              onClick={() => setAccountDropdown(!accountDropdown)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#DCD0FF] transition"
            >
              <div className="w-8 h-8 rounded-full bg-[#8387CC] flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs capitalize text-[#34365C] hidden sm:block">{userType}</span>
            </button>

            {/* Mobile Account Dropdown */}
            {accountDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAccountDropdown(false)}
                />
                <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border-2 border-[#DCD0FF] py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="text-xs text-gray-500">Signed in as</div>
                    <div className="text-sm capitalize text-[#34365C]">{userType}</div>
                  </div>
                  <Link
                    href={getProfilePath()}
                    onClick={() => setAccountDropdown(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F8FF] transition text-[#34365C]"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">My Profile</span>
                  </Link>
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <button
                      onClick={() => {
                        onLogout?.();
                        setAccountDropdown(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Bottom Navigation Icons */}
          <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-200">
            {navIcons.map((nav) => {
              const Icon = nav.icon;
              const isIconActive = isActive(nav.path);
              
              return (
                <Link
                  key={nav.id}
                  href={nav.path}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`p-2 rounded-full transition ${
                      isIconActive
                        ? "bg-[#8387CC] text-white"
                        : "text-[#34365C]"
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs ${isIconActive ? "text-[#8387CC]" : "text-gray-600"}`}>
                    {nav.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Side Menu (works for both desktop and mobile) */}
      {sideMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={() => setSideMenuOpen(false)}
          />
          
          {/* Side Menu Panel */}
          <div className="fixed top-20 lg:top-24 left-2 lg:left-4 w-64 bg-white rounded-3xl shadow-2xl border-2 border-[#DCD0FF] py-6 z-50 animate-in slide-in-from-left">
            <div className="px-6 mb-4 flex items-center justify-between">
              <h3 className="text-lg text-[#34365C]">Menu</h3>
              <button
                onClick={() => setSideMenuOpen(false)}
                className="p-1 rounded-full hover:bg-[#DCD0FF] transition lg:hidden"
              >
                <X className="w-5 h-5 text-[#34365C]" />
              </button>
            </div>
            
            <div className="space-y-1">
              <Link
                href="/onboarding"
                onClick={() => setSideMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 hover:bg-[#F8F8FF] transition ${
                  isActive("/onboarding") ? "bg-[#DCD0FF] text-[#34365C]" : "text-gray-700"
                }`}
              >
                <GraduationCap className="w-5 h-5" />
                <span className="text-sm">Learn Hub</span>
              </Link>
              <Link
                href="/team"
                onClick={() => setSideMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 hover:bg-[#F8F8FF] transition ${
                  isActive("/team") ? "bg-[#DCD0FF] text-[#34365C]" : "text-gray-700"
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Meet Our Team</span>
              </Link>
              <Link
                href="/faq"
                onClick={() => setSideMenuOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 hover:bg-[#F8F8FF] transition ${
                  isActive("/faq") ? "bg-[#DCD0FF] text-[#34365C]" : "text-gray-700"
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="text-sm">Help & FAQ</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </>
    );
}