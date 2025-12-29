"use client";

import { useState, useRef, useEffect } from "react";
import Pot from "./Pot";
import Cabbage from "./Cabbage";
import { PlantGenetics, getGenotype } from "../types/genetics";

interface PotData {
  id: string;
  plantId?: string;
}

interface CabbageData {
  id: string;
  genetics: PlantGenetics;
  startGrowingAt?: number;
}

interface AutoHarvesterProps {
  pot: PotData;
  potPlant?: CabbageData;
  potIsSelected: boolean;
  potCanSelect: boolean;
  potHasMutagenGlow: boolean;
  onPotSelect: (selected: boolean) => void;
  onCabbageFullyGrown: (cabbageId: string) => void;
  onRemove?: () => void;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  showDebugGenotypes?: boolean;
  // Harvesting callbacks
  onHarvest: (plant: CabbageData, potId: string) => void;
  countTotalItems: () => number;
}

const AutoHarvester = function AutoHarvester({
  pot,
  potPlant,
  potIsSelected,
  potCanSelect,
  potHasMutagenGlow,
  onPotSelect,
  onCabbageFullyGrown,
  onRemove,
  isSelected = false,
  onSelect,
  showDebugGenotypes = false,
  onHarvest,
  countTotalItems,
}: AutoHarvesterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const potIsEmpty = !pot.plantId;
  const harvestedPlantIdRef = useRef<string | null>(null);

  // Handle plant becoming fully grown - check if we should auto-harvest
  const handlePlantFullyGrown = () => {
    if (!potPlant) return;
    
    // Notify parent that plant is fully grown
    onCabbageFullyGrown(potPlant.id);
    
    // Check if we should auto-harvest (prevent duplicate harvests)
    if (harvestedPlantIdRef.current !== potPlant.id) {
      // Check if selling would leave us with 2 or fewer total items
      const currentTotal = countTotalItems();
      if (currentTotal - 1 >= 2) {
        harvestedPlantIdRef.current = potPlant.id;
        onHarvest(potPlant, pot.id);
      }
    }
  };

  // Reset ref when plant changes
  useEffect(() => {
    if (!potPlant) {
      harvestedPlantIdRef.current = null;
    } else if (harvestedPlantIdRef.current && harvestedPlantIdRef.current !== potPlant.id) {
      harvestedPlantIdRef.current = null;
    }
  }, [potPlant]);

  const handleAutoHarvesterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(!isSelected);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
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
            onFullyGrown={handlePlantFullyGrown}
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
      className={`border-4 rounded-lg p-2 flex gap-4 items-center justify-center relative transition-all ${
        isSelected
          ? "border-orange-600 bg-orange-100 ring-4 ring-orange-500 ring-offset-2"
          : "border-orange-500 bg-orange-50"
      } ${onSelect ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect ? handleAutoHarvesterClick : undefined}
    >
      {onRemove && isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="absolute top-1 right-1 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10"
          aria-label="Remove auto harvester"
        >
          ×
        </button>
      )}
      {renderPot(
        pot,
        potPlant,
        potIsEmpty,
        potIsSelected,
        potCanSelect,
        potHasMutagenGlow,
        onPotSelect,
        showDebugGenotypes
      )}
    </div>
  );
};

export default AutoHarvester;

