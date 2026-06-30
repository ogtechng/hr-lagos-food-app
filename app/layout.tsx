import type { Metadata } from "next";
import { Geist, Hanken_Grotesk } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/context/query-provider";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Produce for Lagos Careers",
  description:
    "Recruitment portal for Produce for Lagos roles across infrastructure, finance, logistics, food systems, and trading.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${hankenGrotesk.variable} h-full antialiased`}
      style={
        {
          "--font-body": geist.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full w-screen overflow-x-hidden flex flex-col bg-background text-foreground">
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
