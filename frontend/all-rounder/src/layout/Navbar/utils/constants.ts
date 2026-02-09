import { HomeIcon, LayoutDashboard, BookOpen, Gift, Calendar, User } from "lucide-react";

export const publicSections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About Us" },
  { id: "features", label: "Features" },
  { id: "events", label: "Events" },
] as const;

export const navIcons = [
  { id: "home", path: "/home", label: "Home", icon: HomeIcon },
  { id: "dashboard", path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "resources", path: "/resourceSharing", label: "Resources", icon: BookOpen },
  { id: "donations", path: "/donations", label: "Donations", icon: Gift },
  { id: "competitions", path: "/events", label: "Competitions", icon: Calendar },
  { id: "profile", path: "/profile", label: "My Profile", icon: User },
] as const;

export const sideMenuItems = [
  { path: "/onboarding", label: "Learn Hub", icon: "GraduationCap" },
  { path: "/team", label: "Meet Our Team", icon: "Users" },
  { path: "/faq", label: "Help & FAQ", icon: "HelpCircle" },
] as const;

// CSS Variables mapping
export const cssVariables = {
  colors: {
    primaryDark: "var(--primary-dark-purple)",
    primaryPurple: "var(--primary-purple)",
    primaryBlue: "var(--primary-blue)",
    secondaryLavender: "var(--secondary-light-lavender)",
    secondaryPaleLavender: "var(--secondary-pale-lavender)",
    contactBg: "var(--contact-bg)",
    accentPurple: "var(--accent-purple-text)",
    white: "var(--white)",
    black: "var(--black)",
    gray50: "var(--gray-50)",
    gray100: "var(--gray-100)",
    gray200: "var(--gray-200)",
    gray600: "var(--gray-600)",
    gray700: "var(--gray-700)",
    pageBg: "var(--page-bg)",
    cardBg: "var(--card-bg)",
    textMain: "var(--text-main)",
    textMuted: "var(--text-muted)",
  },
  gradients: {
    purpleBlue: "linear-gradient(to bottom right, var(--primary-purple), var(--primary-blue))",
    lavenderPale: "linear-gradient(to bottom right, var(--secondary-light-lavender), var(--secondary-pale-lavender))",
  },
} as const;