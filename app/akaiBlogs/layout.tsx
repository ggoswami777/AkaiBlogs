import React from "react";
import "../globals.css"; 

export default function AkaiBlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
       <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-display antialiased bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-x-hidden min-h-screen">
        {children}
      </body>
    </html>
  );
}
