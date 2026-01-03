"use client";

import { HTMLAttributes } from "react";
import clsx from "clsx";

interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100) */
  value: number;
  /** Visual style variant */
  variant?: "primary" | "secondary";
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether the progress bar is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ProgressBar component - displays progress with the same visual style as Button.
 * Supports variants and sizes matching the Button component.
 */
export default function ProgressBar({
  value,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  ...props
}: ProgressBarProps) {
  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      className={clsx(
        // Base styles - common to all progress bars
        "relative",
        "border-2",
        "overflow-hidden",
        "transition-shadow duration-150",
        // Overlay border using ::before pseudo-element
        "before:content-[''] before:absolute before:inset-0 before:border before:border-white/40 before:pointer-events-none before:z-[2]",
        // Primary variant (tangerine) - enabled
        variant === "primary" &&
          !disabled && [
            "bg-tangerine-700 border-tangerine-800",
            "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.2)]",
          ],
        // Primary variant (tangerine) - disabled
        variant === "primary" &&
          disabled && [
            "bg-tangerine-800 border-tangerine-900",
            "shadow-[inset_0_0_0_1px_theme(colors.white/0.05),inset_0_0_2px_theme(colors.black/0.15)]",
          ],
        // Secondary variant (white) - enabled
        variant === "secondary" &&
          !disabled && [
            "bg-gray-300 border-gray-400",
            "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.15)]",
          ],
        // Secondary variant (white) - disabled
        variant === "secondary" &&
          disabled && [
            "bg-gray-400 border-gray-500",
            "shadow-[inset_0_0_0_1px_theme(colors.white/0.05),inset_0_0_2px_theme(colors.black/0.1)]",
          ],
        // Size styles
        {
          "h-2": size === "sm",
          "h-3": size === "md",
          "h-4": size === "lg",
        },
        className
      )}
      {...props}
    >
      {/* Progress fill */}
      <div
        className={clsx(
          "absolute left-0 top-0 h-full transition-all duration-300 ease-out",
          // Primary variant fill - enabled
          variant === "primary" &&
            !disabled && [
              "bg-tangerine-600",
              "shadow-[inset_0_0_0_1px_theme(colors.white/0.3),inset_0_0_12px_theme(colors.tangerine.600/0.6)]",
            ],
          // Primary variant fill - disabled
          variant === "primary" &&
            disabled && [
              "bg-tangerine-700",
              "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.2)]",
            ],
          // Secondary variant fill - enabled
          variant === "secondary" &&
            !disabled && [
              "bg-gray-100",
              "shadow-[inset_0_0_0_1px_theme(colors.white/0.3),inset_0_0_12px_theme(colors.gray.100/0.6)]",
            ],
          // Secondary variant fill - disabled
          variant === "secondary" &&
            disabled && [
              "bg-gray-300",
              "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.15)]",
            ]
        )}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
