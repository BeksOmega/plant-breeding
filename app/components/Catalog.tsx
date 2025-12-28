"use client";

import CatalogItem from "./CatalogItem";

export interface CatalogItemData {
  id: string;
  color: string;
  label: string;
  price: number;
  onSell: () => void; // Each item handles its own sell logic
  canSell: boolean; // Whether this item can be sold (plant of this type is selected)
}

interface CatalogProps {
  items: CatalogItemData[];
}

export default function Catalog({ items }: CatalogProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sell Plants</h2>
      <p className="text-gray-600 mb-6">
        Select a fully grown plant to see sell prices and sell it.
      </p>
      
      {/* Catalog items in rows */}
      <div className="space-y-3">
        {items.map((item) => (
          <CatalogItem
            key={item.id}
            color={item.color}
            label={item.label}
            price={item.price}
            canSell={item.canSell}
            onSell={item.onSell}
          />
        ))}
      </div>
    </div>
  );
}

