"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children: ReactNode;
  /** Visual style variant */
  variant?: "primary" | "secondary";
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
        // Base styles - common to all buttons
        "relative",
        "font-teko uppercase tracking-wide",
        "border-2",
        "transition-shadow duration-150",
        "focus:outline-none",
        "disabled:cursor-not-allowed",
        "font-medium",
        // Overlay border using ::before pseudo-element
        "before:content-[''] before:absolute before:inset-0 before:border before:border-white/40 before:pointer-events-none before:z-[1]",
        // Primary variant (tangerine) - enabled
        variant === "primary" &&
          !disabled && [
            "bg-tangerine-600 border-tangerine-700 text-gray-900",
            "shadow-[inset_0_0_0_1px_theme(colors.white/0.3),inset_0_0_12px_theme(colors.tangerine.600/0.6)]",
            "[text-shadow:0_1px_1px_theme(colors.black/0.1)]",
            "hover:bg-tangerine-500",
            "hover:shadow-[inset_0_0_0_1px_theme(colors.white/0.4),inset_0_0_16px_theme(colors.tangerine.600/0.8)]",
            "active:shadow-[inset_0_0_8px_theme(colors.black/0.3)]",
          ],
        // Primary variant (tangerine) - disabled
        variant === "primary" &&
          disabled && [
            "bg-tangerine-700 border-tangerine-800 text-gray-900/50",
            "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.2)]",
            "[text-shadow:none]",
          ],
        // Secondary variant (white) - enabled
        variant === "secondary" &&
          !disabled && [
            "bg-gray-100 border-gray-300 text-gray-900",
            "shadow-[inset_0_0_0_1px_theme(colors.white/0.3),inset_0_0_10px_theme(colors.gray.100/0.6)]",
            "[text-shadow:0_1px_1px_theme(colors.black/0.1)]",
            "hover:bg-white",
            "hover:shadow-[inset_0_0_0_1px_theme(colors.white/0.4),inset_0_0_14px_theme(colors.gray.100/0.8)]",
            "active:shadow-[inset_0_0_8px_theme(colors.black/0.3)]",
          ],
        // Secondary variant (white) - disabled
        variant === "secondary" &&
          disabled && [
            "bg-gray-300 border-gray-400 text-gray-900/50",
            "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.15)]",
            "[text-shadow:none]",
          ],
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
