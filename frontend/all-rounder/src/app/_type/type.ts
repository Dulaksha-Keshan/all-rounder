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
  eventHosts?: Host[];

  sex?: "MALE" | "FEMALE";
}

// Organization interface
export interface Organization {
  organization_id: string; // 
  organization_name: string;
  contact_person: string;
  website?: string;
  admins?: Admin[];
  eventHosts?: Host[];
  created_at: string;
  updated_at: string;
  sex?: "MALE" | "FEMALE";
}

// Matches the embedded HostSchema
export interface Host {
  id: string;
  hostType: "school" | "organization";
  hostId: string;
  hostName: string;
  isPrimary: boolean;
}



export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "EVENT" | "POST" | "RESOURCE" | "CLUB" | "SYSTEM";
  recipient: string;
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

// ==================== SKILL INTERFACE ====================



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

// Main Event interface
export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  eventType: "workshop" | "competition" | "seminar" | "webinar" | "conference" | "other";
  startDate: Date | string; // Allow string for frontend handling
  endDate: Date | string;
  location: string;
  organizer: string;
  hosts?: Host[];
  eligibility: string;
  registrationUrl?: string;
  isOnline: boolean;
  visibility: "public" | "private";
  createdBy: string;
  isDeleted?: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;

  // UI/Legacy metadata (kept for compatibility if needed, else optional)
  imageUrl?: string;
  status?: "Registered" | "Open";
  requirements?: string[];
  prizes?: string[];
  contactEmail?: string;
  time?: string;
  organizerId?: string; // Legacy support
  organizerType?: OrganizerType; // Legacy support
}

// Defining types locally to be self-contained, mirroring PostType usage
export interface Post {
  _id: string; // Mongoose ID
  title: string;
  content: string;
  category: string;
  postType: "achievement" | "participation" | "event" | "project";
  visibility: "public" | "private";
  attachments?: string[];
  tags?: string[];
  student: string;
  school: string;
  organization: string;
  likes: string[];
  comments: Comment[]; // Updated to use the new Comment interface
  /* 
     Old structure for reference/compatibility if needed temporarily:
     {
         student: string; 
         comment: string;
         createdAt: string;
     }[]
  */
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean; // UI state

  // Legacy/UI mappings
  time?: string; // Derived from createdAt
  author?: { // Derived from student/school/org info
    name: string;
    role: string;
    image?: string;
  };
}


export interface Achievement {
  _id: string; // Mongoose ID
  user: string; // ObjectId as string (User)
  title: string;
  description: string;
  category: string;
  level: "local" | "national" | "international";
  dateAchieved: string; // Date as string
  organization: string;
  proofUrl: string;
  visibility: "public" | "private";
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  postId: string;
  userId: string;
  userType: "STUDENT" | "TEACHER" | "ADMIN";
  content: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;

  // UI convenience (populated or derived)
  user?: {
    name: string;
    image?: string;
  };
}

export interface Like {
  _id: string;
  postId: string;
  userId: string;
  userType: "STUDENT" | "TEACHER" | "ADMIN";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Verification {
  _id: string;
  userId: string; // Schema says String (could be UID or ObjectId string depending on usage)
  userType: "STUDENT" | "TEACHER" | "ADMIN";
  verificationMethod: "DOCUMENT_AI" | "TEACHER_APPROVAL" | "ADMIN_APPROVAL";
  verificationStatus: "PENDING" | "APPROVED" | "REJECTED";
  verificationRequestedBy: number; // Schema says Number
  verifiedAt?: string; // Date as string
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceRequest {
  id: string;
  title: string;
  description: string;
  resourceType: "funding" | "equipment" | "mentorship" | "venue" | "software" | "other";
  quantity: number;
  urgency: "low" | "medium" | "high";
  requestedFor: string;
  neededBy?: string; // Date string
  status: "pending" | "approved" | "rejected" | "fulfilled";
  visibility: "public" | "private";
  createdBy: string; // User ID
  remarks?: string;
  contactNumber?: string;
  email?: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;

}


export interface Skill {
  id: string; // Changed to string
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  endorsements: number;
  description?: string; // Added from controller usage
}