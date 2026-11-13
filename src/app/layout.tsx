import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ScrollProgress, { BackToTop } from "@/components/ScrollProgress";
import PreloaderWrapper from "@/components/PreloaderWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClickSoundProvider } from "@/components/ClickSound";
import DotGridLight from "@/components/DotGridLight";
import Script from "next/script";

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-foreground selection:text-background scroll-smooth crop-marks">
        {/* Next 16.2.6: hydration caches the URL fragment into the route cache, and
            every client hash navigation appends onto it (/#a#b#c). Strip the fragment
            before hydration reads location.href; restore the target section on load. */}
        <Script id="normalize-hash-fragment" strategy="beforeInteractive">
          {`(function () {
  try {
    var h = window.location.hash;
    if (!h) return;
    var id = h.slice(1).split("#").pop() || "";
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    if (!id) return;
    // Sections mount only after client-side hydration (PreloaderWrapper gates them),
    // so poll until the fragment target exists instead of a one-shot lookup.
    var deadline = Date.now() + 8000;
    var tick = function () {
      try {
        var el = document.getElementById(id) || document.getElementsByName(id)[0];
        if (el) {
          el.scrollIntoView({ behavior: "instant", block: "start" });
          try { window.history.replaceState(null, "", window.location.pathname + window.location.search + "#" + encodeURIComponent(id)); } catch (e) {}
          return;
        }
      } catch (e) { return; }
      if (Date.now() < deadline) window.requestAnimationFrame(tick);
    };
    if (document.readyState === "complete") window.requestAnimationFrame(tick);
    else window.addEventListener("load", function () { window.requestAnimationFrame(tick); });
  } catch (e) {}
})()`}
        </Script>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClickSoundProvider>
            <ScrollProgress />
            <BackToTop />
            <div className="fixed inset-0 grid-pattern pointer-events-none -z-10" />
            {/* After .grid-pattern: the grid paints an opaque background and the
                light has to composite over it, so it must come later in paint
                order at the same stacking level. */}
            <DotGridLight />
            <Navbar />
            <PreloaderWrapper>
              <main id="main-content" className="flex-1 pt-24">
                {children}
              </main>
            </PreloaderWrapper>
          </ClickSoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
