"use client";

import { Fragment, useMemo } from "react";

import { cn } from "@/lib/utils";

interface RichTextRendererProps {
  html: string | null;
  fallback?: string;
  className?: string;
}

const allowedTags = new Set([
  "P",
  "BR",
  "STRONG",
  "EM",
  "U",
  "S",
  "BLOCKQUOTE",
  "UL",
  "OL",
  "LI",
  "H1",
  "H2",
  "H3",
  "A",
  "IMG",
]);

function renderNode(node: ChildNode, key: string): React.ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node as Element;

  if (!allowedTags.has(element.tagName)) {
    return Array.from(element.childNodes).map((child, index) =>
      renderNode(child, `${key}-${index}`),
    );
  }

  const children = Array.from(element.childNodes).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );

  switch (element.tagName) {
    case "P":
      return <p key={key}>{children}</p>;
    case "BR":
      return <br key={key} />;
    case "STRONG":
      return <strong key={key}>{children}</strong>;
    case "EM":
      return <em key={key}>{children}</em>;
    case "U":
      return <u key={key}>{children}</u>;
    case "S":
      return <s key={key}>{children}</s>;
    case "BLOCKQUOTE":
      return <blockquote key={key}>{children}</blockquote>;
    case "UL":
      return <ul key={key}>{children}</ul>;
    case "OL":
      return <ol key={key}>{children}</ol>;
    case "LI":
      return <li key={key}>{children}</li>;
    case "H1":
      return <h1 key={key}>{children}</h1>;
    case "H2":
      return <h2 key={key}>{children}</h2>;
    case "H3":
      return <h3 key={key}>{children}</h3>;
    case "A": {
      const href = element.getAttribute("href") ?? "#";
      return (
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    }
    case "IMG": {
      const src = element.getAttribute("src");
      if (!src) return null;

      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={key} src={src} alt={element.getAttribute("alt") ?? ""} loading="lazy" />
      );
    }
    default:
      return <Fragment key={key}>{children}</Fragment>;
  }
}

export function RichTextRenderer({ html, fallback, className }: RichTextRendererProps) {
  const content = useMemo(() => {
    if (!html || typeof DOMParser === "undefined") {
      return fallback ?? null;
    }

    const document = new DOMParser().parseFromString(html, "text/html");
    return Array.from(document.body.childNodes).map((node, index) => renderNode(node, String(index)));
  }, [fallback, html]);

  if (!content) return null;

  return (
    <div className={cn("rich-text-content", className)}>
      {typeof content === "string" ? <p>{content}</p> : content}
    </div>
  );
}
