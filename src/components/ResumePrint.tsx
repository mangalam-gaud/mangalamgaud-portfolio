"use client";

import { profile, skills, resumeProjects, experience, education, awards, certifications } from "@/data";
import type { ReactNode } from "react";

/**
 * Print/screen resume. Hidden on screen by default; visible when printing or
 * when forceScreen=true (offscreen capture for the PDF/PNG downloads).
 *
 * Styles are screen-visible on purpose: html-to-image reads computed *screen*
 * styles, so print-only classes would capture an unstyled document.
 *
 * Helvetica/Arial is deliberate: the capture skips web fonts, and the fallback
 * shaping of Space Grotesk mangled ligatures ("fi" came out oversized). It also
 * matches the Helvetica used by the PDF.
 *
 * Parser-ready: semantic headings, all keywords present as visible selectable
 * text, single reading order (main column then sidebar), no hidden metadata.
 */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4 break-inside-avoid">
      <h2 className="mb-1.5 border-b border-[#111] pb-1 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#111]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ResumePrint({ forceScreen = false }: { forceScreen?: boolean } = {}) {
  return (
    <div
      className={`${
        forceScreen ? "block" : "hidden print:block"
      } resume-doc w-full bg-white text-[#111] print:bg-white`}
    >
      <div className="mx-auto w-full max-w-[800px] bg-white px-10 py-8 print:max-w-none print:px-0 print:py-0">
        {/* Header */}
        <header className="flex items-start justify-between gap-8 border-b border-[#111] pb-4">
          <div>
            <h1 className="text-[30px] font-bold leading-none tracking-tight text-[#111]">
              {profile.name}
            </h1>
            <p className="mt-1.5 text-[13px] font-medium text-[#111]">{profile.title}</p>
            <p className="mt-0.5 text-[11px] text-[#444]">{profile.subtitle}</p>
            <div className="mt-2 font-mono text-[10px] leading-relaxed text-[#333]">
              <p>{profile.location}</p>
              <p>
                <a href={`tel:${profile.phone}`} className="text-[#111]">{profile.phone}</a>
                <span aria-hidden="true" className="text-[#999]"> · </span>
                <a href={`mailto:${profile.email}`} className="text-[#111]">{profile.email}</a>
              </p>
              <p>
                <a href={profile.github} className="text-[#111]">github.com/mangalam-gaud</a>
                <span aria-hidden="true" className="text-[#999]"> · </span>
                <a href={profile.linkedin} className="text-[#111]">LinkedIn</a>
              </p>
            </div>
          </div>
          <img
            src="/avatar.png"
            alt="Mangalam Gaud profile photo"
            className="h-[112px] w-[90px] shrink-0 rounded-sm border border-[#111] object-cover"
            loading="eager"
            decoding="async"
          />
        </header>

        <div className="mt-5 grid grid-cols-[1fr_190px] gap-7">
          {/* Main column — a div, not <main>: the résumé lives inside the page's main. */}
          <div>
            <Section title="Profile">
              <p className="text-[10.5px] leading-[1.55] text-[#222]">{profile.resumeSummary}</p>
            </Section>

            <Section title="Selected Projects">
              <div className="space-y-3">
                {resumeProjects.map((p) => (
                  <article key={p.id} className="break-inside-avoid">
                    <h3 className="text-[11px] font-bold text-[#111]">{p.title}</h3>
                    <p className="font-mono text-[9px] leading-snug text-[#555]">
                      {p.stack.join(" · ")}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-[1.5] text-[#222]">{p.description}</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-3.5 text-[9.5px] leading-[1.45] text-[#333]">
                      {p.highlights.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                    {"facts" in p && p.facts && (
                      <p className="mt-1 text-[9.5px] font-semibold leading-snug text-[#111]">
                        {p.facts}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            </Section>

            <Section title="Experience & Leadership">
              <div className="space-y-3">
                {experience.map((exp) => (
                  <article key={exp.role} className="break-inside-avoid">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-[11px] font-bold text-[#111]">{exp.role}</h3>
                      <span className="shrink-0 font-mono text-[8.5px] text-[#555]">{exp.period}</span>
                    </div>
                    <p className="text-[9.5px] font-medium text-[#444]">{exp.org}</p>
                    <p className="mt-0.5 text-[10px] leading-[1.5] text-[#222]">{exp.description}</p>
                  </article>
                ))}
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <aside className="border-l border-[#d4d4d4] pl-5">
            <Section title="Technical Skills">
              <div className="space-y-1.5">
                {skills.map((cat) => (
                  <p key={cat.category} className="text-[9.5px] leading-[1.45] text-[#222]">
                    <span className="font-bold text-[#111]">{cat.category}</span>
                    <br />
                    {cat.items.join(", ")}
                  </p>
                ))}
              </div>
            </Section>

            <Section title="Education">
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.degree}>
                    <h3 className="text-[10px] font-bold leading-snug text-[#111]">{edu.degree}</h3>
                    <p className="text-[9px] text-[#444]">{edu.org}</p>
                    <p className="font-mono text-[8.5px] text-[#555]">{edu.period}</p>
                    {edu.semesters ? (
                      // 2x2 grid: a dotted run-on line wrapped mid-semester in the narrow sidebar.
                      <div className="mt-1">
                        <p className="text-[9px] font-semibold text-[#111]">SGPA</p>
                        <div className="mt-0.5 grid grid-cols-2 gap-x-2 font-mono text-[8.5px] text-[#333]">
                          {edu.semesters.map((s) => (
                            <span key={s.label}>
                              {s.label.replace("Semester", "Sem")} {s.sgpa.toFixed(2)}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-0.5 text-[9px] leading-[1.4] text-[#333]">{edu.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Awards">
              <ul className="list-disc space-y-0.5 pl-3.5 text-[9.5px] leading-[1.4] text-[#333]">
                {awards.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Section>
          </aside>
        </div>

        {/* Full width: nine certificates squeezed into the sidebar were unreadable. */}
        <div className="mt-1">
          <Section title="Certifications">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {certifications.map((c) => (
                <li key={c.name} className="text-[9.5px] leading-snug text-[#333]">
                  <span className="font-semibold text-[#111]">{c.name}</span>
                  <span className="text-[#555]"> — {c.issuer}</span>
                  {c.status === "pursuing" && (
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#555]">
                      {" "}
                      (pursuing)
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}
