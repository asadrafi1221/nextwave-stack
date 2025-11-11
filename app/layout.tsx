import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Nextwave Stack</title>
      </head>
      <body
      className="bg-[var(--layoutBg)] text-[var(--layoutColor)]"
      >
        <TooltipProvider>
        {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
