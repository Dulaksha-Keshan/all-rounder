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
  }
  
  // School interface 
export interface School {
    id: number;
    name: string;
    location: string;
    logoUrl?: string;
  }