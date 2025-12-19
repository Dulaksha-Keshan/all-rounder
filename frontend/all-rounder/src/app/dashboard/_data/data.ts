import { Student, Teacher, School } from "../_types/type";


// Mock student data

export const Students: Student[] = [
  { id: 1, name: "Aanya Perera", email: "aanya@example.com", photoUrl: "/images/students/student1.jpeg", age: 11, school: "Ananda College", sex: "FEMALE", registeredEvents: [
    {
      eventId: "1",
      registeredAt: "2025-01-10",
    },
    {
      eventId: "2",
      registeredAt: "2025-01-12",
    },
  ], },
  { id: 2, name: "Kamal Silva", email: "kamal@example.com", photoUrl: "/images/students/student2.jpeg", age: 12, school: "Ananda College", sex: "MALE", registeredEvents: [
    {
      eventId: "1",
      registeredAt: "2025-01-10",
    },
    {
      eventId: "2",
      registeredAt: "2025-01-12",
    },
  ], },
  { id: 3, name: "Nisha Fernando", email: "nisha@example.com", photoUrl: "/images/students/student3.jpeg", age: 13, school: "Ananda College", sex: "FEMALE" },
  { id: 4, name: "Samantha De Silva", email: "samantha@example.com", photoUrl: "/images/students/student4.jpeg", age: 14, school: "Ananda College", sex: "FEMALE" , registeredEvents: [
    {
      eventId: "1",
      registeredAt: "2025-01-10",
    },
    
  ], },
  { id: 5, name: "Ruwan Jayasuriya", email: "ruwan@example.com", photoUrl: "/images/students/student5.jpeg", age: 15, school: "Ananda College", sex: "MALE" },
  { id: 6, name: "Ishara Kumara", email: "ishara@example.com", photoUrl: "/images/students/student6.jpeg", age: 16, school: "Ananda College", sex: "MALE" },
  { id: 7, name: "Tharushi Rajapaksa", email: "tharushi@example.com", photoUrl: "/images/students/student7.jpeg", age: 17, school: "Ananda College", sex: "FEMALE" },
  { id: 8, name: "Sandun Perera", email: "sandun@example.com", photoUrl: "/images/students/student8.jpeg", age: 18, school: "Ananda College", sex: "MALE" ,  registeredEvents: [
    {
      eventId: "1",
      registeredAt: "2025-01-10",
    },
    {
      eventId: "2",
      registeredAt: "2025-01-12",
    },
  ],},
  { id: 9, name: "Himali Wijesinghe", email: "himali@example.com", photoUrl: "/images/students/student9.jpeg", age: 19, school: "Ananda College", sex: "FEMALE" },
  { id: 10, name: "Vihanga Fernando", email: "vihanga@example.com", photoUrl: "/images/students/student10.jpeg", age: 12, school: "Nalanda College", sex: "MALE" ,  registeredEvents: [
    {
      eventId: "1",
      registeredAt: "2025-01-10",
    },
    {
      eventId: "4",
      registeredAt: "2025-01-12",
    },
  ],},
  { id: 11, name: "Anjali Perera", email: "anjali@example.com", photoUrl: "/images/students/student11.jpeg", age: 13, school: "Royal College", sex: "FEMALE" },
  { id: 12, name: "Kasun Silva", email: "kasun@example.com", photoUrl: "/images/students/student12.jpeg", age: 14, school: "St. Joseph's College", sex: "MALE" },
  { id: 13, name: "Nadeesha Fernando", email: "nadeesha@example.com", photoUrl: "/images/students/student13.jpeg", age: 15, school: "Musaeus College", sex: "FEMALE" },
  { id: 14, name: "Chamara Perera", email: "chamara@example.com", photoUrl: "/images/students/student14.jpeg", age: 16, school: "Visakha Vidyalaya", sex: "MALE" },
  { id: 15, name: "Pradeep Silva", email: "pradeep@example.com", photoUrl: "/images/students/student15.jpeg", age: 17, school: "Dharmaraja College", sex: "MALE" },
  { id: 16, name: "Ravindu Jayasuriya", email: "ravindu@example.com", photoUrl: "/images/students/student16.jpeg", age: 11, school: "Trinity College", sex: "MALE" },
  { id: 17, name: "Sithara Wijesinghe", email: "sithara@example.com", photoUrl: "/images/students/student17.jpeg", age: 12, school: "Nalanda College", sex: "FEMALE" },
  { id: 18, name: "Dinesh Perera", email: "dinesh@example.com", photoUrl: "/images/students/student18.jpeg", age: 13, school: "Royal College", sex: "MALE" },
  { id: 19, name: "Ayesha Fernando", email: "ayesha@example.com", photoUrl: "/images/students/student19.jpeg", age: 14, school: "Musaeus College", sex: "FEMALE" },
  { id: 20, name: "Nirmal Silva", email: "nirmal@example.com", photoUrl: "/images/students/student20.jpeg", age: 15, school: "Trinity College", sex: "MALE" }
];

// Teachers (15 total, 5 Ananda, 10 others)
export const Teachers: Teacher[] = [
  { id: 1, name: "Mr. Fernando", email: "fernando@example.com", photoUrl: "/images/teachers/teacher1.jpeg", school: "Ananda College", sex: "MALE", registeredEvents: [
    {
      eventId: "1",
      registeredAt: "2025-01-10",
    },
    {
      eventId: "2",
      registeredAt: "2025-01-12",
    },
  ], },
  { id: 2, name: "Mrs. Perera", email: "perera@example.com", photoUrl: "/images/teachers/teacher2.jpeg", school: "Ananda College", sex: "FEMALE" },
  { id: 3, name: "Mr. Silva", email: "silva@example.com", photoUrl: "/images/teachers/teacher3.jpeg", school: "Ananda College", sex: "MALE" , registeredEvents: [
    {
      eventId: "2",
      registeredAt: "2025-01-10",
    },
    {
      eventId: "3",
      registeredAt: "2025-01-12",
    },
  ],},
  { id: 4, name: "Ms. Jayawardena", email: "jayawardena@example.com", photoUrl: "/images/teachers/teacher4.jpeg", school: "Ananda College", sex: "FEMALE" },
  { id: 5, name: "Mr. Kumara", email: "kumara@example.com", photoUrl: "/images/teachers/teacher5.jpeg", school: "Ananda College", sex: "MALE" },
  { id: 6, name: "Ms. Nadeesha", email: "nadeesha@example.com", photoUrl: "/images/teachers/teacher6.jpeg", school: "Nalanda College", sex: "FEMALE" },
  { id: 7, name: "Mr. Pradeep", email: "pradeep@example.com", photoUrl: "/images/teachers/teacher7.jpeg", school: "Royal College", sex: "MALE", registeredEvents: [
    {
      eventId: "1",
      registeredAt: "2025-01-10",
    },
    
  ], },
  { id: 8, name: "Ms. Chamari", email: "chamari@example.com", photoUrl: "/images/teachers/teacher8.jpeg", school: "Musaeus College", sex: "FEMALE" },
  { id: 9, name: "Mr. Ravindu", email: "ravindu@example.com", photoUrl: "/images/teachers/teacher9.jpeg", school: "Visakha Vidyalaya", sex: "MALE" },
  { id: 10, name: "Ms. Sithara", email: "sithara@example.com", photoUrl: "/images/teachers/teacher10.jpeg", school: "Dharmaraja College", sex: "FEMALE" },
  { id: 11, name: "Mr. Dinesh", email: "dinesh@example.com", photoUrl: "/images/teachers/teacher11.jpeg", school: "Trinity College", sex: "MALE" },
  { id: 12, name: "Ms. Ayesha", email: "ayesha@example.com", photoUrl: "/images/teachers/teacher12.jpeg", school: "Nalanda College", sex: "FEMALE" },
  { id: 13, name: "Mr. Kasun", email: "kasun@example.com", photoUrl: "/images/teachers/teacher13.jpeg", school: "Royal College", sex: "MALE" },
  { id: 14, name: "Ms. Himali", email: "himali@example.com", photoUrl: "/images/teachers/teacher14.jpeg", school: "Musaeus College", sex: "FEMALE" },
  { id: 15, name: "Mr. Chamara", email: "chamara@example.com", photoUrl: "/images/teachers/teacher15.jpeg", school: "Trinity College", sex: "MALE" }
];

export const Schools: School[] = [
  { id: 1, name: "Ananda College", location: "Colombo", logoUrl: "/images/schools/ananda-logo.png" },
  { id: 2, name: "Nalanda College", location: "Colombo", logoUrl: "/images/schools/nalanda-logo.png" },
  { id: 3, name: "Royal College", location: "Colombo", logoUrl: "/images/schools/royal-logo.png" },
  { id: 4, name: "St. Joseph's College", location: "Colombo" },
  { id: 5, name: "Musaeus College", location: "Colombo" },
  { id: 6, name: "Visakha Vidyalaya", location: "Colombo" },
  { id: 7, name: "Dharmaraja College", location: "Kandy" },
  { id: 8, name: "Trinity College", location: "Kandy" }

]
