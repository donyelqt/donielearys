"use client"

import { cn } from "@/lib/utils";

/**
 * Reusable brutalist section header.
 * Structural grammar: [ INDEX / EYEBROW ] + barcode strip + macro heading
 * + full-bleed rule. One red accent only. No gradients, no radius.
 */
export function SectionHeader({
  index,
  title,
  eyebrow,
  meta,
  className,
}: {
  index?: string;
  title: string;
  eyebrow?: string;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("max-w-7xl mx-auto mb-10 md:mb-14", className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="plus-mark text-sm select-none" aria-hidden="true">+</span>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-crimson uppercase tracking-[0.28em] truncate">
              [ {index ? `${index} / ` : ""}{eyebrow ?? title} ]
            </span>
            <span className="barcode hidden sm:block h-3 w-14 shrink-0" aria-hidden="true" />
          </div>
          <h2 className="display-xl text-foreground font-bold">{title}</h2>
        </div>
        {meta ? (
          <div className="tactical-label hidden md:block pb-2 text-right shrink-0">{meta}</div>
        ) : null}
      </div>
      <hr className="mt-6 border-foreground/12" />
    </div>
  );
}
