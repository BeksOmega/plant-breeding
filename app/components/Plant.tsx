"use client";

import { useState } from "react";

interface PlantProps {
  color?: string;
  size?: number;
  onSelect?: (selected: boolean) => void;
}

export default function Plant({
  color = "#4ade80",
  size = 100,
  onSelect,
}: PlantProps) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    const newSelected = !isSelected;
    setIsSelected(newSelected);
    onSelect?.(newSelected);
  };

  return (
    <button
      onClick={handleClick}
      className={`
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
        backgroundColor: color,
        borderRadius: "8px",
      }}
      aria-label="Plant"
    />
  );
}
