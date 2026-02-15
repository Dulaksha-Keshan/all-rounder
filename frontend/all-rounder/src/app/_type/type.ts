// ==================== USER INTERFACES ====================

// Student interface
export interface Student {
  id: string; // Changed to string for UUID
  uid?: string; // Backend UID
  name: string;
  email: string;
  photoUrl?: string; // Backend: profile_picture
  age?: number; // Backend: Derived from date_of_birth
  dob?: string; // Backend: date_of_birth
  schoolId: string;
  organizationId?: string;
  sex?: "MALE" | "FEMALE"; // Keep for now, backend doesn't explicitly show enum but likely exists
  registeredEvents?: {
    eventId: string;
    registeredAt: string;
  }[];
  profile?: {
    bio?: string; // Backend: about
    phone?: string; // Backend: contact_number
    address?: string;
    zipCode?: string;
  };
  skills?: {
    name: string;
  }[];
  grade?: string; // Backend: grade
  clubIds?: string[]; // Backend: clubIds
}

// Teacher interface
export interface Teacher {
  id: string; // Changed to string (UUID)
  uid?: string;
  name: string;
  email: string;
  photoUrl?: string;
  schoolId: string;
  organizationId?: string;
  sex?: "MALE" | "FEMALE";
  subject?: string; // Backend: subject
  designation?: string; // Backend: designation
  registeredEvents?: {
    eventId: string;
    registeredAt: string;
  }[];
  profile?: {
    bio?: string;
    phone?: string;
    address?: string;
    zipCode?: string;
  };
  clubIds?: string[];
}

// ==================== ORGANIZER INTERFACES ====================

// School interface
export interface School {
  id: string;
  school_id?: string; // Matches backend field
  name: string;
  address?: string; // Backend: address
  district?: string; // Backend: district
  student_count?: number; // Backend: student_count
  email?: string;
  contact_number?: string;
  principal_name?: string;
  web_link?: string;
  location?: string; // Frontend legacy
  logoUrl?: string;
}

// Organization interface
export interface Organization {
  id: string;
  organization_id?: string; // Matches backend field
  name: string; // Frontend legacy
  organization_name?: string; // Backend match
  contact_person?: string;
  website?: string;
  location?: string;
  logoUrl?: string;
}

// ==================== EVENT INTERFACES ====================

export type { OrganizerType, Event } from "@/context/useEventStore";