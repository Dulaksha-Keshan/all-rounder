import { Student, Teacher, School } from "../_types/type";


// Mock student data
export const Students: Student[] = [
  // Ananda College (15)
  { id: 1, name: "Aanya Perera", email: "aanya.perera@example.com", photoUrl: "/images/students/student1.jpeg", age: 11, school: "Ananda College" },
  { id: 2, name: "Kamal Silva", email: "kamal.silva@example.com", photoUrl: "/images/students/student2.jpeg", age: 12, school: "Ananda College" },
  { id: 3, name: "Nisha Fernando", email: "nisha.fernando@example.com", photoUrl: "/images/students/student3.jpeg", age: 13, school: "Ananda College" },
  { id: 4, name: "Samantha De Silva", email: "samantha.desilva@example.com", photoUrl: "/images/students/student4.jpeg", age: 14, school: "Ananda College" },
  { id: 5, name: "Tharuka Perera", email: "tharuka.perera@example.com", photoUrl: "/images/students/student5.jpeg", age: 15, school: "Ananda College" },
  { id: 6, name: "Nadeesha Silva", email: "nadeesha.silva@example.com", photoUrl: "/images/students/student6.jpeg", age: 16, school: "Ananda College" },
  { id: 7, name: "Meera Jayasinghe", email: "meera.jayasinghe@example.com", photoUrl: "/images/students/student7.jpeg", age: 17, school: "Ananda College" },
  { id: 8, name: "Hiran Wijesinghe", email: "hiran.wijesinghe@example.com", photoUrl: "/images/students/student8.jpeg", age: 18, school: "Ananda College" },
  { id: 9, name: "Ravi Kumara", email: "ravi.kumara@example.com", photoUrl: "/images/students/student9.jpeg", age: 19, school: "Ananda College" },
  { id: 10, name: "Dilani Perera", email: "dilani.perera@example.com", photoUrl: "/images/students/student10.jpeg", age: 12, school: "Ananda College" },
  { id: 11, name: "Sahan Wijeratne", email: "sahan.wijeratne@example.com", photoUrl: "/images/students/student11.jpeg", age: 13, school: "Ananda College" },
  { id: 12, name: "Arosha Senanayake", email: "arosha.senanayake@example.com", photoUrl: "/images/students/student12.jpeg", age: 14, school: "Ananda College" },
  { id: 13, name: "Nimali Perera", email: "nimali.perera@example.com", photoUrl: "/images/students/student13.jpeg", age: 15, school: "Ananda College" },
  { id: 14, name: "Dilan Jayawardena", email: "dilan.jayawardena@example.com", photoUrl: "/images/students/student14.jpeg", age: 16, school: "Ananda College" },
  { id: 15, name: "Sasanka Fernando", email: "sasanka.fernando@example.com", photoUrl: "/images/students/student15.jpeg", age: 17, school: "Ananda College" },

  // Other schools (5)
  { id: 16, name: "Ariya Perera", email: "ariya.perera@example.com", photoUrl: "/images/students/student16.jpeg", age: 11, school: "Nalanda College" },
  { id: 17, name: "Kavinda Silva", email: "kavinda.silva@example.com", photoUrl: "/images/students/student17.jpeg", age: 12, school: "Bandaranayake College" },
  { id: 18, name: "Nuwan Jayasinghe", email: "nuwan.jayasinghe@example.com", photoUrl: "/images/students/student18.jpeg", age: 13, school: "Nalanda College" },
  { id: 19, name: "Thilini Fernando", email: "thilini.fernando@example.com", photoUrl: "/images/students/student19.jpeg", age: 14, school: "Bandaranayake College" },
  { id: 20, name: "Roshan Kumara", email: "roshan.kumara@example.com", photoUrl: "/images/students/student20.jpeg", age: 15, school: "Nalanda College" },
];

// Mock teacher data
export const Teachers: Teacher[] = [
  // Ananda College (5)
  { id: 1, name: "Mr. Ruwan Perera", email: "ruwan.perera@example.com", photoUrl: "/images/teachers/teacher1.jpeg", school: "Ananda College" },
  { id: 2, name: "Mrs. Chandani Silva", email: "chandani.silva@example.com", photoUrl: "/images/teachers/teacher2.jpeg", school: "Ananda College" },
  { id: 3, name: "Ms. Nadeesha Fernando", email: "nadeesha.fernando@example.com", photoUrl: "/images/teachers/teacher3.jpeg", school: "Ananda College" },
  { id: 4, name: "Mr. Pradeep Wijesinghe", email: "pradeep.wijesinghe@example.com", photoUrl: "/images/teachers/teacher4.jpeg", school: "Ananda College" },
  { id: 5, name: "Ms. Dilani Jayawardena", email: "dilani.jayawardena@example.com", photoUrl: "/images/teachers/teacher5.jpeg", school: "Ananda College" },

  // Other schools (10)
  { id: 6, name: "Mr. Sunil Jayasena", email: "sunil.jayasena@example.com", photoUrl: "/images/teachers/teacher6.jpeg", school: "Nalanda College" },
  { id: 7, name: "Mrs. Anoma Perera", email: "anoma.perera@example.com", photoUrl: "/images/teachers/teacher7.jpeg", school: "Bandaranayake College" },
  { id: 8, name: "Mr. Chamara Silva", email: "chamara.silva@example.com", photoUrl: "/images/teachers/teacher8.jpeg", school: "Nalanda College" },
  { id: 9, name: "Ms. Ishara Fernando", email: "ishara.fernando@example.com", photoUrl: "/images/teachers/teacher9.jpeg", school: "Bandaranayake College" },
  { id: 10, name: "Mr. Roshan Kumara", email: "roshan.kumara@example.com", photoUrl: "/images/teachers/teacher10.jpeg", school: "Nalanda College" },
  { id: 11, name: "Ms. Sanduni Perera", email: "sanduni.perera@example.com", photoUrl: "/images/teachers/teacher11.jpeg", school: "Bandaranayake College" },
  { id: 12, name: "Mr. Dilan Jayawardena", email: "dilan.jayawardena@example.com", photoUrl: "/images/teachers/teacher12.jpeg", school: "Nalanda College" },
  { id: 13, name: "Ms. Meera Jayasinghe", email: "meera.jayasinghe@example.com", photoUrl: "/images/teachers/teacher13.jpeg", school: "Bandaranayake College" },
  { id: 14, name: "Mr. Ravi Kumara", email: "ravi.kumara@example.com", photoUrl: "/images/teachers/teacher14.jpeg", school: "Nalanda College" },
  { id: 15, name: "Ms. Tharuka Perera", email: "tharuka.perera@example.com", photoUrl: "/images/teachers/teacher15.jpeg", school: "Bandaranayake College" },
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
