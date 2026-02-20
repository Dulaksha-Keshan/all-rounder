// ============================================================
// Resource Sharing Data
// NOTE: This file contains static placeholder data.
// When connecting the backend, replace these with Zustand stores
// that fetch from your API endpoints.
// ============================================================

export type UrgencyLevel = "high" | "medium" | "low";
export type ResourceCategory =
  | "Sports Equipment"
  | "Art Materials"
  | "Books"
  | "Technology"
  | "Musical Instruments"
  | "Science Equipment"
  | "Furniture"
  | "Other";

export interface ResourceRequest {
  id: number;
  school: string;
  location: string;
  item: string;
  category: ResourceCategory;
  description: string;
  quantity: string;
  urgency: UrgencyLevel;
  postedDate: string;
  deadline: string;
  fulfilled: boolean;
  contactEmail?: string;
  contactName?: string;
  images?: string[];
}

export interface MyDonation {
  id: number;
  item: string;
  recipient: string;
  date: string;
  status: "Delivered" | "In Transit" | "Pending";
}

export const RESOURCE_REQUESTS: ResourceRequest[] = [
  {
    id: 1,
    school: "Lincoln High School",
    location: "New York, NY",
    item: "Sports Equipment",
    category: "Sports Equipment",
    description:
      "Basketball hoops, soccer balls, and athletic gear for new sports program. We recently launched an after-school athletics initiative and urgently need equipment to support 120+ students.",
    quantity: "15 items",
    urgency: "high",
    postedDate: "2 days ago",
    deadline: "Dec 15, 2024",
    fulfilled: false,
    contactEmail: "athletics@lincolnhs.edu",
    contactName: "Coach Mike Rivera",
  },
  {
    id: 2,
    school: "Washington Middle School",
    location: "Boston, MA",
    item: "Art Materials",
    category: "Art Materials",
    description:
      "Paints, canvases, brushes for student art club. Our art program serves 30 students weekly and our supplies have run out mid-semester.",
    quantity: "Art supplies for 30 students",
    urgency: "medium",
    postedDate: "5 days ago",
    deadline: "Dec 20, 2024",
    fulfilled: false,
    contactEmail: "artclub@washingtonms.edu",
    contactName: "Ms. Sarah Chen",
  },
  {
    id: 3,
    school: "Jefferson Elementary",
    location: "Chicago, IL",
    item: "Library Books",
    category: "Books",
    description:
      "Age-appropriate books for grades 1–5 to expand school library. We're building a reading corner and would love donations of gently used or new children's books.",
    quantity: "100+ books",
    urgency: "low",
    postedDate: "1 week ago",
    deadline: "Jan 10, 2025",
    fulfilled: false,
    contactEmail: "library@jeffersonelem.edu",
    contactName: "Mrs. Tanya Moore",
  },
  {
    id: 4,
    school: "Roosevelt High School",
    location: "Los Angeles, CA",
    item: "Musical Instruments",
    category: "Musical Instruments",
    description:
      "Violins, guitars, and keyboards for music program. Our music department is expanding and needs instruments to support an additional 40 students.",
    quantity: "10 instruments",
    urgency: "high",
    postedDate: "3 days ago",
    deadline: "Dec 12, 2024",
    fulfilled: false,
    contactEmail: "music@roosevelths.edu",
    contactName: "Mr. James Park",
  },
  {
    id: 5,
    school: "Kennedy Tech High",
    location: "Seattle, WA",
    item: "Computer Equipment",
    category: "Technology",
    description:
      "Laptops and tablets for computer science classes. We have a new CS curriculum starting next semester but lack sufficient devices for all students.",
    quantity: "20 devices",
    urgency: "medium",
    postedDate: "4 days ago",
    deadline: "Jan 5, 2025",
    fulfilled: false,
    contactEmail: "cs@kennedytech.edu",
    contactName: "Dr. Lisa Huang",
  },
  {
    id: 6,
    school: "Eastside Middle School",
    location: "Austin, TX",
    item: "Science Lab Equipment",
    category: "Science Equipment",
    description:
      "Microscopes, beakers, and lab kits for 6th–8th grade science classes. Our equipment is outdated and we want to give students hands-on STEM experiences.",
    quantity: "12 kits",
    urgency: "medium",
    postedDate: "6 days ago",
    deadline: "Jan 15, 2025",
    fulfilled: false,
    contactEmail: "science@eastsidems.edu",
    contactName: "Mr. Omar Khalil",
  },
];

export const MY_DONATIONS: MyDonation[] = [
  {
    id: 1,
    item: "Science Lab Equipment",
    recipient: "Madison High School",
    date: "Nov 20, 2024",
    status: "Delivered",
  },
  {
    id: 2,
    item: "Computers (5 units)",
    recipient: "Lincoln Elementary",
    date: "Nov 15, 2024",
    status: "In Transit",
  },
];

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  "Sports Equipment",
  "Art Materials",
  "Books",
  "Technology",
  "Musical Instruments",
  "Science Equipment",
  "Furniture",
  "Other",
];
