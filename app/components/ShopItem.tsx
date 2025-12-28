"use client";

interface ShopItemProps {
  color: string;
  label: string;
  price: number;
  onPurchase?: () => void;
  canAfford?: boolean;
  shape: "square" | "circle";
}

export default function ShopItem({
  color,
  label,
  price,
  onPurchase,
  canAfford = true,
  shape = "square",
}: ShopItemProps) {
  return (
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
  );
}
