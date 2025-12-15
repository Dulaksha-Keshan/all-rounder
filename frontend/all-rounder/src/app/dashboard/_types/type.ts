// Student interface
export interface Student {
    id: number;
    name: string;
    email: string;
    photoUrl: string;
    age: number;
    school: string;
  }
  
  // Teacher interface
  export interface Teacher {
    id: number;
    name: string;
    email: string;
    photoUrl: string;
    school: string;
  }
  
  // School interface 
export interface School {
    id: number;
    name: string;
    location: string;
    logoUrl?: string;
  }