
export interface Event {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  school:string;
  deadline?: string;
  location: string;
  imageUrl: string;
  categories?: string[];
  status?: "Registered" | "Open";
  requirements?: string[];
  prizes?: string[];
  contactEmail?: string;
}