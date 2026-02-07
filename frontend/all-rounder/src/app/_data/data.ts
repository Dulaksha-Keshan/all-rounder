
import { Student, Teacher, School, Organization } from "../_type/type";

// Schools data
export const Schools: School[] = [
  { id: "1", name: "Dudley Senanayaka Vidyalaya", location: "Colombo 05", logoUrl: "/images/schools/ananda-logo.png" },
  { id: "2", name: "Nalanda College", location: "Colombo", logoUrl: "/images/schools/nalanda-logo.png" },
  { id: "3", name: "Royal College", location: "Colombo", logoUrl: "/images/schools/royal-logo.png" },
  { id: "4", name: "St. Joseph's College", location: "Colombo" },
  { id: "5", name: "Musaeus College", location: "Colombo" },
  { id: "6", name: "Visakha Vidyalaya", location: "Colombo" },
  { id: "7", name: "Dharmaraja College", location: "Kandy" },
  { id: "8", name: "Trinity College", location: "Kandy" },
  { id: "9", name: "Bandaranayake College Gampaha", location: "Gampaha" },
];

// Organizations data
export const Organizations: Organization[] = [
  { id: "1", name: "IEEE Student Branch", location: "Colombo", logoUrl: "/images/schools/ananda-logo.png" },
  { id: "2", name: "Leo Club", location: "Colombo", logoUrl: "/images/schools/nalanda-logo.png" },
];

// Mock student data
export const Students: Student[] = [
  {
    id: 1,
    name: "Aanya Perera",
    email: "aanya@example.com",
    photoUrl: "/icons/Avatar.png",
    age: 11,
    schoolId: "1",  // ← Changed
    sex: "FEMALE",
    profile: {
      bio: "Hello, I'm Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website, I create digital Products a more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at.",
      phone: "(+94) 77 178 4997",
      address: "Street 110-B Kalians Bag, Dewan, M.P. INDIA",
      zipCode: "12345",
    },
    skills: [
      { name: "Singing" },
      { name: "Dancing" }
    ],
    registeredEvents: [
      { eventId: "1", registeredAt: "2025-01-10" },
      { eventId: "2", registeredAt: "2025-01-12" },
    ],
  },
  { id: 2, name: "Kamal Silva", email: "kamal@example.com", photoUrl: "/images/Dashboard/profile.png", age: 12, schoolId: "1", sex: "MALE", registeredEvents: [{ eventId: "1", registeredAt: "2025-01-10" }, { eventId: "2", registeredAt: "2025-01-12" }] },
  { id: 3, name: "Nisha Fernando", email: "nisha@example.com", photoUrl: "/images/Dashboard/profile.png", age: 13, schoolId: "1", sex: "FEMALE" },
  { id: 4, name: "Samantha De Silva", email: "samantha@example.com", photoUrl: "/images/Dashboard/profile.png", age: 14, schoolId: "1", sex: "FEMALE", registeredEvents: [{ eventId: "1", registeredAt: "2025-01-10" }] },
  { id: 5, name: "Ruwan Jayasuriya", email: "ruwan@example.com", photoUrl: "/images/Dashboard/profile.png", age: 15, schoolId: "1", sex: "MALE" },
  { id: 6, name: "Ishara Kumara", email: "ishara@example.com", photoUrl: "/images/Dashboard/profile.png", age: 16, schoolId: "1", sex: "MALE" },
  { id: 7, name: "Tharushi Rajapaksa", email: "tharushi@example.com", photoUrl: "/images/Dashboard/profile.png", age: 17, schoolId: "1", sex: "FEMALE" },
  { id: 8, name: "Sandun Perera", email: "sandun@example.com", photoUrl: "/images/Dashboard/profile.png", age: 18, schoolId: "1", sex: "MALE", registeredEvents: [{ eventId: "1", registeredAt: "2025-01-10" }, { eventId: "2", registeredAt: "2025-01-12" }] },
  { id: 9, name: "Himali Wijesinghe", email: "himali@example.com", photoUrl: "/images/Dashboard/profile.png", age: 19, schoolId: "1", sex: "FEMALE" },
  { id: 10, name: "Vihanga Fernando", email: "vihanga@example.com", photoUrl: "/images/Dashboard/profile.png", age: 12, schoolId: "2", sex: "MALE", registeredEvents: [{ eventId: "1", registeredAt: "2025-01-10" }, { eventId: "4", registeredAt: "2025-01-12" }] },
  { id: 11, name: "Anjali Perera", email: "anjali@example.com", photoUrl: "/images/Dashboard/profile.png", age: 13, schoolId: "3", sex: "FEMALE" },
  { id: 12, name: "Kasun Silva", email: "kasun@example.com", photoUrl: "/images/Dashboard/profile.png", age: 14, schoolId: "4", sex: "MALE" },
  { id: 13, name: "Nadeesha Fernando", email: "nadeesha@example.com", photoUrl: "/images/Dashboard/profile.png", age: 15, schoolId: "5", sex: "FEMALE" },
  { id: 14, name: "Chamara Perera", email: "chamara@example.com", photoUrl: "/images/Dashboard/profile.png", age: 16, schoolId: "6", sex: "MALE" },
  { id: 15, name: "Pradeep Silva", email: "pradeep@example.com", photoUrl: "/images/Dashboard/profile.png", age: 17, schoolId: "7", sex: "MALE" },
  { id: 16, name: "Ravindu Jayasuriya", email: "ravindu@example.com", photoUrl: "/images/Dashboard/profile.png", age: 11, schoolId: "8", sex: "MALE" },
  { id: 17, name: "Sithara Wijesinghe", email: "sithara@example.com", photoUrl: "/images/Dashboard/profile.png", age: 12, schoolId: "2", sex: "FEMALE" },
  { id: 18, name: "Dinesh Perera", email: "dinesh@example.com", photoUrl: "/images/Dashboard/profile.png", age: 13, schoolId: "3", sex: "MALE" },
  { id: 19, name: "Ayesha Fernando", email: "ayesha@example.com", photoUrl: "/images/Dashboard/profile.png", age: 14, schoolId: "5", sex: "FEMALE" },
  { id: 20, name: "Nirmal Silva", email: "nirmal@example.com", photoUrl: "/images/Dashboard/profile.png", age: 15, schoolId: "8", sex: "MALE" }
];

// Teachers
export const Teachers: Teacher[] = [
  {
    id: 1,
    name: "Mr. Fernando",
    email: "fernando@example.com",
    photoUrl: "/icons/Avatar.png",
    schoolId: "1",  // ← Changed
    sex: "MALE",
    profile: {
      bio: "Hello, I'm Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website, I create digital Products a more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at.",
      phone: "(+94) 77 178 9887",
      address: "Street 110-B Kalians Bag, Dewan, M.P. Sri Lanka",
      zipCode: "23456",
    },
    registeredEvents: [
      { eventId: "1", registeredAt: "2025-01-10" },
      { eventId: "2", registeredAt: "2025-01-12" },
    ],
  },
  { id: 2, name: "Mrs. Perera", email: "perera@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "1", sex: "FEMALE" },
  { id: 3, name: "Mr. Silva", email: "silva@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "1", sex: "MALE", registeredEvents: [{ eventId: "2", registeredAt: "2025-01-10" }, { eventId: "3", registeredAt: "2025-01-12" }] },
  { id: 4, name: "Ms. Jayawardena", email: "jayawardena@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "1", sex: "FEMALE" },
  { id: 5, name: "Mr. Kumara", email: "kumara@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "1", sex: "MALE" },
  { id: 6, name: "Ms. Nadeesha", email: "nadeesha@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "2", sex: "FEMALE" },
  { id: 7, name: "Mr. Pradeep", email: "pradeep@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "3", sex: "MALE", registeredEvents: [{ eventId: "1", registeredAt: "2025-01-10" }] },
  { id: 8, name: "Ms. Chamari", email: "chamari@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "4", sex: "FEMALE" },
  { id: 9, name: "Mr. Ravindu", email: "ravindu@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "1", sex: "MALE" },
  { id: 10, name: "Ms. Sithara", email: "sithara@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "5", sex: "FEMALE" },
  { id: 11, name: "Mr. Dinesh", email: "dinesh@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "6", sex: "MALE" },
  { id: 12, name: "Ms. Ayesha", email: "ayesha@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "2", sex: "FEMALE" },
  { id: 13, name: "Mr. Kasun", email: "kasun@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "3", sex: "MALE" },
  { id: 14, name: "Ms. Himali", email: "himali@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "4", sex: "FEMALE" },
  { id: 15, name: "Mr. Chamara", email: "chamara@example.com", photoUrl: "/images/Dashboard/profile.png", schoolId: "6", sex: "MALE" }
];