"use client";

import { useState, useMemo } from "react";
import PlantCollection from "./components/PlantCollection";
import Cabbage from "./components/Cabbage";
import {
  PlantGenetics,
  breed,
  countPurpleCabbages,
  getGenotype,
} from "./types/genetics";

interface CabbageData {
  id: string;
  genetics: PlantGenetics;
}

const TARGET_PURPLE_COUNT = 3;

export default function Home() {
  // Start with one RR cabbage and one rr cabbage
  const [cabbages, setCabbages] = useState<CabbageData[]>([
    { id: "c1", genetics: { allele1: false, allele2: false } }, // RR
    { id: "c2", genetics: { allele1: true, allele2: true } }, // rr
  ]);

  const [selectedCabbageIds, setSelectedCabbageIds] = useState<string[]>([]);

  // Count purple cabbages
  const purpleCount = useMemo(() => countPurpleCabbages(cabbages), [cabbages]);

  const hasWon = purpleCount >= TARGET_PURPLE_COUNT;

  const handleBreed = () => {
    if (selectedCabbageIds.length !== 2) return;

    const parent1 = cabbages.find((c) => c.id === selectedCabbageIds[0]);
    const parent2 = cabbages.find((c) => c.id === selectedCabbageIds[1]);

    if (!parent1 || !parent2) return;

    const childGenetics = breed(parent1.genetics, parent2.genetics);
    const newCabbage: CabbageData = {
      id: `c${Date.now()}`,
      genetics: childGenetics,
    };

    setCabbages((prev) => [...prev, newCabbage]);
    setSelectedCabbageIds([]);
  };

  const canBreed = selectedCabbageIds.length === 2;
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Plant Breeding
          </h1>

          {/* Breeding Game */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Cabbage Breeding Game
            </h2>
            <p className="text-gray-600 mb-6">
              Goal: Breed {TARGET_PURPLE_COUNT} purple cabbages (rr genotype).
              Select 2 cabbages and click Breed to create a new cabbage with
              randomly combined alleles from the parents.
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
                <div className="flex flex-col items-center">
                  <Cabbage
                    genetics={cabbage.genetics}
                    size={100}
                    isSelected={isSelected}
                    onSelect={onSelect}
                  />
                </div>
              )}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
