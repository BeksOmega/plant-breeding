"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Visual style variant */
  variant?: "primary" | "secondary" | "outline";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Button component - a generic, reusable button with multiple variants and sizes.
 * Supports all standard button HTML attributes.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        // Base styles
        "apollo-button",
        "font-teko uppercase tracking-wide",
        "border-2",
        "transition-all duration-150",
        "focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        // Variant styles
        {
          "bg-stone-600 border-stone-800 text-white hover:bg-stone-700":
            variant === "primary",
          "bg-stone-500 border-stone-700 text-white hover:bg-stone-600":
            variant === "secondary",
          "bg-stone-100 border-stone-700 text-stone-800 hover:bg-stone-200":
            variant === "outline",
        },
        // Size styles
        {
          "px-3 py-1.5 text-sm": size === "sm",
          "px-4 py-2 text-base": size === "md",
          "px-6 py-3 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
