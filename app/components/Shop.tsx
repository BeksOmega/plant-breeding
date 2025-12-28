"use client";

import MoneyDisplay from "./MoneyDisplay";
import ShopItem from "./ShopItem";

export interface ShopItemData {
  id: string;
  color: string;
  label: string;
  price: number;
  onPurchase: () => void; // Each item handles its own purchase logic
  shape: "square" | "circle";
  description?: string; // Tooltip description explaining what the item does
}

interface ShopProps {
  money: number;
  items: ShopItemData[];
}

export default function Shop({ money, items }: ShopProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Buy Items</h2>

      {/* Money display at the top */}
      <MoneyDisplay amount={money} />

      {/* Shop items in rows */}
      <div className="flex flex-row gap-4 justify-center">
        {items.map((item) => (
          <ShopItem
            key={item.id}
            color={item.color}
            label={item.label}
            price={item.price}
            shape={item.shape}
            canAfford={money >= item.price}
            onPurchase={item.onPurchase}
            description={item.description}
          />
        ))}
      </div>
    </div>
  );
}
