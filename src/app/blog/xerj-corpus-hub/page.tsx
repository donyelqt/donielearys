import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/SectionHeader";
import Footer from "@/components/Footer";

const receipt: Array<{ label: string; value: string; highlight?: boolean }> = [
  { label: "FROM", value: "Ivan N · XERJ.ORG" },
  { label: "RE", value: "donyelqt/Tuklas-Agent — visual parity harness commit" },
  { label: "COUNT", value: "4 files · ~1,100 lines of Python" },
  { label: "ASSESSED", value: "\u201Ca substantial piece of work\u201D" },
  { label: "VERDICT", value: "SELECTED FOR THE XERJ CORPUS HUB", highlight: true },
];

const mechanisms: string[] = [
  "ZERO EMBEDDINGS — NO VECTOR DB, NO API KEYS",
  "5 SCORING CHANNELS — LEXICAL (BM25) · IDENTIFIER · HEADING · CROSS-REF · HIERARCHY",
  "STRUCTURAL DOCUMENT TREE — 2,579 NODES VS 2,392 LEXICAL NODES",
  "ONE AGENT LOOP — 7 TOOLS · 12-ITERATION CAP",
  "LOCAL INFERENCE — OLLAMA — DOCUMENTS NEVER LEAVE THE MACHINE",
];

type MetricRow = { metric: string; scope: string; tuklas: string; baseline: string };

const metrics: MetricRow[] = [
  { metric: "RECALL@5", scope: "TEST-48", tuklas: "0.732", baseline: "0.707" },
  { metric: "MRR@10", scope: "TEST-48", tuklas: "0.686", baseline: "0.657" },
  { metric: "RECALL@5", scope: "DEV-24 · DENSE", tuklas: "0.761", baseline: "0.674" },
];

const metricsFootnote =
  "DEV-24 ARMS ARE NOT LIKE-FOR-LIKE — COMPARISON PUBLISHED ONLY WHEN IT CAN BE ARGUED FAIRLY";

type ProseBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string; cite: string };

const prose: ProseBlock[] = [
  {
    kind: "p",
    text: "The short version went up on LinkedIn: didn\u2019t apply for this. They found me. This is the long version \u2014 what they read, why it stood out, and the numbers I am publishing next to the wins.",
  },
  {
    kind: "p",
    text: "Ivan, founder of XERJ \u2014 an open-source, AI-native search engine \u2014 sent an email this month saying his team reviewed a commit in my Tuklas-Agent repository and selected it for their Corpus Hub. The hub is an open index where coding agents pull verified reference implementations to build on code that works instead of guessing from memory. I have been building agents for a few years now; this is the first time outside people evaluated the work end to end without my involvement and reached for it anyway.",
  },
  {
    kind: "p",
    text: "The commit on their list is the one named test(web): the visual parity harness, and the baseline it compares against. Four files, roughly 1,100 lines of Python \u2014 the parity scripts, and the baseline they compare against.",
  },
  {
    kind: "p",
    text: "A visual parity harness renders the system under test and checks it against a frozen baseline, so regressions surface as evidence rather than screenshots. The sentence Ivan quoted \u2014 the thing he said made the work stand out \u2014 came from the commit message, where I explained why the pass condition cannot simply be a zero-pixel diff:",
  },
  {
    kind: "quote",
    text: "The verdict is stricter than a zero-pixel diff, because a build that ADDS a control cannot have one: the control\u2019s pixels are new pixels.",
    cite: "test(web) commit message \u00b7 Tuklas-Agent",
  },
  {
    kind: "p",
    text: "A build that legitimately adds a control cannot diff to zero against a baseline that never contained that control \u2014 its pixels are new by construction, not by defect. So the verdict has to ask a sharper question than \u201Care the pixels equal\u201D. I wrote that line to stop the harness from being misread as a score nobody could ever reach. Never expected a stranger to quote it. In an index built for agents, the reasoning itself is part of the artifact \u2014 turns out that works in both directions.",
  },
];

const receiptProse: ProseBlock[] = [
  {
    kind: "h2",
    text: "The receipt",
  },
  {
    kind: "p",
    text: "Quoted in full and unedited \u2014 this is the email itself, not a summary of it. The row table underneath is the same receipt in the index grammar this site uses, for anyone skimming it as records rather than paragraphs.",
  },
];

const tuklasProse: ProseBlock[] = [
  {
    kind: "h2",
    text: "For the curious \u2014 what Tuklas actually is",
  },
  {
    kind: "p",
    text: "No infrastructure bill. No vendor dependency. The retrieval quality has to come from structure and scoring discipline, because there is nothing else in the stack.",
  },
];

const evalProse: ProseBlock[] = [
  {
    kind: "h2",
    text: "The numbers, including the loss",
  },
  {
    kind: "p",
    text: "An eval that only ever prints wins is a marketing deck. Both benchmark slices ship with their gates visible:",
  },
  {
    kind: "p",
    text: "On the dev-24 slice the dense arm leads, and the repo says so plainly \u2014 the two arms are not like-for-like, so no headline is being claimed there. The cross-reference channel scores exactly 0.00 on this corpus, and that is documented too. A benchmark you cannot reproduce is trivia. These numbers get their own breakdown soon \u2014 the first one is Tuklas\u2019 own eval, the numbers behind this post.",
  },
];

const nextProse: ProseBlock[] = [
  {
    kind: "h2",
    text: "What is next",
  },
  {
    kind: "p",
    text: "Inclusion in the hub puts the harness in front of agents as a verified reference implementation. The backlog behind it: GraphRAG as a third evaluation arm, and a hybrid blend \u2014 structural tree plus embeddings. Those are hypotheses, not results. Either way the rule stays the same: receipts over claims, and losses printed next to wins.",
  },
];

function renderProse(blocks: ProseBlock[]) {
  return blocks.map((block, index) => {
    if (block.kind === "h2") {
      return (
        <h2
          key={index}
          className="text-xl md:text-2xl font-bold text-foreground mt-12 md:mt-16 mb-5 tracking-tight"
        >
          {block.text}
        </h2>
      );
    }
    if (block.kind === "quote") {
      return (
        <figure key={index} className="border-l-[3px] border-crimson pl-5 my-8">
          <blockquote className="text-foreground/85 text-base md:text-lg leading-relaxed">
            {`\u201C${block.text}\u201D`}
          </blockquote>
          <figcaption className="mt-3 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/40">
            {`\u2014 ${block.cite}`}
          </figcaption>
        </figure>
      );
    }
    return (
      <p key={index} className="text-[15px] md:text-base text-foreground/70 leading-relaxed mb-5">
        {block.text}
      </p>
    );
  });
}

function ArticleFigure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="my-10">
      <div className="border border-foreground/10">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-auto align-top"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
      <figcaption className="mt-2 px-1 text-[9px] font-mono uppercase tracking-[0.18em] text-foreground/60">
        {caption}
      </figcaption>
    </figure>
  );
}

export const metadata: Metadata = {
  title: "They found me — Tuklas-Agent selected for the XERJ Corpus Hub",
  description:
    "An open-source search engine reviewed my visual parity harness and selected it for their Corpus Hub. What they read, why it stood out, and the numbers I publish next to the wins.",
  openGraph: {
    title: "They found me — Tuklas-Agent selected for the XERJ Corpus Hub",
    description:
      "What they read, why it stood out, and the numbers I publish next to the wins.",
    type: "article",
    images: [
      {
        url: "/images/blog/xerj-hub-stats.png",
        width: 1838,
        height: 721,
        alt: "XERJ Corpus Hub — reference memory hub for AI agents, 6M GitHub stars, 11 domains, 4,877 contributors, 78.7 GB of pinned text",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "They found me — Tuklas-Agent selected for the XERJ Corpus Hub",
    description:
      "What they read, why it stood out, and the numbers I publish next to the wins.",
  },
};

export default function XerjCorpusHubPost() {
  return (
    <div className="px-4 pt-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          index="001"
          eyebrow="WRITING"
          title="They found me"
          meta="XERJ CORPUS HUB · OCT 2026"
          as="h1"
        />
      </div>

      <article className="max-w-3xl mx-auto">
        {renderProse(prose)}

        <ArticleFigure
          src="/images/blog/xerj-hub-stats.png"
          alt="XERJ Corpus Hub homepage — a reference memory hub for AI agents pinned at 6M GitHub stars, 11 domains, 4,877 contributors, and 78.7 GB of pinned text"
          caption="FIG 01 · XERJ CORPUS HUB — HUB.XERJ.ORG, PINNED AT SCALE FOR AGENTS"
          width={1838}
          height={721}
        />

        {renderProse(receiptProse)}

        <ArticleFigure
          src="/images/blog/xerj-selection-email.png"
          alt="Selection email from Ivan, founder of XERJ: the Tuklas-Agent visual parity harness commit was reviewed and selected for the XERJ Corpus Hub"
          caption="FIG 02 · THE RECEIPT, UNEDITED — IVAN N · XERJ"
          width={1736}
          height={452}
        />

        <div className="border border-foreground/10 bg-background/60 backdrop-blur-sm">
          <div className="grid-divider">
            {receipt.map((row) => (
              <div
                key={row.label}
                className="px-4 py-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] flex items-baseline justify-between gap-3"
              >
                <span className="text-foreground/60">{row.label}</span>
                <span
                  className={
                    row.highlight
                      ? "text-crimson font-bold text-right"
                      : "text-foreground/70 text-right break-all"
                  }
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {renderProse(tuklasProse)}

        <div className="border border-foreground/10 bg-background/60">
          <ul className="px-4 py-3">
            {mechanisms.map((line) => (
              <li
                key={line}
                className="flex gap-3 text-[11px] sm:text-xs font-mono leading-relaxed py-2 border-b border-foreground/5 last:border-0"
              >
                <span className="text-red-500 select-none" aria-hidden="true">
                  ❯
                </span>
                <span className="text-foreground/70 tracking-[0.12em]">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <ArticleFigure
          src="/images/blog/tuklas-landing.png"
          alt="Tuklas landing page — Retrieval starts at the provision, not the chunk, displaying the document tree explorer an agent navigates"
          caption="FIG 03 · TUKLAS — RETRIEVAL STARTS AT THE PROVISION, NOT THE CHUNK"
          width={1896}
          height={1078}
        />

        {renderProse(evalProse)}

        <div className="border border-foreground/10 bg-background/60">
          <div className="px-4 py-2.5 flex items-baseline justify-between gap-3 border-b border-foreground/10 text-[9px] font-mono uppercase tracking-[0.2em] text-foreground/30">
            <span>Metric · Corpus slice</span>
            <span className="flex gap-6">
              <span className="w-14 text-right text-crimson">Tuklas</span>
              <span className="w-14 text-right text-foreground/60">Lexical</span>
            </span>
          </div>
          {metrics.map((row) => (
            <div
              key={`${row.metric}-${row.scope}`}
              className="px-4 py-3 flex items-baseline justify-between gap-3 text-[11px] sm:text-xs font-mono uppercase tracking-[0.2em] border-b border-foreground/5 last:border-0"
            >
              <span className="text-foreground/70">
                {row.metric} <span className="text-foreground/50">· {row.scope}</span>
              </span>
              <span className="flex gap-6">
                <span className="w-14 text-right text-crimson font-bold">{row.tuklas}</span>
                <span className="w-14 text-right text-foreground/70">{row.baseline}</span>
              </span>
            </div>
          ))}
          <div className="px-4 py-2.5 flex items-center gap-2 text-[9px] font-mono uppercase tracking-[0.18em] text-crimson">
            <span aria-hidden="true">❯</span>
            {metricsFootnote}
          </div>
        </div>

        {renderProse(nextProse)}

        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <a
            href="https://github.com/donyelqt/Tuklas-Agent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the Tuklas-Agent repository on GitHub"
            className="px-6 py-3 bg-foreground text-background text-[11px] font-bold rounded-none flex items-center justify-center gap-2 hover:bg-foreground/90 transition-all uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-crimson focus-visible:outline-offset-2"
          >
            <span className="text-background/70" aria-hidden="true">
              ❯
            </span>
            Repo
          </a>
          <Link
            href="/#projects"
            aria-label="View featured projects"
            className="px-6 py-3 border border-foreground/20 text-foreground text-[11px] font-bold rounded-none flex items-center justify-center gap-2 hover:bg-foreground/5 transition-all uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-crimson focus-visible:outline-offset-2"
          >
            <span className="text-foreground/50" aria-hidden="true">
              ❯
            </span>
            View Projects
          </Link>
          <Link
            href="/"
            aria-label="Return to the home page"
            className="px-6 py-3 border border-foreground/20 text-foreground text-[11px] font-bold rounded-none flex items-center justify-center gap-2 hover:bg-foreground/5 transition-all uppercase tracking-widest focus-visible:outline-2 focus-visible:outline-crimson focus-visible:outline-offset-2"
          >
            <span className="text-foreground/50" aria-hidden="true">
              ❯
            </span>
            Back Home
          </Link>
        </div>
      </article>

      <Footer />
    </div>
  );
}
