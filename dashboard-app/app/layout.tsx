import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "System SL Dashboard",
  description: "Advanced Analytics & Sales Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="flex bg-[#121212]">
        <Sidebar />
        <main className="flex-1 pl-16">
          {children}
        </main>
      </body>
    </html>
  );
}
