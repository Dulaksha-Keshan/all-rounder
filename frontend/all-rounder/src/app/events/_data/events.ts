import { Event } from "@/context/useEventStore"

export const Events: Event[] = [
  {
    id: 1,
    title: "Inquiro'25 - Inter School Quiz Competition",
    description:
      "They say the answers lie in plain sight, waiting for those who see what others overlook.",
    fullDescription: `Inquiro'25 is an exciting inter-school quiz competition designed to challenge and engage young minds. This competition tests participants' knowledge across various subjects including general knowledge, current affairs, science, literature, and more.

The competition will be conducted in multiple rounds, starting with preliminary online quizzes on Wayground/Quizziz platform, followed by live elimination rounds on Zoom. Participants will compete in teams, showcasing their quick thinking, teamwork, and breadth of knowledge.

This is an excellent opportunity for students to test their knowledge against peers from other schools, develop their critical thinking skills, and gain recognition for their academic achievements. Winners will receive certificates, prizes, and the prestigious title of Inquiro'25 Champions.`,
    date: "2026-1-20",
    deadline: "2025-11-26 18:00",
    location: "Zoom & Wayground/Quizziz",
    imageUrl: '/images/Events/Event1.jpeg',
    categories: ["Quiz", "Inter-school"],
    status: "Open",
    requirements: [
      "Students must be enrolled in grades 9-13",
      "Teams of 3-4 members required",
      "Stable internet connection for online rounds",
      "Registration before deadline is mandatory"
    ],
    prizes: [
      "Champions Trophy and certificates",
      "Cash prizes for top 3 teams",
      "Participation certificates for all"
    ],
    contactEmail: "inquiro2025@example.com",
    time: "6 pm Onwards",
    organizerId: "1",
    organizerType: "School",

  },
  {
    id: 2,
    title: "Ciencias'25 All Island InterSchool Debate Competition",
    description:
      "Sri Lanka's interschool debating tournament organized by a Science Society.",
    fullDescription: `Ciencias'25 presents Sri Lanka's premier interschool debating tournament, exclusively organized by a leading Science Society. This competition brings together the brightest debaters from schools across the island to discuss and debate contemporary scientific, ethical, and social issues.

The tournament follows the Asian Parliamentary Debate format, with motions covering topics from biotechnology and climate change to artificial intelligence and space exploration. Participants will develop their public speaking, critical thinking, and argumentation skills while engaging with cutting-edge scientific topics.

This competition offers a unique platform for young debaters to voice their opinions on matters that shape our future. Experienced judges from various fields will evaluate the debates, providing valuable feedback to participants. Whether you're a seasoned debater or new to the art, Ciencias'25 promises an enriching experience.`,
    date: "2025-12-14",
    deadline: "2025-12-14",
    location: "Online",
    imageUrl: '/images/Events/Event2.jpeg',
    categories: ["Debate", "Inter-school"],
    status: "Open",
    requirements: [
      "Teams of 2-3 speakers",
      "Familiarity with Asian Parliamentary format recommended",
      "Preparation for science-related topics",
      "Good internet connection for online participation"
    ],
    prizes: [
      "Best Speaker Awards",
      "Champion and Runner-up trophies",
      "Certificates for all participants"
    ],
    contactEmail: "ciencias2025@example.com",
    time: "7 pm Onwards",
    organizerId: "1",
    organizerType: "Organization",

  },
  {
    id: 3,
    title: "Synapse'25 - Inter-school Graphic Design Competition",
    description:
      "Design what lies beyond—from future tech and space mysteries to sustainable solutions.",
    fullDescription: `Synapse'25 invites creative minds to explore the frontiers of imagination through graphic design. This competition challenges participants to visualize the future—from groundbreaking technology and cosmic mysteries to innovative sustainable solutions that could reshape our world.

Participants will create original digital artwork based on themes like futuristic technology, space exploration, environmental sustainability, and human innovation. Using tools like Adobe Photoshop, Illustrator, Canva, or any preferred design software, students will bring their visions to life.

This competition celebrates creativity, technical skill, and the ability to communicate complex ideas through visual media. Whether you're passionate about sci-fi aesthetics, environmental activism, or technological advancement, Synapse'25 provides the perfect canvas for your imagination. Professional graphic designers and art educators will judge submissions based on creativity, technical execution, and thematic relevance.`,
    date: "2025-01-10",
    location: "Online",
    imageUrl: '/images/Events/Event3.jpeg',
    categories: ["Graphic Design"],
    status: "Open",
    requirements: [
      "Original artwork only (no plagiarism)",
      "Submissions in PNG or JPEG format",
      "Minimum resolution: 1920x1080px",
      "Theme adherence is mandatory"
    ],
    prizes: [
      "Gold, Silver, and Bronze awards",
      "Featured showcase on official platforms",
      "Certificates and design software subscriptions"
    ],
    contactEmail: "synapse2025@example.com",
    time: "7 pm Onwards",

    organizerId: "1",
    organizerType: "Organization",

  },
  {
    id: 4,
    title: "Talentraa AI-Powered Full-Stack Engineering Masterclass",
    description:
      "Transform beginners into industry-ready developers in just 2.5 months, building real projects with AI.",
    fullDescription: `The Talentraa AI-Powered Full-Stack Engineering Masterclass is an intensive training program designed to transform complete beginners into job-ready full-stack developers in just 2.5 months. This isn't just another coding bootcamp—it's a comprehensive journey through modern web development, powered by AI assistance and real-world projects.

Participants will learn both frontend and backend development, including HTML, CSS, JavaScript, React, Node.js, databases, and API development. What makes this masterclass unique is the integration of AI tools like GitHub Copilot and ChatGPT to accelerate learning and development processes.

Throughout the course, students will build multiple real-world projects including e-commerce platforms, social media applications, and portfolio websites. The curriculum is designed by industry professionals and includes live coding sessions, code reviews, and one-on-one mentorship. By the end, participants will have a strong portfolio and the skills needed to pursue careers in software development.`,
    date: "2025-12-20",
    location: "Online",
    imageUrl: '/images/Events/Event4.jpeg',
    categories: ["Workshop", "AI", "Full-Stack Development"],
    status: "Open",
    requirements: [
      "Basic computer literacy required",
      "Laptop with minimum 8GB RAM",
      "Commitment to 15-20 hours per week",
      "No prior coding experience necessary"
    ],
    prizes: [
      "Certificate of Completion",
      "Portfolio with 5+ real projects",
      "Job placement assistance",
      "Lifetime access to course materials"
    ],
    contactEmail: "talentraa@example.com",
    time: "7 pm Onwards",
    organizerId: "1",
    organizerType: "School"
  },
  {
    id: 5,
    title: "Nalanda College Science Society Competitions",
    description:
      "6 inter-school competitions including Science Quiz, Short Film, Photography, Presentation, Graphic Design, and Report Contest.",
    fullDescription: `The Nalanda College Science Society proudly presents a comprehensive competition series featuring six distinct categories, each designed to celebrate different aspects of scientific inquiry and creative expression.

**Science Quiz**: Test your scientific knowledge across physics, chemistry, biology, and general science in this fast-paced quiz competition.

**Short Film Competition**: Create compelling short films (5-10 minutes) exploring scientific concepts, environmental issues, or innovation stories.

**Photography Contest**: Capture the beauty and wonder of science through your lens. Categories include nature, scientific phenomena, and laboratory work.

**Presentation Competition**: Deliver engaging presentations on cutting-edge scientific topics, demonstrating research, communication, and public speaking skills.

**Graphic Design**: Design posters, infographics, or digital art that communicates scientific concepts in visually compelling ways.

**Report Contest**: Submit well-researched scientific reports on topics of your choice, demonstrating academic writing and research capabilities.

Each competition has its own timeline, judging criteria, and prizes. Participants can enter multiple categories. This is an excellent opportunity to showcase diverse talents while celebrating the spirit of scientific exploration.`,
    date: "2025-12-20",
    location: "Nalanda College",
    imageUrl: '/images/Events/Event5.jpeg',
    categories: [
      "Science Quiz",
      "Short Film",
      "Photography",
      "Presentation",
      "Graphic Design",
      "Report Contest",
    ],
    status: "Open",
    requirements: [
      "Open to all school students",
      "Can participate in multiple categories",
      "Follow specific guidelines for each competition",
      "Submit entries before category deadlines"
    ],
    prizes: [
      "Winners in each category receive trophies",
      "Overall championship trophy",
      "Certificates for all participants",
      "Cash prizes for top performers"
    ],
    contactEmail: "nalandasciencesociety@example.com",
    time: "10 am Onwards",
    organizerId: "2",
    organizerType: "School",

  },
  {
    id: 6,
    title: "විශ්වාභියාත්‍රා'26 - Inter-School Quiz, Graphic and Presentation Competition",
    description:
      'Celebrating bright young minds with quizzes, graphic, and presentation competitions by Bandaranayake College Gampaha.',
    fullDescription: `විශ්වාභියාත්‍රා'26 (Vishwabhiyathra) is an inter-school competition trilogy organized by Bandaranayake College Gampaha, designed to celebrate and nurture young talent across multiple disciplines.

**Quiz Competition**: A comprehensive general knowledge quiz covering history, geography, current affairs, science, technology, arts, and culture. Teams will compete in preliminary and final rounds.

**Graphic Design Competition**: Participants create original digital artwork based on provided themes. Designs should demonstrate creativity, technical proficiency, and aesthetic appeal.

**Presentation Competition**: Students deliver presentations on assigned topics, showcasing their research abilities, communication skills, and stage presence. Topics range from social issues to scientific innovations.

This competition promotes holistic development by testing different skill sets—knowledge, creativity, and communication. It's a platform for students to shine in their areas of strength while building confidence and gaining recognition. The event fosters healthy competition and camaraderie among schools in the region.`,
    date: "2025-12-15",
    deadline: "2025-12-15",
    location: "Online Platform",
    imageUrl: '/images/Events/Event6.jpeg',
    categories: ["Quiz", "Graphics", "Presentation"],
    status: "Open",
    requirements: [
      "School students grades 9-13",
      "Register in advance for each category",
      "Adhere to time limits for presentations",
      "Original work required for graphic designs"
    ],
    prizes: [
      "Trophies for category winners",
      "Overall school championship",
      "Certificates and medals",
      "Recognition on social media platforms"
    ],
    contactEmail: "vishwabhiyathra@example.com",
    time: "08:30 Onwards",
    organizerId: "9",
    organizerType: "School",

  },
]
