"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toPng } from "html-to-image";
import { ResumePrint } from "./ResumePrint";
import { Button } from "./ui/Button";
import { FileText, Image as ImageIcon } from "lucide-react";

type Preview = { kind: "pdf" | "png"; url: string; revoke?: boolean };

/**
 * Résumé downloads open a read-only preview first, then the visitor chooses
 * Download or Print. Two formats:
 * - PDF: single-column text generated with jsPDF, portrait in the header.
 * - Image: the designed two-column layout, captured from offscreen markup.
 * Both read the same `resumeProjects` so the content cannot drift.
 */
export function ResumeDownload() {
  const ref = useRef<HTMLDivElement>(null);
  const cachedPng = useRef<string | null>(null);
  const [busy, setBusy] = useState<"pdf" | "png" | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);

  const renderResumePng = async () => {
    if (cachedPng.current) return cachedPng.current;
    const node = ref.current;
    if (!node) throw new Error("Resume capture node missing");
    const dataUrl = await toPng(node, {
      // 1x keeps the capture fast; 800px still prints legibly
      pixelRatio: 1,
      backgroundColor: "#ffffff",
      width: 800,
      // The capture node is parked offscreen with position:fixed; html-to-image
      // copies computed styles, so without this the clone renders off-canvas.
      style: { position: "static", left: "0", top: "0", transform: "none", margin: "0" },
      // Resume uses system fonts only — embedding web fonts dominates capture time
      skipFonts: true,
    });
    cachedPng.current = dataUrl;
    return dataUrl;
  };

  const openPreview = async (kind: "pdf" | "png") => {
    setBusy(kind);
    try {
      if (kind === "pdf") {
        const { buildAtsResumePdf } = await import("@/lib/atsResume");
        const pdf = await buildAtsResumePdf();
        setPreview({ kind, url: String(pdf.output("bloburl")), revoke: true });
      } else {
        setPreview({ kind, url: await renderResumePng() });
      }
    } catch (error) {
      console.error("Failed to generate resume preview", error);
    } finally {
      setBusy(null);
    }
  };

  const downloadPreview = () => {
    if (!preview) return;
    const link = document.createElement("a");
    link.href = preview.url;
    link.download = preview.kind === "pdf" ? "Mangalam-Gaud-Resume.pdf" : "Mangalam-Gaud-Resume.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printPreview = () => {
    if (!preview) return;
    if (preview.kind === "pdf") {
      // The browser's PDF viewer owns printing; hand it the document.
      window.open(preview.url, "_blank");
      return;
    }
    const win = window.open("", "_blank");
    if (!win) return;
    // The designed image is taller than A4: fit it to one page instead of spilling.
    win.document.write(
      `<!doctype html><title>Mangalam Gaud — Resume</title>
       <style>@page{size:A4;margin:10mm}html,body{height:100%;margin:0}img{display:block;margin:0 auto;max-width:100%;max-height:100%;}</style>
       <body><img src="${preview.url}" alt="Mangalam Gaud resume"></body>`
    );
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!preview) return;
    lastFocus.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreview(null);
        return;
      }
      if (e.key !== "Tab") return;
      // Keep focus inside the modal; the page behind is inert to AT but not to Tab.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, iframe, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocus.current?.focus();
    };
  }, [preview]);

  // Blob URLs live exactly as long as the preview that uses them.
  useEffect(() => {
    return () => {
      if (preview?.revoke) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  return (
    <>
      {/* Offscreen designed layout, captured for the image download only */}
      <div ref={ref} className="fixed left-[-9999px] top-0 w-[800px] z-[-1]">
        <ResumePrint forceScreen />
      </div>

      <div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => openPreview("pdf")}
            disabled={busy !== null}
            aria-busy={busy === "pdf"}
            startIcon={<FileText className="w-4 h-4" aria-hidden="true" />}
          >
            {busy === "pdf" ? "Generating PDF..." : "Resume (PDF)"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => openPreview("png")}
            disabled={busy !== null}
            aria-busy={busy === "png"}
            startIcon={<ImageIcon className="w-4 h-4" aria-hidden="true" />}
          >
            {busy === "png" ? "Generating image..." : "Resume (Image)"}
          </Button>
        </div>
        <p className="mt-2 mono-label">PDF: single-column text · Image: designed layout</p>
      </div>

      {preview &&
        createPortal(
          // Portalled to <body>: the page wrapper is its own stacking context,
          // so a dialog nested there would paint under the fixed nav.
          <div
            ref={dialogRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={preview.kind === "pdf" ? "Resume PDF preview" : "Resume image preview"}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPreview(null);
            }}
            className="fixed inset-0 z-[200] bg-bg/95 p-4 outline-none sm:p-8"
          >
            <div className="mx-auto flex h-full w-full max-w-4xl flex-col">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <span className="mono-label">
                  Resume · {preview.kind === "pdf" ? "PDF text" : "Designed image"}
                </span>
                <div className="flex items-center gap-3">
                  <Button variant="accent" onClick={downloadPreview}>
                    Download
                  </Button>
                  <Button variant="outline" onClick={printPreview}>
                    Print
                  </Button>
                  <Button variant="ghost" onClick={() => setPreview(null)}>
                    Close
                  </Button>
                </div>
              </div>
              <div
                tabIndex={0}
                aria-label="Resume preview"
                role="region"
                className="min-h-0 flex-1 overflow-auto rounded-lg border border-border bg-surface"
              >
                {preview.kind === "pdf" ? (
                  <iframe src={preview.url} title="Resume preview" className="h-full min-h-[70vh] w-full" />
                ) : (
                  <img
                    src={preview.url}
                    alt="Resume designed layout preview"
                    className="mx-auto block w-full max-w-[820px]"
                  />
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
