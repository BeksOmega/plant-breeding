"use client";

import { useState, useEffect } from "react";
import Plant from "./Plant";
import {
  PlantGenetics,
  getPhenotypeColor,
  getGenotype,
} from "../types/genetics";

interface CabbageProps {
  genetics: PlantGenetics;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  startGrowingAt?: number; // Timestamp when growth should start
  onFullyGrown?: () => void; // Callback when growth completes
  showGenotype?: boolean;
}

const GROWTH_TIME_MS = 10000; // 10 seconds

export default function Cabbage({
  genetics,
  size = 100,
  isSelected,
  onSelect,
  startGrowingAt,
  onFullyGrown,
  showGenotype = false,
}: CabbageProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [isFullyGrown, setIsFullyGrown] = useState(!startGrowingAt);

  const isGrowing = startGrowingAt !== undefined && !isFullyGrown;

  // Update growth progress
  useEffect(() => {
    if (!isGrowing) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      const elapsed = now - startGrowingAt!;
      if (elapsed >= GROWTH_TIME_MS) {
        setIsFullyGrown(true);
        onFullyGrown?.();
      }
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isGrowing, startGrowingAt, onFullyGrown]);

  const growthProgress = isGrowing
    ? Math.min(((currentTime - startGrowingAt!) / GROWTH_TIME_MS) * 100, 100)
    : 100;

  const color = isGrowing ? "#9ca3af" : getPhenotypeColor(genetics);
  const canSelect = isFullyGrown;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <Plant
          color={color}
          size={size}
          isSelected={isSelected && canSelect}
          onSelect={canSelect ? onSelect : undefined}
        />
        {isGrowing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-xs font-bold text-white drop-shad  ow-lg">
              {(
                (GROWTH_TIME_MS - (currentTime - startGrowingAt!)) /
                1000
              ).toFixed(1)}
              s
            </div>
          </div>
        )}
      </div>
      {isGrowing && (
        <div className="mt-2 w-full max-w-[100px]">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-100 ease-linear"
              style={{ width: `${growthProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
