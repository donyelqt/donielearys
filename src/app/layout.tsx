import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import MouseSpotlight from "@/components/MouseSpotlight";
import ScrollProgress from "@/components/ScrollProgress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doniele Arys Antonio - AI & Software Engineer",
  description: "Developing Agentic AI Architectures",
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
      <body className="min-h-full flex flex-col selection:bg-white selection:text-black">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ScrollProgress />
          <MouseSpotlight />
          <div className="fixed inset-0 grid-pattern pointer-events-none -z-10" />
          <Navbar />
          <main className="flex-1 pt-24">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
