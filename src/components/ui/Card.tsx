"use client";

import { motion } from "motion/react";
import { type ReactNode } from "react";

type CardPadding = "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: CardPadding;
  onClick?: () => void;
}

const paddingStyles: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  hover = true,
  padding = "md",
  onClick,
}: CardProps) {
  const baseStyles = "rounded-2xl bg-[var(--color-surface)] shadow-md border border-white/10 dark:border-gray-700 relative overflow-hidden";
  const clickableStyles = onClick ? "cursor-pointer" : "";
  const groupStyles = hover ? "group" : "";

  const combinedClassName = `${baseStyles} ${paddingStyles[padding]} ${clickableStyles} ${groupStyles} ${className}`.trim();

  const content = (
    <>
      {hover && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </>
  );

  if (!hover) {
    return <div className={combinedClassName} onClick={onClick}>{content}</div>;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={combinedClassName}
      onClick={onClick}
    >
      {content}
    </motion.div>
  );
}

export { Card };
