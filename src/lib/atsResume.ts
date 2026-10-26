import { jsPDF } from "jspdf";
import { profile, skills, resumeProjects, experience, education, awards, certifications } from "@/data";

/**
 * Text resume: single column, standard section headings, real selectable text.
 * Built with jsPDF text primitives so every line is machine-readable; the only
 * image is the portrait in the header.
 *
 * Target: one A4 page. If content ever overflows, a new page is added rather
 * than clipping anything.
 */

/** `/avatar.png` as a data URL — jsPDF needs the bytes, not a path. */
async function loadPhoto() {
  const response = await fetch("/avatar.png");
  if (!response.ok) throw new Error("Portrait not available");
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function buildAtsResumePdf() {
  // A missing portrait must not cost the visitor their resume.
  const photo = await loadPhoto().catch(() => null);
  const doc = new jsPDF({ unit: "pt", format: "a4", compress: false });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 36;
  const CW = pageW - M * 2;
  const BOTTOM = pageH - 36;
  let y = M;

  const ink = () => doc.setTextColor(17, 17, 17);
  const grey = () => doc.setTextColor(85, 85, 85);
  const set = (size: number, style: "normal" | "bold" | "italic" = "normal") => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
  };
  const ensure = (h: number) => {
    if (y + h > BOTTOM) {
      doc.addPage();
      y = M;
    }
  };
  const wrapped = (text: string, size: number, style: "normal" | "bold" = "normal", indent = 0, lh = 9.6) => {
    set(size, style);
    const lines = doc.splitTextToSize(text, CW - indent) as string[];
    ensure(lines.length * lh + 2);
    doc.text(lines, M + indent, y);
    y += lines.length * lh;
  };
  const bullet = (text: string, size = 8.2) => {
    set(size);
    const lines = doc.splitTextToSize(text, CW - 10) as string[];
    ensure(lines.length * 9.4);
    doc.text("-", M + 2, y);
    doc.text(lines, M + 10, y);
    y += lines.length * 9.4;
  };
  const section = (title: string) => {
    y += 4;
    ensure(26);
    set(9, "bold");
    ink();
    doc.text(title.toUpperCase(), M, y);
    y += 3;
    doc.setDrawColor(17, 17, 17);
    doc.setLineWidth(0.6);
    doc.line(M, y, pageW - M, y);
    y += 8;
  };
  const inlineBold = (lead: string, size = 8.4, lh = 9.6) => {
    set(size, "bold");
    ink();
    ensure(lh);
    doc.text(lead, M, y, { maxWidth: CW });
    y += lh;
  };

  // Header — portrait top-right, so the text column stops short of it.
  const PHOTO = 62;
  const HEADER_W = CW - PHOTO - 14;

  set(20, "bold");
  ink();
  doc.text(profile.name, M, y + 12);
  y += 26;
  set(10);
  doc.text(doc.splitTextToSize(profile.title, HEADER_W) as string[], M, y);
  y += 12;
  set(8.4);
  grey();
  const contact = doc.splitTextToSize(
    `${profile.location}  |  ${profile.phone}  |  ${profile.email}`,
    HEADER_W
  ) as string[];
  doc.text(contact, M, y);
  y += contact.length * 9.6;
  // LinkedIn is shown as a name only — the full URL stays in the link annotation.
  const ghText = "github.com/mangalam-gaud  |  ";
  doc.text(ghText, M, y);
  doc.textWithLink("LinkedIn", M + doc.getTextWidth(ghText), y, { url: profile.linkedin });

  if (photo) {
    doc.addImage(photo, "PNG", pageW - M - PHOTO, 30, PHOTO, PHOTO);
    doc.setDrawColor(17, 17, 17);
    doc.setLineWidth(0.6);
    doc.rect(pageW - M - PHOTO, 30, PHOTO, PHOTO);
  }

  y = Math.max(y, photo ? 30 + PHOTO : 0) + 8;
  doc.setLineWidth(1);
  doc.line(M, y, pageW - M, y);
  y += 10;

  // Profile
  section("Professional Summary");
  ink();
  wrapped(profile.resumeSummary, 8.2);

  // Skills
  section("Technical Skills");
  ink();
  skills.forEach((group) => {
    set(8.2, "bold");
    doc.text(`${group.category}: `, M, y);
    const leadW = doc.getTextWidth(`${group.category}: `);
    set(8.2);
    const lines = doc.splitTextToSize(group.items.join(", "), CW - leadW) as string[];
    ensure(lines.length * 9.4);
    doc.text(lines, M + leadW, y);
    y += lines.length * 9.4;
  });

  // Projects
  section("Selected Projects");
  ink();
  resumeProjects.forEach((p) => {
    ensure(28);
    set(8.8, "bold");
    const projectUrl = ("demo" in p && p.demo) || p.link;
    if (projectUrl) doc.textWithLink(`${p.title} \u2014 ${p.subtitle}`, M, y, { url: projectUrl });
    else doc.text(`${p.title} \u2014 ${p.subtitle}`, M, y);
    y += 9.6;
    set(7.8);
    grey();
    const stack = doc.splitTextToSize(p.stack.join(", "), CW) as string[];
    doc.text(stack, M, y);
    y += stack.length * 8.8 + 1;
    ink();
    p.highlights.slice(0, 2).forEach((h) => bullet(h));
    if ("facts" in p && p.facts) {
      set(7.6, "bold");
      grey();
      const facts = doc.splitTextToSize(p.facts, CW) as string[];
      ensure(facts.length * 8.4);
      doc.text(facts, M, y);
      y += facts.length * 8.4;
      ink();
    }
    y += 2;
  });

  // Experience
  section("Experience & Leadership");
  ink();
  experience.forEach((exp) => {
    inlineBold(`${exp.role} | ${exp.org} (${exp.period})`);
    y += 0.5;
    wrapped(exp.description, 8.2, "normal", 0, 9.4);
    y += 2;
  });

  // Education
  section("Education");
  ink();
  education.forEach((edu) => {
    inlineBold(`${edu.degree} \u2014 ${edu.org} (${edu.period})`);
    // Structured semesters beat the prose sentence: same data, one readable line.
    const marks = edu.semesters
      ? `SGPA — ${edu.semesters
          .map((s) => `${s.label.replace("Semester", "Sem")} ${s.sgpa.toFixed(2)}`)
          .join("  ·  ")}${edu.note ? `  ·  ${edu.note}` : ""}`
      : edu.details;
    wrapped(marks, 8.2, "normal", 0, 9.4);
    y += 1.5;
  });

  // Awards
  section("Awards & Achievements");
  ink();
  awards.slice(0, 4).forEach((a) => bullet(a));

  // Certifications — one line each, so the list stays readable.
  section("Certifications");
  ink();
  certifications.forEach((c) => {
    const status = c.status === "pursuing" ? " (pursuing)" : "";
    bullet(`${c.name} — ${c.issuer}${status}`, 8);
  });

  doc.setProperties({
    title: `${profile.name} — Resume`,
    author: profile.name,
    subject: "Resume — Security · Full-stack · IoT",
    creator: "mangalam-gaud portfolio",
  });

  return doc;
}
