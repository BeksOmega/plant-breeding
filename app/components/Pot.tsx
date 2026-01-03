"use client";

import { ReactElement, useEffect, useState } from "react";
import { Plant } from "./plants/Plant";
import ProgressBar from "./controls/ProgressBar";
import Paragraph from "./typography/Paragraph";

const GROWTH_TIME_MS = 10000; // 10 seconds

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
  /** Timestamp when plant growth started */
  startGrowingAt?: number;
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
  startGrowingAt,
}: PotProps) {
  const [growthProgress, setGrowthProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const isGrowing = startGrowingAt !== undefined && growthProgress < 100;
  const isFullyGrown = startGrowingAt === undefined || growthProgress >= 100;

  useEffect(() => {
    if (!startGrowingAt) {
      setGrowthProgress(0);
      return;
    }

    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - startGrowingAt;
      const progress = Math.min(100, (elapsed / GROWTH_TIME_MS) * 100);
      const remaining = Math.max(0, (GROWTH_TIME_MS - elapsed) / 1000);
      setGrowthProgress(progress);
      setRemainingTime(remaining);
    };

    // Update immediately
    updateProgress();

    // Update every 100ms for smooth animation
    const interval = setInterval(updateProgress, 100);

    return () => clearInterval(interval);
  }, [startGrowingAt]);

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
      <div className="absolute top-0 left-0 z-10 w-full aspect-square">
        {isEmpty || !isFullyGrown ? null : children}
      </div>
      {isGrowing && (
        <div className="absolute bottom-2 left-2 right-2 z-20 space-y-1">
          <div className="font-rajdhani text-xs text-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {remainingTime.toFixed(1)}s
          </div>
          <ProgressBar value={growthProgress} size="sm" />
        </div>
      )}
    </button>
  );
}
