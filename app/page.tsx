"use client";

import { useState } from "react";
import PotGrid, { PotData } from "./components/PotGrid";
import ShepherdsSpindel from "./components/plants/ShepherdsSpindel";
import { PlantGenetics } from "./types/genetics";
import ControlPanel from "./components/ControlPanel";

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [pots, setPots] = useState<PotData[]>([
    { id: 1, isEmpty: true },
    { id: 2, isEmpty: true },
    { id: 3, isEmpty: true },
    { id: 4, isEmpty: true },
    { id: 5, isEmpty: true },
  ]);

  const defaultGenetics: PlantGenetics = {
    chromosome1: [true, true, true],
    chromosome2: [true, true, true],
  };

  const handlePlant = () => {
    if (selectedIds.length === 0) return;

    setPots((prevPots) =>
      prevPots.map((pot) => {
        if (selectedIds.includes(pot.id) && pot.isEmpty) {
          return {
            ...pot,
            isEmpty: false,
            plant: <ShepherdsSpindel genetics={defaultGenetics} />,
          };
        }
        return pot;
      })
    );
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <button
        onClick={handlePlant}
        disabled={selectedIds.length === 0}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Plant ShepherdsSpindel
      </button>
      <PotGrid
        pots={pots}
        className="w-full"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      <ControlPanel />
    </main>
  );
}
