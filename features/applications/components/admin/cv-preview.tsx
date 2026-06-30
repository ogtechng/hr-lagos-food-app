"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { ExternalLink, FileText, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CvPreviewProps {
  applicationId: string;
  fileName: string | null;
  hasStoragePath: boolean;
  applicantName: string;
  actions?: React.ReactNode;
}

type PreviewState =
  | { kind: "none" }
  | { kind: "loading" }
  | { kind: "ready"; src: string }
  | { kind: "error" };

const OFFICE_EXTENSIONS = new Set(["doc", "docx", "ppt", "pptx", "xls", "xlsx"]);

function extensionOf(fileName: string | null) {
  return (fileName?.split(".").pop() ?? "").toLowerCase();
}

export function CvPreview({
  applicationId,
  fileName,
  hasStoragePath,
  applicantName,
  actions,
}: CvPreviewProps) {
  const openHref = `/api/admin/applications/${applicationId}/cv`;
  const [state, setState] = useState<PreviewState>(
    hasStoragePath ? { kind: "loading" } : { kind: "none" },
  );

  useEffect(() => {
    if (!hasStoragePath) {
      return;
    }

    let cancelled = false;

    fetch(`${openHref}?json=1`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((data: { url: string }) => {
        if (cancelled) return;
        const ext = extensionOf(fileName);
        const src = OFFICE_EXTENSIONS.has(ext)
          ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(data.url)}`
          : data.url;
        setState({ kind: "ready", src });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: "error" });
      });

    return () => {
      cancelled = true;
    };
  }, [openHref, fileName, hasStoragePath]);

  return (
    <section className="dashboard-soft-ring overflow-hidden rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)] xl:sticky xl:top-6">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--admin-border)] px-4 py-3">
        <div className="min-w-0">
          <h2 className="font-display text-base tracking-tight text-[var(--admin-text)]">
            CV preview
          </h2>
          <p className="truncate text-xs text-[var(--admin-muted)]">{fileName ?? "Applicant CV"}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {actions}
          <Button
            nativeButton={false}
            variant="outline"
            size="sm"
            render={<a href={openHref} target="_blank" rel="noreferrer" />}
          >
            Open
            <ExternalLink className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-11rem)] min-h-[640px] w-full bg-neutral-100">
        {state.kind === "ready" && (
          <iframe
            src={state.src}
            title={`CV preview — ${applicantName}`}
            className="size-full"
            allow="fullscreen"
          />
        )}

        {state.kind === "loading" && (
          <div className="flex size-full flex-col items-center justify-center gap-3 text-[var(--admin-muted)]">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <p className="text-sm">Loading preview…</p>
          </div>
        )}

        {(state.kind === "none" || state.kind === "error") && (
          <div className="flex size-full flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-md bg-white text-[var(--admin-muted)] shadow-sm">
              <FileText className="size-5" aria-hidden="true" />
            </span>
            <p className="text-sm font-medium text-[var(--admin-text)]">
              {state.kind === "error" ? "Preview unavailable" : "No inline preview available"}
            </p>
            <p className="max-w-sm text-xs leading-5 text-[var(--admin-muted)]">
              {state.kind === "error"
                ? "This file could not be loaded for preview. Use Open to download it."
                : "This record has no storage path, so the CV can’t be embedded. Use Open, or backfill the storage path for older uploads."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
