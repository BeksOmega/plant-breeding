"use client";

interface CatalogItemProps {
  color: string;
  label: string;
  price: number;
  onSell?: () => void;
  canSell?: boolean;
}

export default function CatalogItem({
  color,
  label,
  price,
  onSell,
  canSell = false,
}: CatalogItemProps) {
  return (
    <div
      className={`
        flex items-center gap-4 p-4 rounded-lg border-2 transition-all
        ${
          canSell && onSell
            ? "border-gray-300 hover:border-yellow-500 hover:shadow-md bg-white"
            : "border-gray-200 bg-gray-50"
        }
      `}
    >
      {/* Colored square (picture) */}
      <div
        className="w-16 h-16 rounded-lg flex-shrink-0"
        style={{ backgroundColor: color }}
      />

      {/* Label and price */}
      <div className="flex-1 text-left">
        <div className="font-semibold text-gray-900">{label}</div>
        <div className="text-sm text-gray-600">${price.toFixed(2)}</div>
      </div>

      {/* Sell button */}
      <button
        onClick={onSell}
        disabled={!canSell || !onSell}
        className={`
          px-4 py-2 rounded-lg font-semibold text-white transition-all
          ${
            canSell && onSell
              ? "bg-yellow-600 hover:bg-yellow-700 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed opacity-60"
          }
        `}
      >
        Sell
      </button>
    </div>
  );
}



