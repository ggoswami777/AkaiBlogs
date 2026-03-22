import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

export const metadata: Metadata = {
  title: "Zolo | Stories from the Edge of the Blade",
  description: "A Japanese-themed social blogging sanctuary for the modern ronin. Forge your legacy, share your path, and find your clan.",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`font-display antialiased bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-x-hidden`}
      >
        <div className="relative flex min-h-screen w-full flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
