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
        viewBox="0 0 105.83333 105.83333"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        <path
          style={{
            opacity: 1,
            fill: "var(--color-rust-700)",
            stroke: "none",
          }}
          d="M 26.613165,50.41012 42.102307,46.044998 H 60.407655 L 74.770315,50.269309 61.25252,55.056862 38.863666,54.916051 Z"
        />
        <path
          style={{
            opacity: 1,
            fill: "var(--color-stone-700)",
            stroke: "none",
          }}
          d="m 24.501007,51.536602 13.940228,5.491604 23.656147,0.140812 15.629951,-6.336467 1.971347,11.40564 L 77.164093,78.572198 65.33602,96.736738 37.355921,96.710252 24.360197,78.290575 22.248041,60.830089 Z"
        />
      </svg>
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {isEmpty ? null : children}
      </div>
    </button>
  );
}
