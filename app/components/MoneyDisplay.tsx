"use client";

interface MoneyDisplayProps {
  amount: number;
}

export default function MoneyDisplay({ amount }: MoneyDisplayProps) {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-center gap-2">
        <span className="text-2xl">💰</span>
        <span className="text-2xl font-bold text-gray-900">
          ${amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

