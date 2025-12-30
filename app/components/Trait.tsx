"use client";

import {
  PossibleRecessiveTrait,
  PossibleDominantTrait,
} from "../types/genetics";

interface TraitProps {
  trait: PossibleRecessiveTrait | PossibleDominantTrait;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  isPossiblyRecessive?: boolean; // true if possibly recessive, false if possibly dominant
}

export default function Trait({
  trait,
  size = 100,
  isSelected = false,
  onSelect,
  isPossiblyRecessive = false,
}: TraitProps) {
  // Purple for possibly recessive, blue for possibly dominant
  const borderColor = isPossiblyRecessive ? "#a78bfa" : "#60a5fa"; // Purple or blue
  const borderWidth = 3;

  const handleClick = () => {
    if (onSelect) {
      onSelect(!isSelected);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center justify-center font-mono text-sm font-semibold
        transition-all duration-200 ease-in-out
        ${
          isSelected
            ? "ring-4 ring-green-500 ring-offset-2 scale-105"
            : "hover:scale-105"
        }
      `}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: "4px",
        backgroundColor: "#ffffff",
        color: "#1f2937",
        cursor: onSelect ? "pointer" : "default",
      }}
      disabled={!onSelect}
      aria-label={`Trait: ${trait.dnaSequence}`}
    >
      {trait.dnaSequence}
    </button>
  );
}
