// Main Navbar exports
export { Navbar } from './Navbar';
export type { NavbarProps } from './Navbar';

// Individual components for flexibility
export { PublicNavbar } from './PublicNavbar';
export { AuthNavbar } from './AuthNavbar';
export { DesktopAuthNavbar } from './DesktopNavbar';
export { MobileAuthNavbar } from './MobileNavbar';
export { SideMenu } from './SideMenu';
export { UserDropdown } from './UserDropdown';
export { NavIcons } from './NavIcons';

// Hooks
export { useDarkMode } from './hooks/useDarkMode';
export { useScrollSection } from './hooks/useScrollSection';
export { useNavbar } from './hooks/useNavbar';

// Utils
export { 
  publicSections, 
  navIcons, 
  sideMenuItems, 
  cssVariables 
} from './utils/constants';
export { 
  scrollToSection, 
  handleHashNavigation, 
  isPublicSection, 
  getSectionLabel 
} from './utils/navigation';