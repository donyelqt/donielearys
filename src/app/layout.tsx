import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MouseSpotlight from "@/components/MouseSpotlight";
import ScrollProgress, { BackToTop } from "@/components/ScrollProgress";
import PreloaderWrapper from "@/components/PreloaderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doniele - AI & Software Engineer",
  description: "Developing Agentic AI Architectures",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Doniele — AI & Software Engineer",
    description:
      "Agentic AI architectures, production infrastructure, and applied research. Top 20 Global, AMD Developer Hackathon.",
    type: "profile",
  },
  twitter: {
    card: "summary",
    title: "Doniele — AI & Software Engineer",
    description: "Developing Agentic AI Architectures",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col selection:bg-white selection:text-black scroll-smooth">
        {/* Dark-only world: the OS light theme previously stripped `.dark` here and
            rendered near-black text on the hard-coded black body. */}
        <ScrollProgress />
        <BackToTop />
        <MouseSpotlight />
        <div className="fixed inset-0 grid-pattern pointer-events-none -z-10" />
        <Navbar />
        <PreloaderWrapper>
          <main id="main-content" className="flex-1 pt-24">
            {children}
          </main>
        </PreloaderWrapper>
      </body>
    </html>
  );
}
