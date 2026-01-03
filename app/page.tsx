"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import PotGrid, { PotData } from "./components/PotGrid";
import { Seed, PlantType } from "./types/seed";
import ControlPanel from "./components/ControlPanel";
import { breed } from "./types/genetics";
import Toast from "./components/toast/Toast";
import Text from "./components/typography/Text";
import { useToastOffset } from "./components/toast/ToastContainer";
import Shop from "./components/Shop";
import { POT_PRICE } from "./utils/prices";

export default function Home() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const balanceToastRef = useRef<HTMLDivElement>(null);
  const { registerOffset, unregisterOffset } = useToastOffset();

  // Register balance toast height with ToastContainer
  useEffect(() => {
    if (balanceToastRef.current) {
      const height = balanceToastRef.current.offsetHeight;
      registerOffset(height);

      // Update on resize (e.g., if balance text changes significantly)
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          registerOffset(entry.contentRect.height);
        }
      });

      resizeObserver.observe(balanceToastRef.current);

      return () => {
        resizeObserver.disconnect();
        unregisterOffset();
      };
    }
  }, [balance, registerOffset, unregisterOffset]);
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
    const plantsInSelection = selectedPots.filter(
      (pot) => !pot.isEmpty && pot.plant
    );

    // Check if we have exactly 2 plants and they're the same type
    const canBreed =
      plantsInSelection.length === 2 &&
      plantsInSelection[0].plant?.plantType ===
        plantsInSelection[1].plant?.plantType;

    return {
      disabledPlant: emptyPotsInSelection.length === 0 || seeds.length === 0,
      disabledBreed: !canBreed,
      disabledCull: plantsInSelection.length === 0,
    };
  }, [pots, selectedIds, seeds.length]);

  const handlePlant = () => {
    if (selectedIds.length === 0 || seeds.length === 0) return;

    const selectedEmptyPots = pots.filter(
      (pot) => selectedIds.includes(pot.id) && pot.isEmpty
    );

    const potsToPlant = selectedEmptyPots.slice(0, seeds.length);
    const seedsToUse = seeds.slice(0, potsToPlant.length);
    const startTime = Date.now();

    setPots((prevPots) =>
      prevPots.map((pot): PotData => {
        const seedIndex = potsToPlant.findIndex((p) => p.id === pot.id);
        if (seedIndex !== -1) {
          const seed = seedsToUse[seedIndex];
          return {
            ...pot,
            isEmpty: false,
            plant: {
              genetics: seed.genome,
              plantType: seed.plantType,
              startGrowingAt: startTime,
            },
            startGrowingAt: startTime,
          };
        }
        return pot;
      })
    );

    setSeeds((prevSeeds) => prevSeeds.slice(seedsToUse.length));
    setSelectedIds([]);
  };

  const handleBreed = () => {
    const selectedPots = pots.filter(
      (pot) => selectedIds.includes(pot.id) && !pot.isEmpty && pot.plant
    );
    if (selectedPots.length !== 2) return;
    const [parent1, parent2] = selectedPots;
    if (!parent1.plant || !parent2.plant) {
      return;
    }
    if (parent1.plant.plantType !== parent2.plant.plantType) {
      return;
    }

    const offspringGenetics = breed(
      parent1.plant.genetics,
      parent2.plant.genetics
    );

    const newSeed = new Seed(offspringGenetics, parent1.plant.plantType);
    setSeeds((prevSeeds) => [...prevSeeds, newSeed]);
    setSelectedIds([]);
  };

  const handleCull = () => {
    const selectedPotsWithPlants = pots.filter(
      (pot) => selectedIds.includes(pot.id) && !pot.isEmpty && pot.plant
    );

    if (selectedPotsWithPlants.length === 0) return;

    setPots((prevPots) =>
      prevPots.map((pot): PotData => {
        if (selectedIds.includes(pot.id) && !pot.isEmpty && pot.plant) {
          return {
            ...pot,
            isEmpty: true,
            plant: undefined,
          };
        }
        return pot;
      })
    );

    setSelectedIds([]);
  };

  const handleShop = () => {
    setIsShopOpen(true);
  };

  const handleBuyPot = () => {
    if (balance >= POT_PRICE) {
      const numericIds = pots
        .map((p) => p.id)
        .filter((id): id is number => typeof id === "number");
      const newPotId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      setPots((prevPots) => [...prevPots, { id: newPotId, isEmpty: true }]);
      setBalance((prevBalance) => prevBalance - POT_PRICE);
    }
  };

  return (
    <>
      <Toast
        disableAnimation
        className="fixed top-2 left-0 z-50"
        ref={balanceToastRef}
      >
        <Text className="font-bold">Balance: {balance}</Text>
      </Toast>
      {isShopOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-50 flex items-center justify-center p-4"
          onClick={() => setIsShopOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Shop balance={balance} onBuyPot={handleBuyPot} />
          </div>
        </div>
      )}
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
          onShop={handleShop}
          disabledPlant={buttonStates.disabledPlant}
          disabledBreed={buttonStates.disabledBreed}
          disabledCull={buttonStates.disabledCull}
          seedCount={seeds.length}
        />
      </main>
    </>
  );
}
