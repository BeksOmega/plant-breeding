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
        "transition-all duration-150",
        "focus:outline-none",
        "disabled:cursor-not-allowed",
        "font-medium",
        // Overlay border using ::before pseudo-element
        "before:content-[''] before:absolute before:inset-0 before:border before:border-[rgba(255,255,255,0.4)] before:pointer-events-none before:z-[1]",
        // Primary variant (orange) - enabled
        variant === "primary" &&
          !disabled && [
            "bg-[#ff8800] border-[#cc6600] text-[#1a1a1a]",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),inset_0_0_12px_rgba(255,136,0,0.6),0_0_8px_rgba(255,136,0,0.4),0_2px_4px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.1)]",
            "[text-shadow:0_1px_1px_rgba(0,0,0,0.1)]",
            "hover:bg-[#ffaa33]",
            "hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4),inset_0_0_16px_rgba(255,136,0,0.8),0_0_12px_rgba(255,136,0,0.6),0_2px_4px_rgba(0,0,0,0.3),0_0_0_1px_rgba(0,0,0,0.1)]",
            "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_0_8px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.2)]",
            "active:translate-x-[1px] active:translate-y-[1px]",
          ],
        // Primary variant (orange) - disabled
        variant === "primary" &&
          disabled && [
            "bg-[#cc7700] border-[#996600] text-[#664422]",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_4px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.1)]",
            "[text-shadow:none]",
          ],
        // Secondary variant (white) - enabled
        variant === "secondary" &&
          !disabled && [
            "bg-[#f0f0f0] border-[#d0d0d0] text-[#1a1a1a]",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.5),inset_0_0_10px_rgba(255,255,255,0.4),0_0_6px_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.1)]",
            "[text-shadow:0_1px_1px_rgba(0,0,0,0.1)]",
            "hover:bg-[#ffffff]",
            "hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6),inset_0_0_14px_rgba(255,255,255,0.6),0_0_10px_rgba(255,255,255,0.5),0_2px_4px_rgba(0,0,0,0.2),0_0_0_1px_rgba(0,0,0,0.1)]",
            "active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),inset_0_0_8px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.2)]",
            "active:translate-x-[1px] active:translate-y-[1px]",
          ],
        // Secondary variant (white) - disabled
        variant === "secondary" &&
          disabled && [
            "bg-[#d0d0d0] border-[#b0b0b0] text-[#666666]",
            "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_4px_rgba(0,0,0,0.15),0_2px_4px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.1)]",
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
