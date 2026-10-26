/**
 * Single source of truth for the deployed host: canonical URLs, OG tags and
 * JSON-LD. Swap this to https://mangalamgaud.dev once the domain is live, and
 * mirror the change in index.html, public/sitemap.xml and public/robots.txt.
 */
export const siteUrl = "https://mangalamgaud.vercel.app";

export const profile = {
  name: "Mangalam Rajkeshkar Gaud",
  title: "Software Developer — Cybersecurity · Full-stack · IoT",
  subtitle: "B.Sc. Information Technology · Mumbai, India",
  location: "Kandivali East, Mumbai, Maharashtra",
  phone: "+91 8591681592",
  email: "manglamgaud@gmail.com",
  github: "https://github.com/mangalam-gaud",
  linkedin: "https://www.linkedin.com/in/mangalam-gaud-86a7ba31a",
  instagram: "https://www.instagram.com/mangalam_gaud/",
  x: "https://x.com/mangalam_gaud",
  bio:
    "B.Sc. Information Technology student who builds and breaks software across web, Linux and embedded systems. Ships full-stack applications with React, Express, PostgreSQL and Redis, and builds security tooling in Python on Kali/Ubuntu — wireless auditing, encrypted air-gapped file transfer and peer-to-peer messaging. Also leads IoT prototypes, including Drishtipath, an assistive navigation system for Divyangjan recognised at CIIE and the Avishkar Research Convention.",
  /** Two-line version for the resume header — same facts, no filler. */
  resumeSummary:
    "B.Sc. Information Technology student in Mumbai building full-stack systems, security tooling and IoT prototypes. Led the Drishtipath team to first place at CIIE AI Innovation and an Avishkar finalist place (Engineering & Technology).",
};

export const skills = [
  {
    category: "Programming",
    items: ["Java", "Python", "C", "C++", "JavaScript", "TypeScript", "SQL", "PL/SQL"],
  },
  {
    category: "Security",
    items: [
      "aircrack-ng", "hashcat", "hcxtools", "reaver", "bully", "airodump-ng",
      "monitor mode", "packet injection", "MAC randomisation",
      "AES-256-GCM", "Web Crypto API", "JWT", "RBAC", "CSRF protection", "rate limiting",
    ],
  },
  {
    category: "Linux & Networking",
    items: [
      "Debian/Ubuntu", "Kali Linux", "ip link", "NetworkManager", "systemd services",
      "VPC subnetting", "NAT", "security groups", "IAM", "STUN/TURN", "WebRTC",
    ],
  },
  {
    category: "Web & Backend",
    items: ["React", "React 19", "Node.js", "Express.js", "JSP", "Servlets", "JDBC", "PHP", "REST APIs"],
  },
  {
    category: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Oracle SQL", "SQL*Plus"],
  },
  {
    category: "Cloud & Tools",
    items: ["AWS EC2", "AWS VPC", "Git", "GitHub", "Tomcat", "Apache/XAMPP", "VirtualBox", "VS Code", "Arduino IDE"],
  },
];

/**
 * Every project is shown on the site. `resumeProjects` below picks the four
 * that both resume formats print, so the PDF and the PNG never drift apart.
 */
export const projects = [
  {
    id: "stratavex",
    title: "Stratavex",
    subtitle: "Wireless Mine Strata Monitoring & Early Warning",
    stack: ["RP2040", "LoRa 865 MHz", "ADXL345", "VL53L0X", "Raspberry Pi 5", "PostGIS"],
    image: "/projects/stratavex.jpg",
    facts: "Team ID 165443 · RP2040 + Sub-GHz LoRa",
    link: "",
    demo: "https://coal-crushers.vercel.app/",
    video: "https://youtu.be/h-IpWhzkaA0",
    featured: true,
    description:
      "Cyber-physical wireless mesh platform for underground coal mines, engineered for Indian geo-mining conditions: roof-anchored nodes measure convergence, micro-tilt and gas venting, and a section gateway scores risk locally so a physical evacuation siren fires with zero cloud latency. Built by team Coal Crushers for Smart India Hackathon problem statement SIH26025.",
    highlights: [
      "DGMS Group I edge node: RP2040 drawing 15–40 mA from a 3.2 V LiFePO4 cell with TP5000 charging and an IP68 flameproof cast-aluminium enclosure for methane and coal-dust atmospheres",
      "Multi-sensor stack: ADXL345 micro-tilt with wake-on-shake above 2.5 g, VL53L0X time-of-flight roof convergence through a 45° optical hood, MiCS-5524 CO/VOC surge tracking and BME280 compensation",
      "Sub-GHz LoRa on the licence-free 865–867 MHz India ISM band at SF10–SF12, carrying telemetry around tunnel bends and through coal dust with no SIM card or Wi-Fi",
      "Raspberry Pi 5 gateway runs local ML risk scoring and pulls GPIO 17 low through an optocoupled relay to fire a 12 V section evacuation siren; SQLite store-and-forward holds 0% packet loss across backhaul outages",
      "PostgreSQL/PostGIS cloud enforces DGMS 30 m grid spacing and MoEF&CC 10 mm/m forest strain limits, surfaced as Leaflet GIS heatmaps, RBAC dashboards and a 3D WebGL subsurface digital twin",
    ],
  },
  {
    id: "kes-lms",
    title: "KES LMS",
    subtitle: "College Learning Management System",
    stack: ["React 18", "TypeScript", "Express", "PostgreSQL", "Redis"],
    image: "/projects/kes-lms.jpg",
    facts: "3 portals · 25 tests · offline PWA",
    link: "https://github.com/mangalam-gaud/kes-lms",
    featured: true,
    description:
      "Full-stack learning management system for K.E.S. Shroff College with separate admin, teacher and student portals covering attendance, assignments, exams and course material.",
    highlights: [
      "Role-based access across three portals with real-time notifications and PWA offline support",
      "AI-assisted content generation and automated database backups",
      "Deployed on Debian/Ubuntu bare metal; 25 automated tests with clean build and lint",
    ],
  },
  {
    id: "mg-fi",
    title: "mg-fi",
    subtitle: "Automated Wireless Security Auditing Suite",
    stack: ["Python", "Kali Linux", "aircrack-ng", "hashcat"],
    image: "/projects/mg-fi.jpg",
    facts: "3-phase attack loop · 60s discovery scan",
    link: "https://github.com/mangalam-gaud/mg-fi",
    featured: true,
    description:
      "Python auditing suite for authorised wireless penetration tests, taking a target from discovery to handshake capture and offline key recovery from one terminal UI.",
    highlights: [
      "Automated three-phase attack loop (bully, reaver, handshake capture) with live cracking progress",
      "Parses airodump-ng CSV into a ranked target table after a 60-second discovery scan",
      "Native MAC randomisation via ip link, monitor-mode setup, and guaranteed NetworkManager restore on exit",
    ],
  },
  {
    id: "drishtipath",
    title: "Drishtipath",
    subtitle: "Assistive Navigation for Divyangjan",
    stack: ["ESP32", "BLE", "LoRa SX127x", "VL53L1X", "nRF (V3)"],
    image: "/projects/drishtipath.jpg",
    facts: "First place, CIIE · Avishkar Cat. 5 finalist",
    link: "https://github.com/mangalam-gaud/drishtipath",
    featured: true,
    description:
      "Assistive navigation platform for Divyangjan: wearable nodes identify locations and guide users through unfamiliar public spaces — stations, campuses, hospitals and other facilities. Entered at the University of Mumbai Avishkar Research Convention as an undergraduate Engineering & Technology project, with V3 in development as a compact, low-cost modular wearable. Team lead for the project.",
    highlights: [
      "Avishkar Research Convention, Category 5 (Engineering & Technology), undergraduate level — V1 for the zonal round, V2 for the final round",
      "V1: ESP32 nodes broadcast BLE UUIDs with RSSI proximity estimation and wearable buzzer alerts; railway coach identification was the first demonstration",
      "V2: LoRa SX127x (RFM95) links between ESP32 DevKit and ESP32-C3 Mini controllers, adding VL53L1X time-of-flight distance sensing",
      "V3 in development: nRF and Arduino Nano hardware targeting a compact, low-cost, power-efficient modular wearable",
    ],
  },
  {
    id: "datatransfer",
    title: "Mangaud Data Transfer",
    subtitle: "Air-Gapped Optical Transfer Protocol",
    stack: ["React 19", "TypeScript", "AES-256-GCM", "QR streaming"],
    image: "/projects/datatransfer.jpg",
    facts: "AES-256-GCM · 100% client-side",
    link: "https://github.com/mangalam-gaud/mangaud-datatransfer",
    demo: "https://mangaud-datatransfer.vercel.app/",
    featured: true,
    description:
      "Zero-trust file transfer for air-gapped machines: payloads are compressed, encrypted and serialised into dynamic QR streams, then rebuilt on a second device with no network, Wi-Fi, Bluetooth or cloud.",
    highlights: [
      "AES-256-GCM encryption with per-transfer keys and CRC32 integrity checks",
      "Chunked, compressed QR stream with a pre-rendered cache for sustained throughput",
      "100% client-side — data never leaves browser memory",
    ],
  },
  {
    id: "support-system",
    title: "Mangaud Support System",
    subtitle: "Student Support Ticket Platform",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    image: "/projects/support-system.jpg",
    facts: "JWT + RBAC · 3 MB uploads",
    link: "https://github.com/mangalam-gaud/support-system",
    featured: false,
    description:
      "MERN support-desk platform where students raise tickets with image attachments and staff resolve them through role-based worker and admin portals.",
    highlights: [
      "JWT auth, RBAC, bcrypt hashing, CSRF checks, Helmet headers, rate limiting and 15-minute idle logout",
      "AI chatbot (Groq / Llama 3.3) with an offline FAQ fallback and persistent conversation history",
      "Attachment uploads up to 3 MB with worker completion proof",
    ],
  },
  {
    id: "mangaud-chatting",
    title: "MANGAUD Chat",
    subtitle: "Encrypted Peer-to-Peer Messenger",
    stack: ["JavaScript", "WebRTC", "PeerJS", "Web Crypto"],
    image: "/projects/mangaud-chatting.jpg",
    facts: "AES-256-GCM · zero persistence",
    link: "https://github.com/mangalam-gaud/mangaud-chatting",
    demo: "https://mangaud-chatting.vercel.app/",
    featured: false,
    description:
      "Serverless peer-to-peer messenger with AES-256-GCM message encryption, multi-guest rooms and zero persistence.",
    highlights: [
      "Direct WebRTC data channels via PeerJS with STUN/TURN NAT traversal",
      "Per-message random IVs; no localStorage, IndexedDB or cookies — closing the tab destroys history",
      "Host controls for a live user list, IP blocking and host transfer; installable as a PWA",
    ],
  },
  {
    id: "collegehub",
    title: "Mangaud CollegeHub",
    subtitle: "College Management System",
    stack: ["Java", "JSP", "Servlets", "JDBC", "MySQL", "Tomcat"],
    image: "/projects/collegehub.jpg",
    facts: "10 modules · role-based access",
    link: "https://github.com/mangalam-gaud/collegeHub",
    featured: false,
    description:
      "Multi-role college management application with modules covering academics, attendance, marks, fees, library, hostel, transport, leave, messaging and grievances.",
    highlights: [
      "JDBC-based database access with prepared statements and role-based access",
      "Session protections, CSRF checks and login rate limiting",
      "Windows launch workflow: database prep, WAR build/deploy to Tomcat, health check",
    ],
  },
  {
    id: "banking-console",
    title: "Mangaud Banking Console",
    subtitle: "Full-Stack Banking Demonstration",
    stack: ["React", "TypeScript", "Node.js", "Express", "MongoDB"],
    image: "/projects/banking-console.jpg",
    facts: "6 domains · audit logging",
    link: "https://github.com/mangalam-gaud/mangaud-banking-console",
    featured: false,
    description:
      "Full-stack banking demonstration with role-specific dashboards and workflows for accounts, cards, loans, deposits, payments and notifications.",
    highlights: [
      "JWT-based authentication, permission checks and request validation",
      "Audit logging and automated test/build workflows",
      "Portfolio demonstration only — not a production banking system",
    ],
  },
  {
    id: "aws-arch",
    title: "Smart-Influencing AWS Network Architecture",
    subtitle: "Cloud Network Segmentation",
    stack: ["AWS EC2", "VPC", "IAM", "Linux"],
    image: "/projects/aws-arch.jpg",
    facts: "Public/private subnets · IAM · NAT",
    link: "https://github.com/mangalam-gaud/Smart-Influencing",
    featured: false,
    description:
      "VPC with a public-facing web server and a backend/database server isolated in a private subnet.",
    highlights: [
      "Subnet separation, security groups, IAM and NAT",
      "Controlled access between public-facing and private components",
    ],
  },
  {
    id: "smart-influencing",
    title: "Smart-Influencing",
    subtitle: "Brand & Creator Marketplace",
    stack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    image: "/projects/smart-influencing.jpg",
    facts: "Two-sided marketplace · JWT auth",
    link: "https://github.com/mangalam-gaud/Smart-Influencing",
    featured: false,
    description:
      "Two-sided marketplace concept with separate brand and influencer authentication and dashboards.",
    highlights: [
      "Campaign workflows, applications, messaging, notifications and wallet features",
      "Password hashing, JWT authentication, role-based access and prepared statements",
    ],
  },
  {
    id: "keshavi",
    title: "Keshavi Tutorial Website",
    subtitle: "Tutorial Class Website",
    stack: ["HTML", "CSS", "JavaScript"],
    image: "/projects/keshavi.jpg",
    facts: "Live site · community project",
    link: "",
    demo: "https://keshavi-tutorial.netlify.app/pages/",
    featured: false,
    description:
      "Tutorial-class website built and deployed as a college community-engagement project.",
    highlights: ["Lightweight front end", "Clear navigation using core web technologies"],
  },
  {
    id: "age-calculator",
    title: "Age Calculator",
    subtitle: "Precision Age & Life Analytics",
    stack: ["HTML", "CSS", "JavaScript", "GSAP"],
    image: "/projects/age-calculator.jpg",
    facts: "Live · planet ages · share cards",
    link: "",
    demo: "https://agecalculator-mangaud.netlify.app/",
    featured: false,
    description:
      "Static age calculator that reports exact age down to the second, plus life statistics, planetary ages, milestone cards and a countdown to the next birthday.",
    highlights: [
      "Live age breakdown with next-birthday countdown, life-progress ring and solar-system ages",
      "Shareable age-card image generated in-canvas with theme and message options",
      "Accessibility-first vanilla build: skip link, live regions, keyboard shortcuts and multi-language speech output",
    ],
  },
];

/** The four projects both resume formats print, in the order they appear. */
const resumeOrder = ["mg-fi", "drishtipath", "mangaud-chatting", "support-system"];
export const resumeProjects = resumeOrder
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is (typeof projects)[number] => p !== undefined);

/** The three projects the home page shows, in the order they appear. */
const homeOrder = ["drishtipath", "stratavex", "mangaud-chatting"];
export const homeProjects = homeOrder
  .map((id) => projects.find((p) => p.id === id))
  .filter((p): p is (typeof projects)[number] => p !== undefined);

export const experience = [
  {
    role: "Team Lead",
    org: "Coal Crushers — Smart India Hackathon",
    period: "Ongoing",
    description:
      "Lead team Coal Crushers (Team ID 165443) on Smart India Hackathon problem statement SIH26025, building Stratavex: an underground mine strata monitoring and early-warning platform with a LoRa sensor mesh and local ML risk scoring.",
  },
  {
    role: "Tutor",
    org: "Keshavi Tutorial",
    period: "Ongoing",
    description:
      "Teach SSC Mathematics, Science and Hindi, and support FYJC/SYJC Information Technology learners; adapt explanations to student needs and reinforce concepts through practice.",
  },
  {
    role: "Core Organising Committee Member",
    org: "IndiaNext Hackathon",
    period: "Event",
    description:
      "Supported logistics, participant coordination, registration and networking during hackathon operations.",
  },
  {
    role: "Civil Defence Corps Volunteer & Student Activities",
    org: "College / Community",
    period: "Ongoing",
    description:
      "Participated in community-oriented and college activities alongside project work and academic responsibilities.",
  },
];

export interface SemesterResult {
  label: string;
  sgpa: number;
}

export interface EducationEntry {
  degree: string;
  org: string;
  period: string;
  details: string;
  /** Semester SGPA, shown as a table on the Education page. */
  semesters?: SemesterResult[];
  note?: string;
}

export const education: EducationEntry[] = [
  {
    degree: "B.Sc. Information Technology (TY)",
    org: "K.E.S. Shroff College, Mumbai",
    period: "Expected 2027",
    details:
      "Semester SGPA: Sem 1 7.45, Sem 2 8.01, Sem 3 8.09, Sem 4 9.01. Semesters 5 and 6 not yet reported.",
    semesters: [
      { label: "Semester 1", sgpa: 7.45 },
      { label: "Semester 2", sgpa: 8.01 },
      { label: "Semester 3", sgpa: 8.09 },
      { label: "Semester 4", sgpa: 9.01 },
    ],
    note: "Semesters 5 and 6 not yet reported.",
  },
  {
    degree: "HSC",
    org: "Durgadevi Saraf Junior College, Maharashtra State Board",
    period: "2024",
    details: "68.04%",
  },
  {
    degree: "SSC",
    org: "D.V.M. High School & Junior College",
    period: "2022",
    details: "81.60%",
  },
];

/**
 * Hackathons and competitions, structured for the About timeline. `awards`
 * below keeps the resume wording; this array drives the site.
 */
export const participation = [
  {
    event: "Smart India Hackathon",
    outcome: "Shortlisted — SPOC round",
    note: "SIH26025",
  },
  {
    event: "Avishkar 2025",
    outcome: "Finalist — Engineering & Technology",
    note: "Drishtipath",
  },
  {
    event: "CIIE AI Innovation and Sprints",
    outcome: "First place",
    note: "Drishtipath",
  },
  {
    event: "IndiaNext Hackathon",
    outcome: "Core organising committee",
    note: "",
  },
  {
    event: "Student Research Conference 2025",
    outcome: "Participant",
    note: "",
  },
];

export const awards = [
  "First place — CIIE AI Innovation and Sprints, for Drishtipath",
  "Avishkar 2025 — finalist, Engineering & Technology, for Drishtipath",
  "Smart India Hackathon — shortlisted, SPOC round (SIH26025)",
  "First prize — Katha Katan Pratiyogita; Hindi poems published in college and Hindi Kunj magazines",
  "Participant — Student Research Conference 2025",
];

export interface Certification {
  name: string;
  issuer: string;
  status: "completed" | "pursuing";
}

export const certifications: Certification[] = [
  { name: "Ethical Hacking", issuer: "K.E.S. Shroff College", status: "completed" },
  { name: "Hindi Journalism", issuer: "K.E.S. Shroff College", status: "completed" },
  {
    name: "Robotics Programming & Automation",
    issuer: "K.E.S. Shroff College",
    status: "completed",
  },
  { name: "Arduino Programming", issuer: "K.E.S. Shroff College", status: "completed" },
  { name: "Project Management", issuer: "NPTEL · IIT Roorkee", status: "completed" },
  { name: "DevOps Essentials", issuer: "L&T EduTech", status: "completed" },
  {
    name: "Security Analyst Certificate Program",
    issuer: "Reliance Foundation Skilling Academy",
    status: "completed",
  },
  { name: "Ethical Hacker", issuer: "Cisco Networking Academy", status: "pursuing" },
  {
    name: "Blockchain Programming & Generative AI",
    issuer: "K.E.S. Shroff College",
    status: "pursuing",
  },
];


