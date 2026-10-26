"use client";

import { useEffect } from "react";
import { projects, profile, siteUrl } from "@/data";

const routeData: Record<string, { title: string; desc: string; type: "WebSite" | "ProfilePage" | "CollectionPage" }> = {
  "/": {
    title: "Mangalam Gaud | Software Developer — Cybersecurity · Full-stack · IoT",
    desc: "Portfolio of Mangalam Gaud, B.Sc. IT student in Mumbai. Full-stack systems, security tooling and embedded/IoT prototypes, including Drishtipath assistive railway guidance.",
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
    desc: "Mangaud CollegeHub, Smart-Influencing, Mangaud Banking Console, Drishtipath AWS architecture, and more. Full-stack and embedded/IoT projects.",
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
} as const;

export function SEOHead({ pathname }: { pathname: string }) {
  let data = routeData[pathname as keyof typeof routeData];

  // Dynamic meta for /projects/:id — title/desc follow the specific project
  if (!data && pathname.startsWith("/projects/")) {
    const project = projects.find((p) => p.id === pathname.split("/")[2]);
    if (project) {
      data = {
        title: `${project.title} | Mangalam Gaud`,
        desc: `${project.subtitle} Built with ${project.stack.join(", ")}.`,
        type: "ProfilePage",
      };
    }
  }

  const resolved = data ?? routeData["/"];
  const isKnownRoute = Boolean(data);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": resolved.type,
    name: "Mangalam Rajkeshkar Gaud",
    title: resolved.title,
    description: resolved.desc,
    url: `${siteUrl}${pathname}`,
    image: `${siteUrl}/og.png`,
    sameAs: [profile.github, profile.linkedin, profile.instagram, profile.x],
    jobTitle: "Software Developer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "K.E.S. Shroff College",
    },
    knowsAbout: [
      "Java", "Python", "C", "C++", "JavaScript", "TypeScript", "SQL", "PL/SQL",
      "React", "Node.js", "Express.js", "PHP", "JSP", "Servlets", "JDBC",
      "MySQL", "PostgreSQL", "MongoDB", "Oracle SQL",
      "AWS EC2", "VPC", "IAM", "NAT", "Linux",
      "ESP32", "ESP32-C3", "Arduino", "BLE", "LoRa",
    ],
  });

  useEffect(() => {
    document.title = resolved.title;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", resolved.desc);
    setMeta("author", "Mangalam Rajkeshkar Gaud");
    setMeta("theme-color", "#07080a");
    // Soft 404: keep unknown paths out of the index.
    setMeta("robots", isKnownRoute ? "index,follow" : "noindex,follow");
    setMeta("og:type", "website", "property");
    setMeta("og:url", `${siteUrl}${pathname}`, "property");
    setMeta("og:title", resolved.title, "property");
    setMeta("og:description", resolved.desc, "property");
    setMeta("og:image", `${siteUrl}/og.png`, "property");
    setMeta("og:image:width", "1200", "property");
    setMeta("og:image:height", "630", "property");
    setMeta("og:image:alt", `${profile.name} — ${profile.title}`, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", resolved.title);
    setMeta("twitter:description", resolved.desc);
    setMeta("twitter:image", `${siteUrl}/og.png`);
    setMeta("twitter:image:alt", `${profile.name} — ${profile.title}`);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${siteUrl}${pathname === "/" ? "/" : pathname}`;

    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      document.head.appendChild(script);
    }
    script.textContent = jsonLd;
  }, [pathname, resolved.title, resolved.desc, jsonLd, isKnownRoute]);

  return null;
}
