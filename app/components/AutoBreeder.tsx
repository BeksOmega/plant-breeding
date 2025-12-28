"use client";

import { useState, useEffect } from "react";
import Pot from "./Pot";
import Cabbage from "./Cabbage";
import { PlantGenetics, getGenotype, breed } from "../types/genetics";

interface PotData {
  id: string;
  plantId?: string;
}

interface CabbageData {
  id: string;
  genetics: PlantGenetics;
  startGrowingAt?: number;
}

interface AutoBreederProps {
  pot1: PotData;
  pot2: PotData;
  pot1Plant?: CabbageData;
  pot2Plant?: CabbageData;
  pot1IsSelected: boolean;
  pot2IsSelected: boolean;
  pot1CanSelect: boolean;
  pot2CanSelect: boolean;
  pot1HasMutagenGlow: boolean;
  pot2HasMutagenGlow: boolean;
  pot1IsFullyGrown: boolean;
  pot2IsFullyGrown: boolean;
  fullyGrownCabbageIds: Set<string>;
  onPot1Select: (selected: boolean) => void;
  onPot2Select: (selected: boolean) => void;
  onCabbageFullyGrown: (cabbageId: string) => void;
  onRemove?: (seeds: PlantGenetics[]) => void;
  showDebugGenotypes?: boolean;
}

export default function AutoBreeder({
  pot1,
  pot2,
  pot1Plant,
  pot2Plant,
  pot1IsSelected,
  pot2IsSelected,
  pot1CanSelect,
  pot2CanSelect,
  pot1HasMutagenGlow,
  pot2HasMutagenGlow,
  pot1IsFullyGrown,
  pot2IsFullyGrown,
  fullyGrownCabbageIds,
  onPot1Select,
  onPot2Select,
  onCabbageFullyGrown,
  onRemove,
  showDebugGenotypes = false,
}: AutoBreederProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [seeds, setSeeds] = useState<PlantGenetics[]>([]);
  const pot1IsEmpty = !pot1.plantId;
  const pot2IsEmpty = !pot2.plantId;

  // Auto-breeding logic: check every 10 seconds if both pots are fully grown
  useEffect(() => {
    const interval = setInterval(() => {
      // Both plants must be fully grown to breed
      if (pot1IsFullyGrown && pot2IsFullyGrown && pot1Plant && pot2Plant) {
        // Generate exactly 1 seed from breeding
        const newSeed = breed(pot1Plant.genetics, pot2Plant.genetics);
        setSeeds((prev) => [...prev, newSeed]);
      }
    }, 10000); // Every 10 seconds

    return () => clearInterval(interval);
  }, [pot1IsFullyGrown, pot2IsFullyGrown, pot1Plant, pot2Plant]);

  const handleRemove = () => {
    if (onRemove) {
      onRemove(seeds);
    }
  };

  const renderPot = (
    pot: PotData,
    plant: CabbageData | undefined,
    isEmpty: boolean,
    isSelected: boolean,
    canSelect: boolean,
    hasMutagenGlow: boolean,
    onSelect: (selected: boolean) => void,
    showGenotype: boolean
  ) => (
    <div className="flex flex-col items-center">
      <Pot
        size={100}
        isSelected={isSelected}
        onSelect={canSelect ? onSelect : undefined}
        isEmpty={isEmpty}
        canSelect={canSelect}
        hasMutagenGlow={hasMutagenGlow}
      >
        {plant && (
          <Cabbage
            genetics={plant.genetics}
            size={80}
            isSelected={false}
            startGrowingAt={plant.startGrowingAt}
            onFullyGrown={() => onCabbageFullyGrown(plant.id)}
            showGenotype={false}
          />
        )}
      </Pot>
      {showGenotype && plant && (
        <div className="mt-2 text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
          {getGenotype(plant.genetics)}
        </div>
      )}
    </div>
  );

  return (
    <div
      className="border-4 border-red-500 rounded-lg p-2 flex gap-4 items-center justify-center bg-red-50 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Seed count display at the top */}
      {seeds.length > 0 && (
        <div className="absolute top-1 left-1 bg-white border-2 border-gray-400 rounded px-2 py-1 text-xs font-semibold text-gray-700 z-10">
          {seeds.length} seed{seeds.length !== 1 ? "s" : ""}
        </div>
      )}
      {onRemove && isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="absolute top-1 right-1 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10"
          aria-label="Remove auto breeder"
        >
          ×
        </button>
      )}
      {renderPot(
        pot1,
        pot1Plant,
        pot1IsEmpty,
        pot1IsSelected,
        pot1CanSelect,
        pot1HasMutagenGlow,
        onPot1Select,
        showDebugGenotypes
      )}
      {renderPot(
        pot2,
        pot2Plant,
        pot2IsEmpty,
        pot2IsSelected,
        pot2CanSelect,
        pot2HasMutagenGlow,
        onPot2Select,
        showDebugGenotypes
      )}
    </div>
  );
}
