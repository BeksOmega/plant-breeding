"use client";

import { useState } from "react";
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

interface AutoPlanterProps {
  pot: PotData;
  potPlant?: CabbageData;
  potIsSelected: boolean;
  potCanSelect: boolean;
  potHasMutagenGlow: boolean;
  potIsFullyGrown: boolean;
  fullyGrownCabbageIds: Set<string>;
  onPotSelect: (selected: boolean) => void;
  onCabbageFullyGrown: (cabbageId: string) => void;
  onRemove?: () => void;
  showDebugGenotypes?: boolean;
}

const AutoPlanter = function AutoPlanter({
  pot,
  potPlant,
  potIsSelected,
  potCanSelect,
  potHasMutagenGlow,
  potIsFullyGrown,
  fullyGrownCabbageIds,
  onPotSelect,
  onCabbageFullyGrown,
  onRemove,
  showDebugGenotypes = false,
}: AutoPlanterProps) {
  const [isHovered, setIsHovered] = useState(false);
  const potIsEmpty = !pot.plantId;

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
      className="border-4 border-green-500 rounded-lg p-2 flex gap-4 items-center justify-center bg-green-50 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {onRemove && isHovered && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemove();
          }}
          className="absolute top-1 right-1 w-6 h-6 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors z-10"
          aria-label="Remove auto planter"
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

export default AutoPlanter;

