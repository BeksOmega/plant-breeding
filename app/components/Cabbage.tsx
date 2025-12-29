"use client";

import { useState, useEffect } from "react";
import Plant from "./Plant";
import {
  PlantGenetics,
  getPhenotypeColor,
  getGenotype,
  getGrowingSpeed,
  getPlantTooltip,
} from "../types/genetics";
import { CONFIG } from "../config";

interface CabbageProps {
  genetics: PlantGenetics;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  startGrowingAt?: number; // Timestamp when growth should start
  onFullyGrown?: () => void; // Callback when growth completes
  showGenotype?: boolean;
}

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
  const growthTimeMs = getGrowingSpeed(genetics);

  // Update growth progress
  useEffect(() => {
    if (!isGrowing) return;

    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentTime(now);

      const elapsed = now - startGrowingAt!;
      if (elapsed >= growthTimeMs) {
        setIsFullyGrown(true);
        onFullyGrown?.();
      }
    }, CONFIG.animation.growthUpdateInterval);

    return () => clearInterval(interval);
  }, [isGrowing, startGrowingAt, onFullyGrown, growthTimeMs]);

  const growthProgress = isGrowing
    ? Math.min(((currentTime - startGrowingAt!) / growthTimeMs) * 100, 100)
    : 100;

  const color = isGrowing ? "#9ca3af" : getPhenotypeColor(genetics);
  const canSelect = isFullyGrown;

  // Fast-growing plants (homozygous recessive for speed) are smaller when fully grown
  const isFastGrowing = genetics.chromosome1[1] && genetics.chromosome2[1];
  const displaySize = isFullyGrown && isFastGrowing ? size * 0.9 : size;

  const tooltipText = getPlantTooltip(genetics);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" title={tooltipText}>
        <Plant
          color={color}
          size={displaySize}
          isSelected={isSelected && canSelect}
          onSelect={canSelect ? onSelect : undefined}
        />
        {isGrowing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-xs font-bold text-white drop-shad  ow-lg">
              {(
                (growthTimeMs - (currentTime - startGrowingAt!)) /
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
