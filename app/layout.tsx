import type { Metadata } from "next";
import "./globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      className="bg-[var(--layoutBg)] text-[var(--layoutColor)]"
      >
        {children}
      </body>
    </html>
  );
}
