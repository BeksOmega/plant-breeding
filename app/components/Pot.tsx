"use client";

import { ReactElement } from "react";
import { Plant } from "./plants/Plant";

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
  children?: ReactElement<Plant>;
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
        w-full aspect-16/23
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
        viewBox="0 0 106 105"
        className="absolute bottom-0 w-full"
        aria-hidden="true"
      >
        <path
          style={{ fill: "var(--color-rust-700)" }}
          d="M 26.61,58.67 42.1,54.30 H 60.41 L 74.77,58.53 61.25,63.32 38.86,63.18 Z"
        />
        <path
          style={{ fill: "var(--color-stone-700)" }}
          d="m 24.5,59.80 13.94,5.49 23.66,0.14 15.63,-6.34 1.97,11.41 L 77.16,86.83 65.34,105 37.36,104.97 24.36,86.55 22.25,69.09 Z"
        />
      </svg>
      <div className="absolute top-0 left-0 z-10 w-full h-full">
        {isEmpty ? null : children}
      </div>
    </button>
  );
}
