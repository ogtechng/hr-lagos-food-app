"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadFieldProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  helper?: string;
  className?: string;
}

export function ImageUploadField({
  name,
  label,
  defaultValue,
  helper = "PNG, JPG, WebP, or GIF.",
  className,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(defaultValue ?? "");

  useEffect(
    () => () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  return (
    <div
      className={cn("w-full space-y-2", className)}
      style={{ maxWidth: "100%", overflow: "hidden" }}
    >
      <input type="hidden" name={name} value={value} />
      <input
        ref={inputRef}
        type="file"
        name={`${name}File`}
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.currentTarget.files?.[0];
          if (!file) return;
          if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
          setValue("");
          setFileName(file.name);
          setPreviewUrl(URL.createObjectURL(file));
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold">{label}</span>
        {(value || fileName) && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-neutral-500 hover:text-neutral-900"
            onClick={() => {
              setValue("");
              setFileName(null);
              if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
              setPreviewUrl("");
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            <X className="size-3.5" aria-hidden="true" />
            Remove
          </Button>
        )}
      </div>
      <button
        type="button"
        className={cn(
          "group flex w-full items-center gap-3 rounded-md border border-dashed border-[var(--admin-border)] bg-background p-3 text-left transition hover:bg-neutral-50",
        )}
        style={{ maxWidth: "100%" }}
        onClick={() => inputRef.current?.click()}
      >
        <span className="grid size-11 shrink-0 place-items-center rounded-md bg-neutral-100 text-neutral-600">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="size-full rounded-md object-cover" />
          ) : (
            <ImagePlus className="size-5" aria-hidden="true" />
          )}
        </span>
        <span className="min-w-0 flex-1 overflow-hidden">
          <span className="block truncate text-sm font-medium text-[var(--admin-text)]">
            {fileName || (value ? "Current image" : "Choose image")}
          </span>
          <span className="block truncate text-xs leading-5 text-[var(--admin-muted)]">
            {helper}
          </span>
        </span>
        <UploadCloud
          className="size-4 shrink-0 text-neutral-400 transition group-hover:text-neutral-700"
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
