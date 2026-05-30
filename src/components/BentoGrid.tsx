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
        "row-span-1 rounded-none group/bento hover:shadow-2xl shadow-black/40 transition duration-200 shadow-input dark:shadow-none p-3 sm:p-4 dark:bg-black dark:border-white/[0.1] bg-white/5 border border-white/10 hover:border-white/20 flex flex-col h-full",
        className
      )}
    >
      {header}
      <div
        className={cn(
          "group-hover/bento:translate-x-2 transition duration-200 flex flex-col justify-between flex-1 min-h-0",
          isProject && "justify-start pt-3 sm:pt-4"
        )}
      >
        {icon && (
          <div className={cn(isProject && "mt-auto mb-2")}>{icon}</div>
        )}
        <div className={cn("font-sans font-bold text-neutral-200 my-2", isProject && "mt-4")}>
          {title}
        </div>
        <div className={cn(
          "font-sans font-normal text-neutral-400 text-xs sm:text-sm",
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