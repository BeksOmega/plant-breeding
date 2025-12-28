"use client";

import { useState } from "react";

interface AutoBreederItemProps {
  count: number;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export default function AutoBreederItem({
  count,
  size = 100,
  isSelected: controlledSelected,
  onSelect,
}: AutoBreederProps) {
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
        backgroundColor: "#ef4444", // Red color for heart
        borderRadius: "8px",
      }}
      aria-label={`Auto breeder stack with ${count} auto breeders`}
    >
      {/* Heart icon */}
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
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
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

