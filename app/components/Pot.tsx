"use client";

import { useState, ReactNode } from "react";

interface PotProps {
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  isEmpty?: boolean;
  canSelect?: boolean; // Whether the pot can be selected (for breeding mode with fully grown plants)
  hasMutagenGlow?: boolean; // Whether the pot has mutagen glow
  children?: ReactNode; // Plant growing in the pot
}

export default function Pot({
  size = 100,
  isSelected: controlledSelected,
  onSelect,
  isEmpty = true,
  canSelect: canSelectProp,
  hasMutagenGlow = false,
  children,
}: PotProps) {
  const [internalSelected, setInternalSelected] = useState(false);
  const isSelected =
    controlledSelected !== undefined ? controlledSelected : internalSelected;

  // Can select if explicitly allowed (for breeding mode) or if empty (for planting mode)
  const canSelect = canSelectProp !== undefined ? canSelectProp : isEmpty;

  const handleClick = () => {
    if (!canSelect) return;
    const newSelected = !isSelected;
    if (controlledSelected === undefined) {
      setInternalSelected(newSelected);
    }
    onSelect?.(newSelected);
  };

  // Get box-shadow for mutagen glow (selection ring uses outline for proper offset support)
  const getBoxShadow = () => {
    if (!hasMutagenGlow) return undefined;

    return "0 0 20px rgba(34, 197, 94, 0.8), 0 0 40px rgba(34, 197, 94, 0.6), inset 0 0 20px rgba(34, 197, 94, 0.3)";
  };

  return (
    <button
      onClick={handleClick}
      className={`
        transition-all duration-200 ease-in-out
        relative
        ${isSelected ? "scale-105" : "hover:scale-105"}
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#f5f5dc", // Beige/light brown for empty pot
        border: "2px solid #8B4513", // Brown border
        borderRadius: "8px",
        boxShadow: getBoxShadow(),
        // Use outline for selection ring (matches Tailwind's ring-4 ring-green-500 ring-offset-2)
        // Outline works independently from box-shadow, so both can be visible
        outline: isSelected ? "4px solid rgba(16, 185, 129, 1)" : undefined,
        outlineOffset: isSelected ? "2px" : undefined,
      }}
      aria-label={isEmpty ? "Empty pot" : "Pot with plant"}
      disabled={!canSelect}
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
