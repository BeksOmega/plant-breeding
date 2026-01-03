"use client";

import { ReactNode } from "react";
import clsx from "clsx";

interface PickerProps {
  /** Array of options to cycle through */
  options: string[];
  /** Current selected index */
  value: number;
  /** Change handler */
  onChange?: (index: number) => void;
  /** Visual style variant */
  variant?: "primary" | "secondary";
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Fixed width of the component */
  width?: string;
}

/**
 * Picker component - a horizontal picker with arrows on either side
 * to cycle through text options. Has fixed width to prevent shifting
 * when cycling through options of different lengths.
 */
export default function Picker({
  options,
  value,
  onChange,
  variant = "primary",
  disabled = false,
  className,
  width = "w-44",
}: PickerProps) {
  const handlePrevious = () => {
    if (!disabled && onChange) {
      const newIndex = value === 0 ? options.length - 1 : value - 1;
      onChange(newIndex);
    }
  };

  const handleNext = () => {
    if (!disabled && onChange) {
      const newIndex = value === options.length - 1 ? 0 : value + 1;
      onChange(newIndex);
    }
  };

  const currentOption = options[value] || "";

  const buttonsDisabled = disabled || options.length <= 1;

  return (
    <div
      className={clsx(
        "relative inline-flex items-center",
        "transition-all duration-200",
        "overflow-hidden",
        width,
        "h-10",
        className
      )}
    >
      {/* Left triangle button */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={buttonsDisabled}
        className={clsx(
          "group relative transition-all duration-200 select-none",
          "h-full w-10",
          "overflow-hidden",
          buttonsDisabled && "cursor-not-allowed",
          !buttonsDisabled && "cursor-pointer"
        )}
      >
        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
          viewBox="0 0 40 40"
          preserveAspectRatio="xMidYMid"
        >
          <g transform="translate(20, 20) scale(0.5) translate(-20, -20)">
            <path
              d="M40 0 L40 40 L0 20 Z"
              className={clsx(
                "transition-all duration-200",
                variant === "primary" &&
                  !buttonsDisabled && [
                    "fill-tangerine-600 group-hover:fill-tangerine-500 group-active:fill-tangerine-700",
                  ],
                variant === "primary" &&
                  buttonsDisabled && ["fill-tangerine-700 opacity-50"],
                variant === "secondary" &&
                  !buttonsDisabled && [
                    "fill-gray-100 group-hover:fill-white group-active:fill-gray-200",
                  ],
                variant === "secondary" &&
                  buttonsDisabled && ["fill-gray-300 opacity-50"]
              )}
              stroke={
                variant === "primary" && !buttonsDisabled
                  ? "rgb(194, 65, 12)"
                  : variant === "primary" && buttonsDisabled
                  ? "rgb(154, 52, 18)"
                  : variant === "secondary" && !buttonsDisabled
                  ? "rgb(209, 213, 219)"
                  : "rgb(156, 163, 175)"
              }
              strokeWidth="2"
            />
            <path
              d="M40 0 L40 40 L0 20 Z"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              className="pointer-events-none"
            />
          </g>
        </svg>
      </button>

      {/* Center text display */}
      <div
        className={clsx(
          "relative flex-1 flex items-center justify-center",
          "h-full",
          "font-teko uppercase tracking-wide font-medium",
          "text-base text-gray-900",
          "select-none",
          "transition-all duration-200",
          disabled && "opacity-50, text-gray-900/50"
        )}
      >
        <span className="truncate px-2">{currentOption}</span>
        {/* Overlay border */}
        <div className="absolute inset-0 border border-white/40 pointer-events-none" />
      </div>

      {/* Right triangle button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={buttonsDisabled}
        className={clsx(
          "group relative transition-all duration-200 select-none",
          "h-full w-10",
          "overflow-hidden",
          buttonsDisabled && "cursor-not-allowed",
          !buttonsDisabled && "cursor-pointer"
        )}
      >
        <svg
          className="absolute inset-0"
          width="100%"
          height="100%"
          viewBox="0 0 40 40"
          preserveAspectRatio="xMidYMid"
        >
          <g transform="translate(20, 20) scale(0.5) translate(-20, -20)">
            <path
              d="M0 0 L0 40 L40 20 Z"
              className={clsx(
                "transition-all duration-200",
                variant === "primary" &&
                  !buttonsDisabled && [
                    "fill-tangerine-600 group-hover:fill-tangerine-500 group-active:fill-tangerine-700",
                  ],
                variant === "primary" &&
                  buttonsDisabled && ["fill-tangerine-700 opacity-50"],
                variant === "secondary" &&
                  !buttonsDisabled && [
                    "fill-gray-100 group-hover:fill-white group-active:fill-gray-200",
                  ],
                variant === "secondary" &&
                  buttonsDisabled && ["fill-gray-300 opacity-50"]
              )}
              stroke={
                variant === "primary" && !buttonsDisabled
                  ? "rgb(194, 65, 12)"
                  : variant === "primary" && buttonsDisabled
                  ? "rgb(154, 52, 18)"
                  : variant === "secondary" && !buttonsDisabled
                  ? "rgb(209, 213, 219)"
                  : "rgb(156, 163, 175)"
              }
              strokeWidth="2"
            />
            <path
              d="M0 0 L0 40 L40 20 Z"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              className="pointer-events-none"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}
