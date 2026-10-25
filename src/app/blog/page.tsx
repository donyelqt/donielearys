import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import Footer from "@/components/Footer";

const entries: Array<{
  index: string;
  href: string;
  title: string;
  note: string;
  meta: string;
}> = [
  {
    index: "001",
    href: "/blog/xerj-corpus-hub",
    title: "They found me",
    note: "XERJ reviewed a Tuklas-Agent commit and selected it for their Corpus Hub. The long version, with receipts.",
    meta: "XERJ CORPUS HUB · OCT 2026",
  },
];

export const metadata: Metadata = {
  title: "Writing — Doniele Arys Antonio",
  description: "Long-form notes on agentic AI, retrieval, and the receipts behind the claims.",
  openGraph: {
    title: "Writing — Doniele Arys Antonio",
    description: "Long-form notes on agentic AI, retrieval, and the receipts behind the claims.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Writing — Doniele Arys Antonio",
    description: "Long-form notes on agentic AI, retrieval, and the receipts behind the claims.",
  },
};

export default function BlogIndex() {
  return (
    <div className="px-4 pt-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <SectionHeader index="000" eyebrow="WRITING" title="Writing" meta="001 ENTRY PUBLISHED" as="h1" />
      </div>

      <div className="max-w-3xl mx-auto">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            aria-label={`Read post: ${entry.title}`}
            className="group block border border-foreground/10 bg-background/60 backdrop-blur-sm hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-crimson focus-visible:outline-offset-2 transition-colors"
          >
            <div className="grid-divider">
              <div className="px-4 py-3 text-[9px] font-mono uppercase tracking-[0.2em] text-foreground/30 flex items-center gap-2">
                <span className="text-crimson select-none" aria-hidden="true">
                  +
                </span>
                {entry.index}
                <span className="barcode hidden sm:block h-3 w-14" aria-hidden="true" />
                <span className="ml-auto text-foreground/40">{entry.meta}</span>
              </div>
              <div className="px-4 py-5 border-t border-foreground/10">
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight group-hover:text-crimson transition-colors">
                    {entry.title}
                  </h2>
                  <span
                    className="text-foreground/30 group-hover:text-crimson transition-colors select-none text-sm"
                    aria-hidden="true"
                  >
                    ❯
                  </span>
                </div>
                <p className="mt-2 text-sm text-foreground/60 leading-relaxed">{entry.note}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Footer />
    </div>
  );
}
