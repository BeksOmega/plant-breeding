"use client";

import { useState } from "react";

interface AutoPlanterItemProps {
  count: number;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export default function AutoPlanterItem({
  count,
  size = 100,
  isSelected: controlledSelected,
  onSelect,
}: AutoPlanterItemProps) {
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
            ? "ring-4 ring-green-500 ring-offset-2 scale-105"
            : "hover:scale-105"
        }
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#10b981", // Green color for planter
        borderRadius: "8px",
      }}
      aria-label={`Auto planter stack with ${count} auto planters`}
    >
      {/* Seed/Plant icon */}
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
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
        <path d="M12 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
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

