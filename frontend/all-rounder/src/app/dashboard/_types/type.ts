// Student interface
export interface Student {
  id: number;
  name: string;
  email: string;
  photoUrl: string;
  age: number;
  school: string;
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
  }

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
    school: string;
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
    }
  }
  
  // School interface 
export interface School {
    id: number;
    name: string;
    location: string;
    logoUrl?: string;
  }