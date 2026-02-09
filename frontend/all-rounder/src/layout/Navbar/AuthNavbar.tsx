'use client';

import { DesktopAuthNavbar } from "./DesktopNavbar";
import { MobileAuthNavbar } from "./MobileNavbar";
import { SideMenu } from "./SideMenu";
import { useNavbar } from './hooks/useNavbar';

interface AuthNavbarProps {
  userType?: "student" | "teacher" | "school" | "organization";
  onLogout?: () => void;
}

export function AuthNavbar({ userType, onLogout }: AuthNavbarProps) {
  const { 
    sideMenuOpen, 
    toggleSideMenu, 
    closeAllMenus 
  } = useNavbar();

  return (
    <>
      <DesktopAuthNavbar 
        userType={userType} 
        onLogout={onLogout}
        onMenuToggle={toggleSideMenu}
      />
      <MobileAuthNavbar 
        userType={userType} 
        onLogout={onLogout}
        onMenuToggle={toggleSideMenu}
      />
      <SideMenu 
        isOpen={sideMenuOpen} 
        onClose={() => {
          closeAllMenus();
        }} 
      />
    </>
  );
}