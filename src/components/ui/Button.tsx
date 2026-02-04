"use client";

import { motion } from "motion/react";
import { type ReactNode, type MouseEvent } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg hover:shadow-xl",
  secondary: "bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-light)] border border-white/10",
  outline: "border-2 border-[var(--color-primary)] bg-transparent text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white",
  ghost: "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-light)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  children,
  onClick,
  type = "button",
}: ButtonProps) {
  const baseStyles = "rounded-lg font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus:outline-none";
  const disabledStyles = disabled ? "opacity-60 cursor-not-allowed" : "";

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`.trim();

  if (disabled) {
    return (
      <button type={type} className={combinedClassName} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={combinedClassName}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export { Button };
