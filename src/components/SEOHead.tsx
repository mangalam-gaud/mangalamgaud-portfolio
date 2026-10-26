"use client";

import { useEffect } from "react";
import { profile, siteUrl } from "@/data";
import { buildMeta, isKnownPath } from "@/lib/meta";

export function SEOHead({ pathname }: { pathname: string }) {
  const { title, desc, type, image, imageWidth, imageHeight } = buildMeta(pathname);
  const isKnownRoute = isKnownPath(pathname);

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": type,
    name: "Mangalam Rajkeshkar Gaud",
    title,
    description: desc,
    url: `${siteUrl}${pathname}`,
    image,
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
    document.title = title;

    const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", desc);
    setMeta("author", "Mangalam Rajkeshkar Gaud");
    setMeta("theme-color", "#07080a");
    // Soft 404: keep unknown paths out of the index.
    setMeta("robots", isKnownRoute ? "index,follow" : "noindex,follow");
    setMeta("og:type", "website", "property");
    setMeta("og:site_name", "Mangalam Gaud", "property");
    setMeta("og:url", `${siteUrl}${pathname}`, "property");
    setMeta("og:title", title, "property");
    setMeta("og:description", desc, "property");
    setMeta("og:image", image, "property");
    setMeta("og:image:width", String(imageWidth), "property");
    setMeta("og:image:height", String(imageHeight), "property");
    setMeta("og:image:alt", `${profile.name} — ${profile.title}`, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", image);
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
  }, [pathname, title, desc, image, imageWidth, imageHeight, jsonLd, isKnownRoute]);

  return null;
}
