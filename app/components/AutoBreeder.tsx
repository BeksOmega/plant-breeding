"use client";

import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import Pot from "./Pot";
import Cabbage from "./Cabbage";
import { PlantGenetics, getGenotype, breed } from "../types/genetics";
import { CONFIG } from "../config";

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
  onSeedsSelect?: (selected: boolean) => void;
  isSeedsSelected?: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  associatedPlanterPotIds?: string[];
  onSeedGenerated?: () => void;
  showDebugGenotypes?: boolean;
}

export interface AutoBreederHandle {
  getSeed: () => PlantGenetics | null;
  hasSeeds: () => boolean;
  getSeedCount: () => number;
}

const AutoBreeder = forwardRef<AutoBreederHandle, AutoBreederProps>(
  function AutoBreeder(
    {
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
      onSeedsSelect,
      isSeedsSelected = false,
      isSelected = false,
      onSelect,
      associatedPlanterPotIds = [],
      onSeedGenerated,
      showDebugGenotypes = false,
    },
    ref
  ) {
    const [isHovered, setIsHovered] = useState(false);
    const [seeds, setSeeds] = useState<PlantGenetics[]>([]);
    const [breedingProgress, setBreedingProgress] = useState(0);
    const [lastBreedTime, setLastBreedTime] = useState<number | null>(null);
    const pot1IsEmpty = !pot1.plantId;
    const pot2IsEmpty = !pot2.plantId;

    const canBreed =
      pot1IsFullyGrown && pot2IsFullyGrown && pot1Plant && pot2Plant;

    // Auto-breeding logic: check every 10 seconds if both pots are fully grown
    useEffect(() => {
      if (!canBreed) {
        setBreedingProgress(0);
        setLastBreedTime(null);
        return;
      }

      // Start breeding timer if not already started
      if (lastBreedTime === null) {
        setLastBreedTime(Date.now());
      }

      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = lastBreedTime ? now - lastBreedTime : 0;
        const progress = Math.min(
          (elapsed / CONFIG.autoBreeder.breedingInterval) * 100,
          100
        );
        setBreedingProgress(progress);

        // Breed when the interval has passed
        if (elapsed >= CONFIG.autoBreeder.breedingInterval && lastBreedTime) {
          // Generate exactly 1 seed from breeding
          const newSeed = breed(pot1Plant!.genetics, pot2Plant!.genetics);
          setSeeds((prev) => [...prev, newSeed]);
          // Notify that a seed was generated
          onSeedGenerated?.();
          // Reset timer
          setLastBreedTime(Date.now());
          setBreedingProgress(0);
        }
      }, CONFIG.animation.breedingUpdateInterval);

      return () => clearInterval(interval);
    }, [
      canBreed,
      pot1IsFullyGrown,
      pot2IsFullyGrown,
      pot1Plant,
      pot2Plant,
      lastBreedTime,
    ]);

    const handleRemove = () => {
      if (onRemove) {
        onRemove(seeds);
      }
    };

    const handleSeedsClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (seeds.length > 0 && onSeedsSelect) {
        onSeedsSelect(!isSeedsSelected);
      }
    };

    // Expose method to get and consume a seed via ref
    useImperativeHandle(
      ref,
      () => ({
        getSeed: () => {
          if (seeds.length > 0) {
            const seedToPlant = seeds[0];
            setSeeds((prev) => prev.slice(1));
            return seedToPlant;
          }
          return null;
        },
        hasSeeds: () => seeds.length > 0,
        getSeedCount: () => seeds.length,
      }),
      [seeds.length]
    );

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

    const handleAutoBreederClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelect) {
        onSelect(!isSelected);
      }
    };

    return (
      <div
        className={`border-4 rounded-lg p-2 flex gap-4 items-center justify-center relative transition-all ${
          isSelected
            ? "border-red-600 bg-red-100 ring-4 ring-red-500 ring-offset-2"
            : "border-red-500 bg-red-50"
        } ${onSelect ? "cursor-pointer" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onSelect ? handleAutoBreederClick : undefined}
      >
        {/* Seed count display at the top */}
        {(seeds.length > 0 || canBreed) && (
          <button
            onClick={handleSeedsClick}
            disabled={seeds.length === 0}
            className={`absolute top-1 left-1 bg-white border-2 rounded px-2 py-1 text-xs font-semibold text-gray-700 z-10 flex items-center gap-1 transition-all ${
              isSeedsSelected
                ? "border-green-500 ring-2 ring-green-500 ring-offset-1"
                : "border-gray-400 hover:border-gray-600"
            } ${
              seeds.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {canBreed && (
              <div className="relative w-3 h-3">
                <svg
                  className="w-3 h-3 transform -rotate-90"
                  viewBox="0 0 12 12"
                >
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <circle
                    cx="6"
                    cy="6"
                    r="5"
                    fill="none"
                    stroke="#4b5563"
                    strokeWidth="2"
                    strokeDasharray={`${2 * Math.PI * 5}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 5 * (1 - breedingProgress / 100)
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            )}
            <span>
              {seeds.length} seed{seeds.length !== 1 ? "s" : ""}
            </span>
          </button>
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
        {associatedPlanterPotIds.length > 0 && (
          <div
            className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-bold rounded-full border-2 border-white flex items-center justify-center min-w-[20px] h-5 px-1"
            title={`Associated with ${
              associatedPlanterPotIds.length
            } auto planter${associatedPlanterPotIds.length !== 1 ? "s" : ""}`}
          >
            {associatedPlanterPotIds.length}
          </div>
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
);

export default AutoBreeder;
