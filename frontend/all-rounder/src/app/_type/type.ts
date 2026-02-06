// ==================== USER INTERFACES ====================

// Student interface
export interface Student {
  id: number;
  name: string;
  email: string;
  photoUrl: string;
  age: number;
  schoolId: string;           // ← Changed from 'school'
  organizationId?: string;    // ← Added
  sex: "MALE" | "FEMALE";
  registeredEvents?: {
    eventId: string;
    registeredAt: string;
  }[];
  profile?: {
    bio: string;
    phone: string;
    address: string;
    zipCode: string;
  };
  stats?: {
    mails: number;
    followers: number;
    following: number;
  };
  skills?: {
    name: string;
  }[];
}

// Teacher interface
export interface Teacher {
  id: number;
  name: string;
  email: string;
  photoUrl: string;
  schoolId: string;           // ← Changed from 'school'
  organizationId?: string;    // ← Added
  sex: "MALE" | "FEMALE";
  registeredEvents?: {
    eventId: string;
    registeredAt: string;
  }[];
  profile?: {
    bio: string;
    phone: string;
    address: string;
    zipCode: string;
  };
}

// ==================== ORGANIZER INTERFACES ====================

// School interface
export interface School {
  id: string;                 // ← Changed to string
  name: string;
  location: string;
  logoUrl?: string;
}

// Organization interface
export interface Organization {
  id: string;                 // ← Changed from 'organizationId'
  name: string;
  location: string;
  logoUrl?: string;
}

// ==================== EVENT INTERFACES ====================

export type { OrganizerType, Event } from "@/context/useEventStore";