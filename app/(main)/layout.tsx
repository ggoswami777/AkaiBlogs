import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zolo | Stories from the Edge of the Blade",
  description: "A Japanese-themed social blogging sanctuary for the modern ronin. Forge your legacy, share your path, and find your clan.",
};

import FooterNavigation from "@/components/ui/FooterNavigation";

export default function RootLayout({
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
        <div className="relative flex min-h-screen w-full flex-col pb-20 md:pb-0">
          <Header />
          {children}
          <Footer />
          <ToastContainer />
        </div>
        <FooterNavigation />
      </body>
    </html>
  );
}

