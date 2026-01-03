"use client";

import { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import Pot from "./Pot";
import { Plant } from "./plants/Plant";
import { renderPlant } from "../utils/plants";

export interface PotData {
  /** Unique identifier for the pot */
  id: string | number;
  /** Whether the pot is empty */
  isEmpty: boolean;
  /** Plant props for the plant in this pot (if not empty) */
  plant?: Plant;
  /** Whether this pot can be selected */
  canSelect?: boolean;
  /** Timestamp when plant growth started */
  startGrowingAt?: number;
}

export interface PotGridProps {
  /** Array of pot data to display */
  pots: PotData[];
  /** Selected pot IDs (controlled) */
  selectedIds?: (string | number)[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  /** Whether multiple pots can be selected */
  multiSelect?: boolean;
  /** Custom className for the grid container. Use Tailwind grid-cols-* classes to control columns (e.g., grid-cols-3, grid-cols-4) */
  className?: string;
}

/**
 * PotGrid component - displays a grid of pots with selection management.
 * Supports both single and multi-select modes.
 */
export default function PotGrid({
  pots,
  selectedIds = [],
  onSelectionChange,
  multiSelect = true,
  className = "",
}: PotGridProps) {
  const handlePotSelect = useCallback(
    (potId: string | number, selected: boolean) => {
      if (!onSelectionChange) return;

      if (multiSelect) {
        if (selected) {
          onSelectionChange([...selectedIds, potId]);
        } else {
          onSelectionChange(selectedIds.filter((id) => id !== potId));
        }
      } else {
        onSelectionChange(selected ? [potId] : []);
      }
    },
    [selectedIds, onSelectionChange, multiSelect]
  );

  return (
    <div
      className={twMerge(
        "grid grid-cols-4 xs:grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-9 2xl:grid-cols-10",
        className
      )}
    >
      {pots.map((pot) => {
        const isSelected = selectedIds.includes(pot.id);
        return (
          <div key={pot.id} className="w-full">
            <Pot
              isEmpty={pot.isEmpty}
              isSelected={isSelected}
              onSelect={(selected) => handlePotSelect(pot.id, selected)}
              canSelect={pot.canSelect ?? true}
            >
              {pot.plant ? renderPlant(pot.plant) : undefined}
            </Pot>
          </div>
        );
      })}
    </div>
  );
}
