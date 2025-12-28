"use client";

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
  showDebugGenotypes = false,
}: AutoBreederProps) {
  const pot1IsEmpty = !pot1.plantId;
  const pot2IsEmpty = !pot2.plantId;

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
    <div className="border-4 border-red-500 rounded-lg p-2 flex gap-4 items-center justify-center bg-red-50">
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
