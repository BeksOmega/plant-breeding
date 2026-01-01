"use client";

import { ReactNode } from "react";

interface PotProps {
  /** Whether the pot is currently selected */
  isSelected?: boolean;
  /** Callback when selection state changes */
  onSelect?: (selected: boolean) => void;
  /** Whether the pot is empty (read-only) */
  isEmpty: boolean;
  /** Whether the pot can be selected */
  canSelect?: boolean;
  /** Plant growing in the pot */
  children?: ReactNode;
}

/**
 * Pot component - displays a pot that can contain a plant.
 * Supports controlled selection state via props.
 */
export default function Pot({
  isSelected = false,
  onSelect,
  isEmpty,
  canSelect = true,
  children,
}: PotProps) {
  const handleClick = () => {
    if (!canSelect) return;
    const newSelected = !isSelected;
    onSelect?.(newSelected);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canSelect}
      className={`
        relative
        w-full h-full
        flex items-center justify-center
        bg-transparent
        border-none
        p-0s
        [--outline-color:theme(colors.rust.300)]
        ${isSelected ? "outline-stroke" : ""}
        ${!canSelect ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      `}
      aria-label={isEmpty ? "Empty pot" : "Pot with plant"}
      aria-pressed={isSelected}
    >
      <svg
        viewBox="0 0 105.83 105.83"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <path
          style={{ fill: "var(--color-rust-700)" }}
          d="M 26.61,50.41 42.1,46.04 H 60.41 L 74.77,50.27 61.25,55.06 38.86,54.92 Z"
        />
        <path
          style={{ fill: "var(--color-stone-700)" }}
          d="m 24.5,51.54 13.94,5.49 23.66,0.14 15.63,-6.34 1.97,11.41 L 77.16,78.57 65.34,96.74 37.36,96.71 24.36,78.29 22.25,60.83 Z"
        />
      </svg>
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {isEmpty ? null : children}
      </div>
    </button>
  );
}
