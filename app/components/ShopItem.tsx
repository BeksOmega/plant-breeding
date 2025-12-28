"use client";

interface ShopItemProps {
  color: string;
  label: string;
  price: number;
  onPurchase?: () => void;
  canAfford?: boolean;
  shape: "square" | "circle";
  description?: string;
}

export default function ShopItem({
  color,
  label,
  price,
  onPurchase,
  canAfford = true,
  shape = "square",
  description,
}: ShopItemProps) {
  return (
    <div className="relative group">
      <button
        onClick={onPurchase}
        disabled={!canAfford || !onPurchase}
        className={`
          flex items-center gap-4 p-4 rounded-lg border-2 transition-all
          ${
            canAfford && onPurchase
              ? "border-gray-300 hover:border-green-500 hover:shadow-md bg-white"
              : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
          }
        `}
      >
        {/* Colored square (picture) */}
        <div
          className={`w-16 h-16 ${
            shape === "circle" ? "rounded-full" : "rounded-lg"
          } flex-shrink-0`}
          style={{ backgroundColor: color }}
        />

        {/* Label and price */}
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900">{label}</div>
          <div className="text-sm text-gray-600">${price.toFixed(2)}</div>
        </div>
      </button>

      {/* Tooltip */}
      {description && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64 text-center">
          {description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}
