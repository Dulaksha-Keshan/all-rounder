import { Event } from "@/app/_type/type";

export const Events: Event[] = [
  {
    _id: "1",
    organizer: "1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    title: "Inquiro'25 - Inter School Quiz Competition",
    description: "Inquiro'25 is an exciting inter-school quiz competition designed to challenge and engage young minds. This competition tests participants' knowledge across various subjects including general knowledge, current affairs, science, literature, and more.\n\nThe competition will be conducted in multiple rounds, starting with preliminary online quizzes on Wayground/Quizziz platform, followed by live elimination rounds on Zoom. Participants will compete in teams, showcasing their quick thinking, teamwork, and breadth of knowledge.",
    category: "Quiz",
    eventType: "competition",
    startDate: "2026-01-20T18:00:00.000Z",
    endDate: "2026-01-20T21:00:00.000Z",
    location: "Zoom & Wayground/Quizziz",
    organizerId: "1",
    organizerType: "School",
    eligibility: "Students grades 9-13",
    registrationUrl: "https://example.com/register",
    isOnline: true,
    visibility: "public",
    createdBy: "user_1",
    attachments: ['/images/Events/Event1.jpeg'],
    status: "Open",
    requirements: [
      "Students must be enrolled in grades 9-13",
      "Teams of 3-4 members required",
      "Stable internet connection for online rounds"
    ],
    prizes: [
      "Champions Trophy and certificates",
      "Cash prizes for top 3 teams"
    ],
    contactEmail: "inquiro2025@example.com",
    time: "6 pm Onwards"
  },
  {
    _id: "2",
    organizer: "1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    title: "Ciencias'25 All Island InterSchool Debate Competition",
    description: "Ciencias'25 presents Sri Lanka's premier interschool debating tournament, exclusively organized by a leading Science Society. This competition brings together the brightest debaters from schools across the island to discuss and debate contemporary scientific, ethical, and social issues.",
    category: "Debate",
    eventType: "competition",
    startDate: "2025-12-14T19:00:00.000Z",
    endDate: "2025-12-14T22:00:00.000Z",
    location: "Online",
    organizerId: "1",
    organizerType: "Organization",
    eligibility: "School students",
    isOnline: true,
    visibility: "public",
    createdBy: "user_2",
    attachments: ['/images/Events/Event2.jpeg'],
    status: "Open",
    requirements: [
      "Teams of 2-3 speakers",
      "Familiarity with Asian Parliamentary format recommended"
    ],
    prizes: [
      "Best Speaker Awards",
      "Champion and Runner-up trophies"
    ],
    contactEmail: "ciencias2025@example.com",
    time: "7 pm Onwards"
  },
  {
    _id: "3",
    organizer: "1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    title: "Synapse'25 - Inter-school Graphic Design Competition",
    description: "Synapse'25 invites creative minds to explore the frontiers of imagination through graphic design. This competition challenges participants to visualize the future—from groundbreaking technology and cosmic mysteries to innovative sustainable solutions.",
    category: "Graphic Design",
    eventType: "competition",
    startDate: "2025-01-10T19:00:00.000Z",
    endDate: "2025-01-10T23:59:00.000Z",
    location: "Online",
    organizerId: "1",
    organizerType: "Organization",
    eligibility: "Open to all",
    isOnline: true,
    visibility: "public",
    createdBy: "user_3",
    attachments: ['/images/Events/Event3.jpeg'],
    status: "Open",
    requirements: [
      "Original artwork only (no plagiarism)",
      "Submissions in PNG or JPEG format"
    ],
    prizes: [
      "Gold, Silver, and Bronze awards",
      "Featured showcase on official platforms"
    ],
    contactEmail: "synapse2025@example.com",
    time: "7 pm Onwards"
  },
  {
    _id: "4",
    organizer: "1",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    title: "Talentraa AI-Powered Full-Stack Engineering Masterclass",
    description: "The Talentraa AI-Powered Full-Stack Engineering Masterclass is an intensive training program designed to transform complete beginners into job-ready full-stack developers in just 2.5 months.",
    category: "Workshop",
    eventType: "workshop",
    startDate: "2025-12-20T19:00:00.000Z",
    endDate: "2025-12-20T21:00:00.000Z",
    location: "Online",
    organizerId: "1",
    organizerType: "School",
    eligibility: "Beginners welcome",
    isOnline: true,
    visibility: "public",
    createdBy: "user_4",
    attachments: ['/images/Events/Event4.jpeg'],
    status: "Open",
    requirements: [
      "Basic computer literacy required",
      "Laptop with minimum 8GB RAM"
    ],
    prizes: [
      "Certificate of Completion",
      "Job placement assistance"
    ],
    contactEmail: "talentraa@example.com",
    time: "7 pm Onwards"
  },
  {
    _id: "5",
    organizer: "2",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    title: "Nalanda College Science Society Competitions",
    description: "The Nalanda College Science Society proudly presents a comprehensive competition series featuring six distinct categories, each designed to celebrate different aspects of scientific inquiry and creative expression.",
    category: "Science",
    eventType: "competition",
    startDate: "2025-12-20T10:00:00.000Z",
    endDate: "2025-12-20T17:00:00.000Z",
    location: "Nalanda College",
    organizerId: "2",
    organizerType: "School",
    eligibility: "School students",
    isOnline: false,
    visibility: "public",
    createdBy: "user_5",
    attachments: ['/images/Events/Event5.jpeg'],
    status: "Open",
    requirements: [
      "Open to all school students",
      "Can participate in multiple categories"
    ],
    prizes: [
      "Winners in each category receive trophies",
      "Overall championship trophy"
    ],
    contactEmail: "nalandasciencesociety@example.com",
    time: "10 am Onwards"
  },
  {
    _id: "6",
    organizer: "9",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    title: "විශ්වාභියාත්‍රා'26 - Inter-School Quiz, Graphic and Presentation Competition",
    description: "විශ්වාභියාත්‍රා'26 (Vishwabhiyathra) is an inter-school competition trilogy organized by Bandaranayake College Gampaha, designed to celebrate and nurture young talent across multiple disciplines.",
    category: "General/Multiple",
    eventType: "competition",
    startDate: "2025-12-15T08:30:00.000Z",
    endDate: "2025-12-15T16:00:00.000Z",
    location: "Online Platform",
    organizerId: "9",
    organizerType: "School",
    eligibility: "Grades 9-13",
    isOnline: true,
    visibility: "public",
    createdBy: "user_6",
    attachments: ['/images/Events/Event6.jpeg'],
    status: "Open",
    requirements: [
      "School students grades 9-13",
      "Register in advance for each category"
    ],
    prizes: [
      "Trophies for category winners",
      "Overall school championship"
    ],
    contactEmail: "vishwabhiyathra@example.com",
    time: "08:30 Onwards"
  }
];
