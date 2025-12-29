"use client";

import { useState } from "react";

interface AutoHarvesterItemProps {
  count: number;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export default function AutoHarvesterItem({
  count,
  size = 100,
  isSelected: controlledSelected,
  onSelect,
}: AutoHarvesterItemProps) {
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
        flex items-center justify-center relative
        ${
          isSelected
            ? "ring-4 ring-orange-500 ring-offset-2 scale-105"
            : "hover:scale-105"
        }
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#f97316", // Orange color for harvester
        borderRadius: "8px",
      }}
      aria-label={`Auto harvester stack with ${count} auto harvesters`}
    >
      {/* Harvest/Sell icon */}
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="white"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "absolute" }}
      >
        <path d="M12 2v20M2 12h20"></path>
        <path d="M6 6l12 12M18 6L6 18"></path>
      </svg>

      {/* Count display */}
      <span
        className="text-white font-bold absolute bottom-1 right-1"
        style={{
          fontSize: `${size * 0.25}px`,
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
        }}
      >
        {count}
      </span>
    </button>
  );
}

