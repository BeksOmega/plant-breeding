"use client";

import { useState } from "react";
import PotGrid, { PotData } from "./components/PotGrid";

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const emptyPots: PotData[] = [
    { id: 1, isEmpty: true },
    { id: 2, isEmpty: true },
    { id: 3, isEmpty: true },
    { id: 4, isEmpty: true },
    { id: 5, isEmpty: true },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <PotGrid
        pots={emptyPots}
        className="w-full"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </main>
  );
}
