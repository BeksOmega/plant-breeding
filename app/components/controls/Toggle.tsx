"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ToggleProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  /** Visual style variant */
  variant?: "primary" | "secondary";
  /** Whether the toggle is checked (on) */
  checked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Additional CSS classes */
  className?: string;
  /** Label text for the "off" state (left side) */
  offLabel?: string;
  /** Label text for the "on" state (right side) */
  onLabel?: string;
}

/**
 * Toggle component - a rocker switch-style toggle with multiple variants.
 * The toggle has two sides (off/on) and lights up when active.
 * Supports all standard input HTML attributes.
 */
export default function Toggle({
  variant = "primary",
  checked = false,
  onChange,
  className,
  disabled = false,
  offLabel = "OFF",
  onLabel = "ON",
  ...props
}: ToggleProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <label
      className={clsx(
        "inline-flex items-center gap-2 cursor-pointer",
        disabled && "cursor-not-allowed",
        className
      )}
    >
      <div className="relative inline-block">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className={clsx("sr-only", className)}
          {...props}
        />
        <div
          className={clsx(
            // Base styles - common to all toggles
            "relative",
            "border-2",
            "transition-all duration-200",
            "focus-within:outline-none",
            "disabled:cursor-not-allowed",
            "overflow-hidden",
            "grid grid-cols-2",
            // Primary variant border
            variant === "primary" && [
              "border-tangerine-700",
              disabled && "border-tangerine-800",
            ],
            // Secondary variant border
            variant === "secondary" && [
              "border-gray-300",
              disabled && "border-gray-400",
            ],
            // Fixed size
            "w-32 h-10"
          )}
        >
          {/* Left side (OFF) */}
          <div
            className={clsx(
              "relative flex items-center justify-center",
              "transition-all duration-200",
              "font-teko uppercase tracking-wide font-medium text-gray-900",
              "select-none",
              // Primary variant - left side (off)
              variant === "primary" &&
                !disabled && [
                  !checked
                    ? [
                        // Active (pressed down) - lit up
                        "bg-tangerine-500 border-r border-tangerine-600",
                        "shadow-[inset_0_0_0_1px_theme(colors.white/0.4),inset_0_0_16px_theme(colors.tangerine.600/0.8)]",
                        "[text-shadow:0_1px_1px_theme(colors.black/0.1)]",
                      ]
                    : [
                        // Inactive (up) - dim
                        "bg-tangerine-700 border-r border-tangerine-800",
                        "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.2)]",
                        "opacity-60",
                      ],
                ],
              // Primary variant - disabled
              variant === "primary" &&
                disabled && [
                  "bg-tangerine-800 border-r border-tangerine-900",
                  "shadow-[inset_0_0_0_1px_theme(colors.white/0.05),inset_0_0_4px_theme(colors.black/0.3)]",
                  "opacity-50",
                ],
              // Secondary variant - left side (off)
              variant === "secondary" &&
                !disabled && [
                  !checked
                    ? [
                        // Active (pressed down) - lit up
                        "bg-white border-r border-gray-200",
                        "shadow-[inset_0_0_0_1px_theme(colors.white/0.4),inset_0_0_16px_theme(colors.gray.100/0.8)]",
                        "[text-shadow:0_1px_1px_theme(colors.black/0.1)]",
                      ]
                    : [
                        // Inactive (up) - dim
                        "bg-gray-200 border-r border-gray-300",
                        "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.15)]",
                        "opacity-60",
                      ],
                ],
              // Secondary variant - disabled
              variant === "secondary" &&
                disabled && [
                  "bg-gray-400 border-r border-gray-500",
                  "shadow-[inset_0_0_0_1px_theme(colors.white/0.05),inset_0_0_4px_theme(colors.black/0.2)]",
                  "opacity-50",
                ],
              // Fixed text size
              "text-sm"
            )}
          >
            <span>{offLabel}</span>
            {/* Overlay border */}
            <div className="absolute inset-0 border border-white/40 pointer-events-none" />
          </div>

          {/* Right side (ON) */}
          <div
            className={clsx(
              "relative flex items-center justify-center",
              "transition-all duration-200",
              "font-teko uppercase tracking-wide font-medium text-gray-900",
              "select-none",
              // Primary variant - right side (on)
              variant === "primary" &&
                !disabled && [
                  checked
                    ? [
                        // Active (pressed down) - lit up
                        "bg-tangerine-500 border-l border-tangerine-600",
                        "shadow-[inset_0_0_0_1px_theme(colors.white/0.4),inset_0_0_16px_theme(colors.tangerine.600/0.8)]",
                        "[text-shadow:0_1px_1px_theme(colors.black/0.1)]",
                      ]
                    : [
                        // Inactive (up) - dim
                        "bg-tangerine-700 border-l border-tangerine-800",
                        "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.2)]",
                        "opacity-60",
                      ],
                ],
              // Primary variant - disabled
              variant === "primary" &&
                disabled && [
                  "bg-tangerine-800 border-l border-tangerine-900",
                  "shadow-[inset_0_0_0_1px_theme(colors.white/0.05),inset_0_0_4px_theme(colors.black/0.3)]",
                  "opacity-50",
                ],
              // Secondary variant - right side (on)
              variant === "secondary" &&
                !disabled && [
                  checked
                    ? [
                        // Active (pressed down) - lit up
                        "bg-white border-l border-gray-200",
                        "shadow-[inset_0_0_0_1px_theme(colors.white/0.4),inset_0_0_16px_theme(colors.gray.100/0.8)]",
                        "[text-shadow:0_1px_1px_theme(colors.black/0.1)]",
                      ]
                    : [
                        // Inactive (up) - dim
                        "bg-gray-200 border-l border-gray-300",
                        "shadow-[inset_0_0_0_1px_theme(colors.white/0.1),inset_0_0_4px_theme(colors.black/0.15)]",
                        "opacity-60",
                      ],
                ],
              // Secondary variant - disabled
              variant === "secondary" &&
                disabled && [
                  "bg-gray-400 border-l border-gray-500",
                  "shadow-[inset_0_0_0_1px_theme(colors.white/0.05),inset_0_0_4px_theme(colors.black/0.2)]",
                  "opacity-50",
                ],
              // Fixed text size
              "text-sm"
            )}
          >
            <span>{onLabel}</span>
            {/* Overlay border */}
            <div className="absolute inset-0 border border-white/40 pointer-events-none" />
          </div>
        </div>
      </div>
    </label>
  );
}
