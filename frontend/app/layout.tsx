import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "VedaAI",
  description: "AI-powered assignment generation",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className={`${inter.variable} h-full flex antialiased bg-[#EFEFEF]`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-full overflow-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
