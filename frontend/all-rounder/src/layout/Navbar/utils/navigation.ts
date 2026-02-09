import { publicSections } from './constants';

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

export const handleHashNavigation = (path: string, e?: React.MouseEvent) => {
  if (path.startsWith('/#')) {
    e?.preventDefault();
    const section = path.split('#')[1];
    scrollToSection(section);
    return true;
  }
  return false;
};

export const isPublicSection = (sectionId: string) => {
  return publicSections.some(section => section.id === sectionId);
};

export const getSectionLabel = (sectionId: string) => {
  const section = publicSections.find(s => s.id === sectionId);
  return section?.label || sectionId;
};