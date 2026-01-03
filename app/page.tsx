"use client";

import { useState, useMemo } from "react";
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

  // Calculate button disabled states based on selection
  const buttonStates = useMemo(() => {
    const selectedPots = pots.filter((pot) => selectedIds.includes(pot.id));
    const emptyPotsInSelection = selectedPots.filter((pot) => pot.isEmpty);
    const plantsInSelection = selectedPots.filter((pot) => !pot.isEmpty);

    return {
      disabledPlant: emptyPotsInSelection.length === 0,
      disabledBreed: plantsInSelection.length !== 2,
      disabledCull: plantsInSelection.length === 0,
    };
  }, [pots, selectedIds]);

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
    setSelectedIds([]);
  };

  const handleBreed = () => {
    // TODO: Implement breeding logic
    console.log("Breed clicked");
    setSelectedIds([]);
  };

  const handleCull = () => {
    // TODO: Implement culling logic
    console.log("Cull clicked");
    setSelectedIds([]);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
      <PotGrid
        pots={pots}
        className="w-full"
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      <ControlPanel
        onPlant={handlePlant}
        onBreed={handleBreed}
        onCull={handleCull}
        disabledPlant={buttonStates.disabledPlant}
        disabledBreed={buttonStates.disabledBreed}
        disabledCull={buttonStates.disabledCull}
      />
    </main>
  );
}
