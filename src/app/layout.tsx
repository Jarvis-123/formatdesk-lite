import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FormatDesk Lite — merge PDFs in the browser",
  description: "Client-side PDF merge. No upload to server. No Gotenberg.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
