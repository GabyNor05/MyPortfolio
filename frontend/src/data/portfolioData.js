import projects from "./projects.json";

// Project data lives in projects.json (easy to edit; later fed by Firestore/the archive).
export const projectData = projects;

export const pageContent = [
  {
    id: "content-001",
    title: "Hero Section",
    description: "Final-year student at Open Window Institute, crafting digital experiences that live at the intersection of code and design. I build things that feel as intentional as they look.",
    media: { type: "image", url: "/images/hero.jpg" },
  },
  {
    id: "content-002",
    title: "Why I develop",
    description:
      "You know that feeling when you find a bug in your code and after hours of debugging, you finally fix it? That rush of excitement and accomplishment is what keeps me hooked on development. When nothing makes sense in the world code is still just 1s and 0s, pure perfection. Life should be as simple as AND, OR and NOT. The ability to create something from nothing is incredible. Plus, seeing your code come to life and make a difference in users' lives is incredibly rewarding. That's why I develop - for the thrill of solving puzzles and creating meaningful experiences through technology.",
    media: { type: "icon", name: "code" },
  },
  {
    id: "content-003",
    title: "Me as a designer",
    description:
      "As a designer, I believe that great design is not just about making things look good, but about solving problems and creating meaningful experiences for users. I strive to understand the needs of my users and translate those needs into intuitive and aesthetically pleasing solutions.",
    media: { type: "icon", name: "palette" },
  },
  {
    id: "content-004",
    title: "Love for Technology",
    description: "...",
    media: { type: "icon", name: "sparkles" },
  },
  {
    id: "content-005",
    title: "Tech Stack History",
    description: "...",
    media: { type: "icon", name: "book" },
  },
  {
    id: "content-006",
    title: "Contact Me",
    description: "Whether you have a freelance brief, an opportunity to share, or just want to say hello, I'd love to hear from you.",
    media: { type: "icon", name: "envelope" },
  },
  {
    id: "content-007",
    title: "Voiceover",
    description:"Hi I'm Gaby Norris, a third-year student at Open Window and aspiring developer. Let's get down and personal about who I am, what I do, and why I do it. First and foremost, I am a problem solver, who enjoys creating new things and finding ways to improve already exisiting solutions. I'm curious about lots of things, always aiming to learn more and grow my skills. I am passionate about technology and how its made the world a smaller place, keeping everyone connected. As a UX designer, I have a deeper understand of how users interact with technology and how to create for different audiences. I work well in a team, enjoying learning from others and collaborating to create the best possible outcome. I am excited to continue developing my skills and contributing to the tech industry in meaningful ways. Once again I am Gaby Norris, enjoy exploring what I've been building for the last 2 years and I hope you like what you see. Thank you for taking the time to get to know me.",
    media: { type: "audio", url: "/audio/voiceover.mp3" },
  }
];

export const confidenceRating = [
  {
    level: "Beginner",
    range: "0-3",
    description:
      "I have a basic understanding of the technology and can perform simple tasks with guidance.",
  },
  {
    level: "Intermediate",
    range: "4-6",
    description:
      "I am comfortable using the technology and can complete tasks independently, but may still require occasional assistance.",
  },
  {
    level: "Advanced",
    range: "7-10",
    description:
      "I have a deep understanding of the technology and can use it to solve complex problems and create innovative solutions with ease.",
  },
];

export const techStack = [
  {
    name: "React",
    logo: "react",
    confidence: 8,
    context:
      "Used React for multiple projects including TutorAid, Disney+ Finder, Psychedelic Pixels, and SheIsDesign. Comfortable with hooks, state management, and component-based architecture.",
  },
  {
    name: "JavaScript",
    logo: "javascript",
    confidence: 7,
    context:
      "Experienced in JavaScript development, including ES6+ features and modern frameworks.",
  },
  {
    name: "HTML/CSS",
    logo: "html",
    confidence: 8,
    context:
      "Proficient in creating responsive and accessible web layouts using HTML and CSS.",
  },
  {
    name: "MongoDB",
    logo: "mongodb",
    confidence: 6,
    context:
      "Familiar with MongoDB for document-based data storage and management.",
  },
  {
    name: "Tailwind CSS",
    logo: "tailwind",
    confidence: 7,
    context:
      "Skilled in using Tailwind CSS for rapid UI development and custom styling.",
  },
  {
    name: "SQL",
    logo: "sql",
    confidence: 6,
    context:
      "Competent in writing efficient SQL queries for database management.",
  },
  {
    name: "PostgreSQL",
    logo: "postgresql",
    confidence: 4,
    context:
      "Experienced in using PostgreSQL for relational database management.",
  },
  {
    name: ".NET",
    logo: "dotnet",
    confidence: 4,
    context: "Familiar with the .NET framework for building scalable applications.",
  },
  {
    name: "C#",
    logo: "csharp",
    confidence: 4,
    context: "Proficient in C# programming for developing robust applications.",
  },
  {
    name: "Java",
    logo: "java",
    confidence: 3,
    context: "Basic understanding of Java programming and its applications.",
  },
  {
    name: "Electron",
    logo: "electron",
    confidence: 4,
    context: "Experienced in building cross-platform desktop applications with Electron.",
  },
];

// ---------------------------------------------------------------------------
// Character-sheet content. Edit freely: the sheet renders straight from this.
// Anything in [square brackets] is a placeholder waiting for your real content.
// ---------------------------------------------------------------------------
export const sheet = {
  abilities: [
    { name: "Planning", score: 16 },
    { name: "Analysis", score: 16 },
    { name: "Design", score: 17 },
    { name: "Implementation", score: 18 },
    { name: "Testing", score: 10 },
    { name: "Maintenance", score: null }, // not rated yet: shows "--"
  ],
  saves: [
    { name: "React", bonus: 4, proficient: true },
    { name: "State", bonus: 3, proficient: true },
    { name: "Merge", bonus: 3, proficient: false },
    { name: "Deploy", bonus: 2, proficient: false },
    { name: "Due", bonus: 2, proficient: false },
    { name: "Scope", bonus: 1, proficient: false },
  ],
  saveNotes: [
    { kind: "A", text: "advantage when normalising databases" },
    { kind: "+", text: "+1 on every save with a red cappuccino in hand" },
  ],
  experience: [
    { role: "Bachelor of Creative Technologies", org: "Open Window Institute", when: "Jan 2024 – Nov 2026", text: "Interactive Development and UX Design: building full-stack React and React Native apps and designing high-fidelity mobile experiences. Coursework in HCI, Web Development, Software Engineering, Data Structures & Algorithms and UX Research." },
    { role: "Receptionist (part-time)", org: "The Pod Practice", when: "Jan 2024 – Dec 2026", text: "Run the front desk of a busy podiatry practice: patient communication, scheduling and records admin, keeping things organised under time pressure." },
    { role: "Tutor (part-time)", org: "Educare", when: "Jan 2024 – Present", text: "Tutor primary and high-school learners across the IEB and CAPS curricula, adapting explanations to how each learner thinks." },
  ],
  extraSkills: [
    { name: "Teamwork", bonus: 2, proficient: false },
    { name: "Communication", bonus: 2, proficient: false },
    { name: "Tutoring", bonus: 2, proficient: false },
    { name: "Attention to detail", bonus: 2, proficient: false },
    { name: "Empathy", bonus: 2, proficient: false },
    { name: "Time management", bonus: 2, proficient: false },
  ],
  languages: [
    { name: "JavaScript", level: 7 },
    { name: "TypeScript", level: 5 },
    { name: "HTML/CSS", level: 8 },
    { name: "SQL", level: 6 },
    { name: "C#", level: 4 },
    { name: "Java", level: 3 },
  ],
  // Soft skills and "get to know me" skills. level 7+ = filled dot.
  skills: [
    { name: "Music", level: 8 },
    { name: "Adaptability", level: 8 },
    { name: "Customer service", level: 8 },
    { name: "Problem solving", level: 8 },
    { name: "Creativity", level: 8 },
  ],
  training: [
    { title: "Tools", items: "Figma, Visual Studio Code, GitHub, Canva" },
    { title: "Platforms & hosting", items: "Firebase, GitHub Pages, Render, Vercel, MongoDB" },
    { title: "AI assistants", items: "Claude, Gemini, Copilot, ChatGPT, Skywork AI" },
  ],
};
