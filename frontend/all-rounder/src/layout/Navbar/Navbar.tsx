'use client';

import { PublicNavbar } from "../Navbar/PublicNavbar";
import { AuthNavbar } from "../Navbar/AuthNavbar";

export interface NavbarProps {
  isAuthenticated?: boolean;
  userType?: "student" | "teacher" | "school" | "organization";
  onLogout?: () => void;
}

export function Navbar({ isAuthenticated = false, userType, onLogout }: NavbarProps) {
  // Simple wrapper component that renders the appropriate navbar
  return isAuthenticated ? (
    <AuthNavbar userType={userType} onLogout={onLogout} />
  ) : (
    <AuthNavbar />
  );
}