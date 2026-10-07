import { cn } from "@/lib/utils";
import React, { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = memo(({ className, title, description, header, icon, type, status, statusClass, href, linkLabel = "Visit" }: { className?: string; title?: string | React.ReactNode; description?: string | React.ReactNode; header?: React.ReactNode; icon?: React.ReactNode; type?: "experience" | "project"; status?: string; statusClass?: string; href?: string; linkLabel?: string; }) => {
  const isExperience = type === "experience";
  const isProject = type === "project";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "relative flex flex-col h-full overflow-hidden rounded-none group/bento shadow-foreground/10",
        "p-4 sm:p-5 lg:p-6",
        "bg-foreground/5 border border-foreground/10",
        "bento-item",
        className
      )}
    >
      {header && <div className="flex-shrink-0 pb-3 sm:pb-4">{header}</div>}

      <div className={cn(
        "flex flex-col flex-1 min-h-0 overflow-hidden",
        isProject && "justify-start"
      )}>
        {icon && (
          <div className={cn("mb-3 sm:mb-4", isProject && "mt-4 sm:mt-6")}>{icon}</div>
        )}
        {status && (
          <p className={cn("text-[10px] font-mono uppercase tracking-[0.2em] mb-2", statusClass)}>
            {status}
          </p>
        )}
        <div className={cn(
          "font-sans font-bold text-foreground",
          isProject ? "text-sm sm:text-base md:text-lg" : "text-sm sm:text-base md:text-lg",
          !isProject && "mt-3 sm:mt-4"
        )}>
          {title}
        </div>
        <div className={cn(
          "font-sans font-normal text-foreground/60 text-xs sm:text-[13px] leading-relaxed",
          "mt-3 sm:mt-4",
          isExperience && "line-clamp-none",
          !isExperience && "line-clamp-4 sm:line-clamp-3"
        )}>
          {description}
        </div>
        {href && (
          <span className="mt-4 inline-flex items-center gap-1.5 self-start text-[11px] font-mono uppercase tracking-[0.16em] text-crimson">
            {linkLabel}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/bento:translate-x-0.5 group-hover/bento:-translate-y-0.5" aria-hidden="true" />
          </span>
        )}
      </div>

      {/* Whole card is the hit target. The anchor is a sibling overlay rather
          than a wrapper so it never nests inside the card's own content. */}
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-crimson"
        >
          <span className="sr-only">{typeof title === "string" ? `${title} — ${linkLabel}` : linkLabel}</span>
        </a>
      )}
    </motion.div>
  );
});

BentoGridItem.displayName = "BentoGridItem";
