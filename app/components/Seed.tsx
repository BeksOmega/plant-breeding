"use client";

import { useState } from "react";

interface SeedProps {
  count: number;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export default function Seed({
  count,
  size = 100,
  isSelected: controlledSelected,
  onSelect,
}: SeedProps) {
  const [internalSelected, setInternalSelected] = useState(false);
  const isSelected =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  const handleClick = () => {
    const newSelected = !isSelected;
    if (controlledSelected === undefined) {
      setInternalSelected(newSelected);
    }
    onSelect?.(newSelected);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        transition-all duration-200 ease-in-out
        flex items-center justify-center
        ${
          isSelected
            ? "ring-4 ring-green-500 ring-offset-2 scale-105"
            : "hover:scale-105"
        }
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#8B4513", // Brown color
        borderRadius: "8px",
      }}
      aria-label={`Seed with count ${count}`}
    >
      <span
        className="text-white font-bold"
        style={{
          fontSize: `${size * 0.3}px`,
        }}
      >
        {count}
      </span>
    </button>
  );
}

