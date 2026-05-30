import { cn } from "@/lib/utils";
import React, { memo } from "react";
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

export const BentoGridItem = memo(({
  className,
  title,
  description,
  header,
  icon,
  type,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  type?: "experience" | "project";
}) => {
  const isExperience = type === "experience";
  const isProject = type === "project";

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "flex flex-col h-full overflow-hidden rounded-none group/bento hover:shadow-2xl shadow-black/40 transition duration-200 shadow-input dark:shadow-none p-3 sm:p-4 dark:bg-black dark:border-white/[0.1] bg-white/5 border border-white/10 hover:border-white/20",
        className
      )}
    >
      {header && <div className="flex-shrink-0">{header}</div>}

      <div className={cn(
        "flex flex-col flex-1 min-h-0 overflow-hidden",
        isProject && "justify-start"
      )}>
        {icon && <div className={cn("mb-1.5 sm:mb-2", isProject && "mt-auto")}>{icon}</div>}
        <div className={cn("font-sans font-bold text-neutral-200 truncate", isProject && "mt-3 sm:mt-4")}>
          {title}
        </div>
        <div className={cn(
          "font-sans font-normal text-neutral-400 text-xs sm:text-sm mt-1.5 overflow-hidden",
          isExperience && "line-clamp-none",
          !isExperience && "line-clamp-3"
        )}>
          {description}
        </div>
      </div>
    </motion.div>
  );
});

BentoGridItem.displayName = "BentoGridItem";