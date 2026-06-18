"use client";

import { useId, useState } from "react";
import { FileText } from "lucide-react";

interface DocumentUploadFieldProps {
  name: string;
  label: string;
  buttonLabel?: string;
  helper?: string;
  error?: string;
}

export function DocumentUploadField({
  name,
  label,
  buttonLabel,
  helper,
  error,
}: DocumentUploadFieldProps) {
  const inputId = useId();
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-semibold">
        {label}
      </label>
      <label
        htmlFor={inputId}
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-card/70 p-8 text-center transition-colors hover:border-primary/40 hover:bg-accent/40"
      >
        <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
        <span className="mt-3 text-sm font-semibold">{fileName ?? buttonLabel ?? `Upload ${label}`}</span>
        <span className="mt-1 text-xs leading-5 text-muted-foreground">
          {helper ?? "PDF, DOC, or DOCX. Max size follows the portal upload setting."}
        </span>
      </label>
      <input
        id={inputId}
        name={name}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(event) => setFileName(event.currentTarget.files?.[0]?.name ?? null)}
      />
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
