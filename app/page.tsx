"use client";

import { useState, useMemo } from "react";
import PlantCollection from "./components/PlantCollection";
import Cabbage from "./components/Cabbage";
import Seed from "./components/Seed";
import Pot from "./components/Pot";
import { PlantGenetics, breed, countPurpleCabbages } from "./types/genetics";

interface CabbageData {
  id: string;
  genetics: PlantGenetics;
  startGrowingAt?: number; // Timestamp when growth started
}

interface SeedData {
  id: string;
  count: number;
}

interface PotData {
  id: string;
  plantId?: string; // ID of the plant growing in this pot, undefined if empty
}

const TARGET_PURPLE_COUNT = 3;

export default function Home() {
  // Start with one RR cabbage and one rr cabbage
  const [cabbages, setCabbages] = useState<CabbageData[]>([
    { id: "c1", genetics: { allele1: false, allele2: false } }, // RR
    { id: "c2", genetics: { allele1: true, allele2: true } }, // rr
  ]);

  const [selectedCabbageIds, setSelectedCabbageIds] = useState<string[]>([]);
  const [fullyGrownCabbageIds, setFullyGrownCabbageIds] = useState<Set<string>>(
    new Set(["c1", "c2"]) // Initial cabbages start fully grown
  );

  // Seeds state
  const [seeds, setSeeds] = useState<SeedData[]>([
    { id: "s1", count: 5 },
    { id: "s2", count: 3 },
  ]);
  const [selectedSeedIds, setSelectedSeedIds] = useState<string[]>([]);

  // Pots state - start with a few empty pots
  const [pots, setPots] = useState<PotData[]>([
    { id: "p1" },
    { id: "p2" },
    { id: "p3" },
    { id: "p4" },
  ]);
  const [selectedPotIds, setSelectedPotIds] = useState<string[]>([]);

  // Count purple cabbages (only count fully grown ones)
  const fullyGrownCabbages = useMemo(
    () => cabbages.filter((c) => fullyGrownCabbageIds.has(c.id)),
    [cabbages, fullyGrownCabbageIds]
  );
  const purpleCount = useMemo(
    () => countPurpleCabbages(fullyGrownCabbages),
    [fullyGrownCabbages]
  );

  const hasWon = purpleCount >= TARGET_PURPLE_COUNT;

  const handleBreed = () => {
    if (selectedCabbageIds.length !== 2) return;

    const parent1 = cabbages.find((c) => c.id === selectedCabbageIds[0]);
    const parent2 = cabbages.find((c) => c.id === selectedCabbageIds[1]);

    if (!parent1 || !parent2) return;

    const childGenetics = breed(parent1.genetics, parent2.genetics);
    const now = Date.now();
    const newCabbage: CabbageData = {
      id: `c${now}`,
      genetics: childGenetics,
      startGrowingAt: now,
    };

    setCabbages((prev) => [...prev, newCabbage]);
    setSelectedCabbageIds([]);
  };

  const handleCabbageFullyGrown = (cabbageId: string) => {
    setFullyGrownCabbageIds((prev) => new Set(prev).add(cabbageId));
  };

  // Handle pot selection - if seeds are selected, plant them
  const handlePotSelection = (potIds: string[]) => {
    setSelectedPotIds(potIds);

    // If a pot is selected and seeds are already selected, plant them
    if (potIds.length > 0 && selectedSeedIds.length > 0) {
      const potId = potIds[0];
      const seedId = selectedSeedIds[0];

      const pot = pots.find((p) => p.id === potId);

      // Can only plant in empty pots
      if (pot && !pot.plantId) {
        // Create a new plant with random genetics (from seeds)
        const newGenetics: PlantGenetics = {
          allele1: Math.random() < 0.5,
          allele2: Math.random() < 0.5,
        };

        const now = Date.now();
        const newCabbageId = `c${now}`;
        const newCabbage: CabbageData = {
          id: newCabbageId,
          genetics: newGenetics,
          startGrowingAt: now,
        };

        // Add the new plant
        setCabbages((prev) => [...prev, newCabbage]);

        // Assign plant to pot
        setPots((prev) =>
          prev.map((p) =>
            p.id === potId ? { ...p, plantId: newCabbageId } : p
          )
        );

        // Decrease seed count
        setSeeds((prev) => {
          const updated = prev.map((s) =>
            s.id === seedId ? { ...s, count: Math.max(0, s.count - 1) } : s
          );
          // Remove seeds with 0 count
          return updated.filter((s) => s.count > 0);
        });

        // Clear selections
        setSelectedSeedIds([]);
        setSelectedPotIds([]);
      }
    }
  };

  const canBreed = selectedCabbageIds.length === 2;
  const canPlant = selectedSeedIds.length > 0 && selectedPotIds.length > 0;
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Plant Breeding
          </h1>

          {/* Breeding Game */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <p className="text-gray-600 mb-6">
              Goal: Breed {TARGET_PURPLE_COUNT} purple cabbages.
            </p>
            <p className="text-gray-600 mb-6">
              Select 2 cabbages and click Breed to create a new cabbage with
              randomly combined traits from the parents.
            </p>

            {hasWon && (
              <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                <p className="text-2xl font-bold text-green-800">
                  🎉 Congratulations! You've bred {purpleCount} purple cabbages!
                </p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-700">
                Purple Cabbages: {purpleCount} / {TARGET_PURPLE_COUNT}
              </p>
            </div>

            <div className="mb-6">
              <button
                onClick={handleBreed}
                disabled={!canBreed}
                className={`
                  px-6 py-3 rounded-lg font-semibold text-white transition-all
                  ${
                    canBreed
                      ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Breed Selected Cabbages
              </button>
              {selectedCabbageIds.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {selectedCabbageIds.length} cabbage(s) selected
                </p>
              )}
            </div>

            <PlantCollection
              items={cabbages}
              maxSelected={2}
              selectedIds={selectedCabbageIds}
              onSelectionChange={setSelectedCabbageIds}
              renderItem={(cabbage, isSelected, onSelect) => (
                <Cabbage
                  genetics={cabbage.genetics}
                  size={100}
                  isSelected={isSelected}
                  onSelect={onSelect}
                  startGrowingAt={cabbage.startGrowingAt}
                  onFullyGrown={() => handleCabbageFullyGrown(cabbage.id)}
                  showGenotype={true}
                />
              )}
            />
          </div>

          {/* Seeds Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seeds</h2>
            <p className="text-gray-600 mb-6">
              Select seeds and then select an empty pot to plant them.
            </p>
            <PlantCollection
              items={seeds}
              maxSelected={1}
              selectedIds={selectedSeedIds}
              onSelectionChange={setSelectedSeedIds}
              renderItem={(seed, isSelected, onSelect) => (
                <Seed
                  count={seed.count}
                  size={100}
                  isSelected={isSelected}
                  onSelect={onSelect}
                />
              )}
            />
          </div>

          {/* Pots Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pots</h2>
            <p className="text-gray-600 mb-6">
              {selectedSeedIds.length > 0
                ? "Select an empty pot to plant your seeds."
                : "Select seeds first, then select a pot to plant them."}
            </p>
            <PlantCollection
              items={pots}
              maxSelected={1}
              selectedIds={selectedPotIds}
              onSelectionChange={handlePotSelection}
              renderItem={(pot, isSelected, onSelect) => {
                const isEmpty = !pot.plantId;
                const plant = pot.plantId
                  ? cabbages.find((c) => c.id === pot.plantId)
                  : null;

                return (
                  <Pot
                    size={100}
                    isSelected={isSelected}
                    onSelect={isEmpty ? onSelect : undefined}
                    isEmpty={isEmpty}
                  >
                    {plant && (
                      <Cabbage
                        genetics={plant.genetics}
                        size={80}
                        isSelected={false}
                        startGrowingAt={plant.startGrowingAt}
                        onFullyGrown={() => handleCabbageFullyGrown(plant.id)}
                        showGenotype={false}
                      />
                    )}
                  </Pot>
                );
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
