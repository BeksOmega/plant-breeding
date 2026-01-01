"use client";

import { useState, useEffect } from "react";
import {
  PlantGenetics,
  getPhenotypeColor,
  getGenotype,
} from "../types/genetics";
import { Plant, Selectable } from "./Plant";

interface CabbageProps extends Plant, Selectable {}

const GROWTH_TIME_MS = 5000; // 5 seconds

export default function Cabbage({
  genetics,
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

  const handleClick = () => {
    if (canSelect && onSelect) {
      onSelect(!isSelected);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <button
          onClick={handleClick}
          className={`
            transition-all duration-200 ease-in-out
            w-24 h-24
            ${
              isSelected && canSelect
                ? "ring-4 ring-green-500 ring-offset-2 scale-105"
                : canSelect
                ? "hover:scale-105"
                : ""
            }
          `}
          disabled={!canSelect}
          style={{
            backgroundColor: color,
            borderRadius: "8px",
            cursor: canSelect ? "pointer" : "default",
          }}
          aria-label="Cabbage"
        />
        {isGrowing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-xs font-bold text-white drop-shadow-lg">
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
