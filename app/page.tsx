"use client";

import { useState, useMemo } from "react";
import PotGrid, { PotData } from "./components/PotGrid";
import { Seed, PlantType } from "./types/seed";
import { getPlantComponent } from "./utils/plants";
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
  const [seeds, setSeeds] = useState<Seed[]>([
    new Seed(
      {
        chromosome1: [true, true, true],
        chromosome2: [true, true, true],
      },
      PlantType.ShepherdsSpindel
    ),
    new Seed(
      {
        chromosome1: [false, false, false],
        chromosome2: [false, false, false],
      },
      PlantType.ShepherdsSpindel
    ),
  ]);

  // Calculate button disabled states based on selection
  const buttonStates = useMemo(() => {
    const selectedPots = pots.filter((pot) => selectedIds.includes(pot.id));
    const emptyPotsInSelection = selectedPots.filter((pot) => pot.isEmpty);
    const plantsInSelection = selectedPots.filter((pot) => !pot.isEmpty);

    return {
      disabledPlant: emptyPotsInSelection.length === 0 || seeds.length === 0,
      disabledBreed: plantsInSelection.length !== 2,
      disabledCull: plantsInSelection.length === 0,
    };
  }, [pots, selectedIds, seeds.length]);

  const handlePlant = () => {
    if (selectedIds.length === 0 || seeds.length === 0) return;

    // Get selected empty pots
    const selectedEmptyPots = pots.filter(
      (pot) => selectedIds.includes(pot.id) && pot.isEmpty
    );

    // Plant only up to the number of seeds available
    const potsToPlant = selectedEmptyPots.slice(0, seeds.length);
    const seedsToUse = seeds.slice(0, potsToPlant.length);

    setPots((prevPots) =>
      prevPots.map((pot): PotData => {
        const seedIndex = potsToPlant.findIndex((p) => p.id === pot.id);
        if (seedIndex !== -1) {
          const seed = seedsToUse[seedIndex];
          return {
            ...pot,
            isEmpty: false,
            plant: getPlantComponent(seed.plantType, seed.genome),
          };
        }
        return pot;
      })
    );

    // Remove used seeds
    setSeeds((prevSeeds) => prevSeeds.slice(seedsToUse.length));

    // Deselect all pots after planting
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
        seedCount={seeds.length}
      />
    </main>
  );
}
