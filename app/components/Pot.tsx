"use client";

import { useState, ReactNode } from "react";

interface PotProps {
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  isEmpty?: boolean;
  children?: ReactNode; // Plant growing in the pot
}

export default function Pot({
  size = 100,
  isSelected: controlledSelected,
  onSelect,
  isEmpty = true,
  children,
}: PotProps) {
  const [internalSelected, setInternalSelected] = useState(false);
  const isSelected =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  const handleClick = () => {
    if (!isEmpty) return; // Don't allow selection of pots with plants
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
        relative
        ${
          isSelected
            ? "ring-4 ring-green-500 ring-offset-2 scale-105"
            : "hover:scale-105"
        }
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#f5f5dc", // Beige/light brown for empty pot
        border: "2px solid #8B4513", // Brown border
        borderRadius: "8px",
      }}
      aria-label={isEmpty ? "Empty pot" : "Pot with plant"}
      disabled={!isEmpty}
    >
      {isEmpty ? (
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="text-gray-400 text-xs"
            style={{ fontSize: `${size * 0.15}px` }}
          >
            Pot
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      )}
    </button>
  );
}

