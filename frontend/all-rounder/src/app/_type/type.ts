// ==================== USER INTERFACES ====================

// Student interface
export interface Student {
  uid: string; // Backend UID
  name: string;
  email: string;
  date_of_birth: string;
  contact_number?: string;
  profile_picture?: string;
  is_active: boolean;
  is_frozen: boolean;

  grade: string;
  organizationId?: string;
  created_at: string;
  updated_at: string;

  school_id: string;
  school?: School;

  skills?: Skill[];
  clubIds: string[];
  about?: string;  // Added for bio/description

  sex?: "MALE" | "FEMALE";
}

// Teacher interface
export interface Teacher {
  uid: string;
  name: string;
  email: string;
  date_of_birth: string;
  contact_number?: string;
  profile_picture?: string;
  is_active: boolean;

  subject?: string;
  designation?: string;

  staff_id?: string;
  created_at: string;
  updated_at: string;

  school_id: string;
  school?: School

  clubIds: string[];
  about?: string;  // Added for bio/description

  sex?: "MALE" | "FEMALE";
}

// ==================== ORGANIZER INTERFACES ====================

export interface Admin {
  uid: string;
  name: string;
  email: string;
  date_of_birth: string;
  contact_number?: string;
  profile_picture?: string;
  is_active: boolean;

  staff_id?: string;
  created_at: string;
  updated_at: string;


  school_id?: string;
  school?: School;
  organization_id?: string;
  organization?: Organization;
}

//School Interface
export interface School {
  school_id: string;
  name: string;
  address: string;
  district: string;
  student_count?: number;
  email: string;
  contact_number: string;
  principal_name?: string;
  web_link?: string;
  created_at: string;
  updated_at: string;

  students?: Student[];
  teachers?: Teacher[];
  admins?: Admin[];
  eventHosts?: EventHost[];
}

// Organization interface
export interface Organization {
  organization_id: string; // 
  organization_name: string;
  contact_person: string;
  website?: string;
  admins?: Admin[];
  eventHosts?: EventHost[];
  created_at: string;
  updated_at: string;
}

// EventHost interface
export interface EventHost {
  id: string;
  eventId: string;
  schoolId?: string;
  organizationId?: string;

  isPrimaryHost: boolean;
  createdAt: string;

  school?: School;
  organization?: Organization;
}

// ==================== SKILL INTERFACE ====================

export interface Skill {
  name: string;
}

export type OrganizerType = "School" | "Organization";

export interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  logoUrl?: string;
  schoolId: string;
  schoolName: string;
  foundedYear?: number;
  teacherInCharge?: {
    name: string;
    contactEmail?: string;
  };
  socialLinks?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
  visibility: "public" | "private";
  membersCount?: number;
  isJoined?: boolean;
  createdAt?: string;

  // Relations (kept separate from backend schema metadata as requested)
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  eventType: "workshop" | "competition" | "seminar" | "webinar" | "conference" | "other";
  startDate: string;
  endDate: string;
  location: string;

  organizerId: string;
  organizerType: OrganizerType;

  eligibility: string;
  registrationUrl?: string;
  isOnline: boolean;
  visibility: "public" | "private";
  createdBy: string; // User ID
  isDeleted?: boolean;

  // UI/Legacy metadata (event-specific, not in school/org)
  imageUrl?: string;
  status?: "Registered" | "Open";
  requirements?: string[];
  prizes?: string[];
  contactEmail?: string;
  time?: string; // Derived or extra info
}
