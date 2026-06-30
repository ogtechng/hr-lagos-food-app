"use client";

import { useRef, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Quote,
  UnderlineIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  minHeightClassName?: string;
}

export function RichTextEditor({
  name,
  defaultValue,
  placeholder,
  minHeightClassName = "min-h-44",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Write content..." }),
    ],
    content: defaultValue ?? "",
    editorProps: {
      attributes: {
        class: `admin-rich-editor ${minHeightClassName} rounded-b-lg border border-t-0 border-input bg-background px-3.5 py-3 text-sm leading-7 outline-none`,
      },
    },
    onUpdate: ({ editor }) => setValue(editor.isEmpty ? "" : editor.getHTML()),
  });

  async function uploadImage(file: File) {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/v1/uploads/editor-images", {
        method: "POST",
        body: formData,
      });
      const payload = (await response.json()) as { data?: { url: string }; error?: string };

      if (!response.ok || !payload.data?.url) {
        throw new Error(payload.error ?? "Image upload failed");
      }

      editor?.chain().focus().setImage({ src: payload.data.url, alt: file.name }).run();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function setLink() {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Paste link URL", previousUrl ?? "");

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  const controls = [
    { label: "Bold", icon: Bold, active: editor?.isActive("bold"), action: () => editor?.chain().focus().toggleBold().run() },
    { label: "Italic", icon: Italic, active: editor?.isActive("italic"), action: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Underline", icon: UnderlineIcon, active: editor?.isActive("underline"), action: () => editor?.chain().focus().toggleUnderline().run() },
    { label: "Heading 1", icon: Heading1, active: editor?.isActive("heading", { level: 1 }), action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "Heading 2", icon: Heading2, active: editor?.isActive("heading", { level: 2 }), action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Heading 3", icon: Heading3, active: editor?.isActive("heading", { level: 3 }), action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Bulleted list", icon: List, active: editor?.isActive("bulletList"), action: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Numbered list", icon: ListOrdered, active: editor?.isActive("orderedList"), action: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "Quote", icon: Quote, active: editor?.isActive("blockquote"), action: () => editor?.chain().focus().toggleBlockquote().run() },
    { label: "Link", icon: LinkIcon, active: editor?.isActive("link"), action: setLink },
  ];

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <div className="flex flex-wrap gap-1 rounded-t-lg border border-input bg-muted/40 p-2">
        {controls.map((control) => {
          const Icon = control.icon;

          return (
            <Button
              key={control.label}
              type="button"
              variant={control.active ? "secondary" : "ghost"}
              size="icon-sm"
              title={control.label}
              aria-label={control.label}
              onClick={control.action}
              disabled={!editor}
            >
              <Icon className="size-4" aria-hidden="true" />
            </Button>
          );
        })}
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          title="Upload image"
          aria-label="Upload image"
          disabled={!editor || uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus className={cn("size-4", uploading && "animate-pulse")} aria-hidden="true" />
        </Button>
      </div>
      <EditorContent editor={editor} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadImage(file);
        }}
      />
    </div>
  );
}
