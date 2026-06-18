"use client";

import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string[];
  maxSize?: number;
  className?: string;
}

export function FileUpload({
  onFileSelect,
  accept = ACCEPTED_TYPES,
  maxSize = MAX_SIZE,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback(
    (file: File) => {
      if (!accept.includes(file.type)) {
        setError("Only PDF, DOC, and DOCX files are allowed");
        return false;
      }
      if (file.size > maxSize) {
        setError("File size must be less than 5MB");
        return false;
      }
      return true;
    },
    [accept, maxSize],
  );

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validateFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  return (
    <div className={className}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-card/70 p-10 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/40 hover:bg-accent/40",
        )}
      >
        <p className="text-sm font-semibold">Upload Resume / CV</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">PDF, DOC, or DOCX (max 5MB)</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="mt-2 text-xs font-semibold text-destructive">{error}</p>}
    </div>
  );
}
