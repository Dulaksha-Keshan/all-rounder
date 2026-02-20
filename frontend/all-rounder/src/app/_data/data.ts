
import { Student, Teacher, School, Organization } from "../_type/type";

// Schools data
export const Schools: School[] = [
  {
    school_id: "1",
    name: "Dudley Senanayaka Vidyalaya",
    address: "Colombo 05",
    district: "Colombo",
    email: "dudley@example.com",
    contact_number: "0112345678",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    school_id: "2",
    name: "Nalanda College",
    address: "Colombo",
    district: "Colombo",
    email: "nalanda@example.com",
    contact_number: "0112345679",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    school_id: "3",
    name: "Royal College",
    address: "Colombo",
    district: "Colombo",
    email: "royal@example.com",
    contact_number: "0112345680",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  { school_id: "4", name: "St. Joseph's College", address: "Colombo", district: "Colombo", email: "stjoseph@example.com", contact_number: "0112345681", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { school_id: "5", name: "Musaeus College", address: "Colombo", district: "Colombo", email: "musaeus@example.com", contact_number: "0112345682", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { school_id: "6", name: "Visakha Vidyalaya", address: "Colombo", district: "Colombo", email: "visakha@example.com", contact_number: "0112345683", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { school_id: "7", name: "Dharmaraja College", address: "Kandy", district: "Kandy", email: "dharmaraja@example.com", contact_number: "0112345684", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { school_id: "8", name: "Trinity College", address: "Kandy", district: "Kandy", email: "trinity@example.com", contact_number: "0112345685", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { school_id: "9", name: "Bandaranayake College Gampaha", address: "Gampaha", district: "Gampaha", email: "bandaranayake@example.com", contact_number: "0112345686", created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
];

// Organizations data
export const Organizations: Organization[] = [
  {
    organization_id: "1",
    organization_name: "IEEE Student Branch",
    contact_person: "John Doe",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    organization_id: "2",
    organization_name: "Leo Club",
    contact_person: "Jane Smith",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
];

// Mock student data
export const Students: Student[] = [
  {
    uid: "1",
    name: "Aanya Perera",
    email: "aanya@example.com",
    profile_picture: "/icons/Avatar.png",
    date_of_birth: "2013-05-15",
    is_active: true,
    is_frozen: false,
    grade: "6",
    school_id: "1",
    sex: "FEMALE",
    skills: [
      {
        id: "id223", // Changed to string
        name: "Dancing",
        category: "Category1",
        level: 'Beginner',
        endorsements: 3
      },
    ],
    clubIds: [],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  { uid: "2", name: "Kamal Silva", email: "kamal@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2012-08-20", is_active: true, is_frozen: false, grade: "7", school_id: "1", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "3", name: "Nisha Fernando", email: "nisha@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2011-12-10", is_active: true, is_frozen: false, grade: "8", school_id: "1", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "4", name: "Samantha De Silva", email: "samantha@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2010-03-25", is_active: true, is_frozen: false, grade: "9", school_id: "1", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "5", name: "Ruwan Jayasuriya", email: "ruwan@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2009-07-14", is_active: true, is_frozen: false, grade: "10", school_id: "1", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "6", name: "Ishara Kumara", email: "ishara@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2008-11-02", is_active: true, is_frozen: false, grade: "11", school_id: "1", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "7", name: "Tharushi Rajapaksa", email: "tharushi@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2007-01-18", is_active: true, is_frozen: false, grade: "12", school_id: "1", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "8", name: "Sandun Perera", email: "sandun@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2006-05-30", is_active: true, is_frozen: false, grade: "13", school_id: "1", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "9", name: "Himali Wijesinghe", email: "himali@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2009-09-09", is_active: true, is_frozen: false, grade: "10", school_id: "1", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "10", name: "Vihanga Fernando", email: "vihanga@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2012-04-03", is_active: true, is_frozen: false, grade: "7", school_id: "2", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "11", name: "Anjali Perera", email: "anjali@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2011-06-21", is_active: true, is_frozen: false, grade: "8", school_id: "3", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "12", name: "Kasun Silva", email: "kasun@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2010-09-15", is_active: true, is_frozen: false, grade: "9", school_id: "4", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "13", name: "Nadeesha Fernando", email: "nadeesha@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2009-01-22", is_active: true, is_frozen: false, grade: "10", school_id: "5", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "14", name: "Chamara Perera", email: "chamara@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2008-03-08", is_active: true, is_frozen: false, grade: "11", school_id: "6", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "15", name: "Pradeep Silva", email: "pradeep@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2007-05-19", is_active: true, is_frozen: false, grade: "12", school_id: "7", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "16", name: "Ravindu Jayasuriya", email: "ravindu@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2013-07-11", is_active: true, is_frozen: false, grade: "6", school_id: "8", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "17", name: "Sithara Wijesinghe", email: "sithara@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2012-10-30", is_active: true, is_frozen: false, grade: "7", school_id: "2", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "18", name: "Dinesh Perera", email: "dinesh@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2011-02-14", is_active: true, is_frozen: false, grade: "8", school_id: "3", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "19", name: "Ayesha Fernando", email: "ayesha@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2009-11-05", is_active: true, is_frozen: false, grade: "10", school_id: "5", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "20", name: "Nirmal Silva", email: "nirmal@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "2013-04-20", is_active: true, is_frozen: false, grade: "6", school_id: "8", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }
];

// Teachers
export const Teachers: Teacher[] = [
  {
    uid: "1",
    name: "Mr. Fernando",
    email: "fernando@example.com",
    profile_picture: "/icons/Avatar.png",
    date_of_birth: "1985-05-15",
    is_active: true,
    school_id: "1",
    sex: "MALE",
    clubIds: [],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  { uid: "2", name: "Mrs. Perera", email: "perera@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1988-08-20", is_active: true, school_id: "1", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "3", name: "Mr. Silva", email: "silva@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1982-12-10", is_active: true, school_id: "1", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "4", name: "Ms. Jayawardena", email: "jayawardena@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1990-03-25", is_active: true, school_id: "1", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "5", name: "Mr. Kumara", email: "kumara@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1987-07-14", is_active: true, school_id: "1", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "6", name: "Ms. Nadeesha", email: "nadeesha@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1989-11-02", is_active: true, school_id: "2", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "7", name: "Mr. Pradeep", email: "pradeep@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1984-01-18", is_active: true, school_id: "3", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "8", name: "Ms. Chamari", email: "chamari@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1992-05-30", is_active: true, school_id: "4", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "9", name: "Mr. Ravindu", email: "ravindu@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1986-09-09", is_active: true, school_id: "1", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "10", name: "Ms. Sithara", email: "sithara@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1991-04-03", is_active: true, school_id: "5", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "11", name: "Mr. Dinesh", email: "dinesh@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1983-06-21", is_active: true, school_id: "6", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "12", name: "Ms. Ayesha", email: "ayesha@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1993-09-15", is_active: true, school_id: "2", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "13", name: "Mr. Kasun", email: "kasun@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1981-01-22", is_active: true, school_id: "3", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "14", name: "Ms. Himali", email: "himali@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1994-03-08", is_active: true, school_id: "4", sex: "FEMALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  { uid: "15", name: "Mr. Chamara", email: "chamara@example.com", profile_picture: "/images/Dashboard/profile.png", date_of_birth: "1980-05-19", is_active: true, school_id: "6", sex: "MALE", clubIds: [], created_at: "2024-01-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" }
];
