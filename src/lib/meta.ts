import { projects, siteUrl } from "@/data";

export type MetaType = "WebSite" | "ProfilePage" | "CollectionPage";

export type Meta = {
  title: string;
  desc: string;
  type: MetaType;
  /** Absolute URL of the share image. */
  image: string;
  imageWidth: number;
  imageHeight: number;
};

/** Pages with a fixed title/description. Project pages are derived below. */
export const staticRoutes: Record<string, { title: string; desc: string; type: MetaType }> = {
  "/": {
    title: "Mangalam Gaud | Software Developer — Cybersecurity · Full-stack · IoT",
    desc: "Portfolio of Mangalam Gaud, B.Sc. IT student in Mumbai. Full-stack systems, security tooling and embedded/IoT prototypes, including Drishtipath assistive navigation and Stratavex mine-safety monitoring.",
    type: "WebSite",
  },
  "/about": {
    title: "About Mangalam Gaud | Professional Profile",
    desc: "B.Sc. Information Technology student with experience in Java, PHP, React, Node.js, AWS, ESP32, and assistive technology. Team lead for Drishtipath, CIIE AI Innovation first place.",
    type: "ProfilePage",
  },
  "/skills": {
    title: "Skills & Tools | Mangalam Gaud",
    desc: "Programming, Web & Backend, Databases, Cloud & Systems, Embedded & IoT, and Tools. 3D interactive skill constellation.",
    type: "ProfilePage",
  },
  "/projects": {
    title: "Selected Projects | Mangalam Gaud",
    desc: "Mangaud CollegeHub, Smart-Influencing, Mangaud Banking Console, Smart-Influencing AWS architecture, and more. Full-stack and embedded/IoT projects.",
    type: "CollectionPage",
  },
  "/experience": {
    title: "Experience & Leadership | Mangalam Gaud",
    desc: "Tutor at Keshavi Tutorial, IndiaNext Hackathon committee, Civil Defence Corps volunteer, Drishtipath team lead.",
    type: "ProfilePage",
  },
  "/education": {
    title: "Education | Mangalam Gaud",
    desc: "B.Sc. Information Technology (TY) at K.E.S. Shroff College, Mumbai. Expected 2027. Semester 4 SGPA 9.01.",
    type: "ProfilePage",
  },
  "/contact": {
    title: "Contact Mangalam Gaud | Software Developer",
    desc: "Open to internships, entry-level roles, and collaborations. Email, phone, LinkedIn, Instagram, GitHub and location.",
    type: "ProfilePage",
  },
};

const defaultImage = { image: `${siteUrl}/og.png`, imageWidth: 1200, imageHeight: 630 };

/** Title, description and share image for a pathname. Unknown paths get the home meta. */
export function buildMeta(pathname: string): Meta {
  const fixed = staticRoutes[pathname];
  if (fixed) return { ...fixed, ...defaultImage };

  if (pathname.startsWith("/projects/")) {
    const project = projects.find((p) => p.id === pathname.split("/")[2]);
    if (project) {
      return {
        title: `${project.title} | Mangalam Gaud`,
        desc: `${project.subtitle}. Built with ${project.stack.join(", ")}.`,
        type: "ProfilePage",
        image: `${siteUrl}${project.image}`,
        imageWidth: 1200,
        imageHeight: 675,
      };
    }
  }

  return { ...staticRoutes["/"], ...defaultImage };
}

/** Every route that gets its own pre-rendered HTML for crawlers. */
export const prerenderPaths = [
  ...Object.keys(staticRoutes),
  ...projects.map((p) => `/projects/${p.id}`),
];

/** True for a real page, false for a soft-404 path. */
export function isKnownPath(pathname: string): boolean {
  if (pathname in staticRoutes) return true;
  return projects.some((p) => `/projects/${p.id}` === pathname);
}
