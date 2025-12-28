"use client";

import { useState } from "react";

interface MutagenProps {
  count: number;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export default function Mutagen({
  count,
  size = 100,
  isSelected: controlledSelected,
  onSelect,
}: MutagenProps) {
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
        backgroundColor: "#22c55e", // Green color
        borderRadius: "50%", // Circle
        boxShadow: isSelected
          ? "0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.6)"
          : "0 0 15px rgba(34, 197, 94, 0.6), 0 0 30px rgba(34, 197, 94, 0.4)",
      }}
      aria-label={`Mutagen stack with ${count} mutagens`}
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

