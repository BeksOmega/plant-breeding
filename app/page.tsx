"use client";

import { useState, useMemo } from "react";
import PlantCollection from "./components/PlantCollection";
import Cabbage from "./components/Cabbage";
import SeedStack from "./components/SeedStack";
import Pot from "./components/Pot";
import Shop, { ShopItemData } from "./components/Shop";
import Catalog, { CatalogItemData } from "./components/Catalog";
import {
  PlantGenetics,
  breed,
  countPurpleCabbages,
  getPhenotypeColor,
} from "./types/genetics";

interface CabbageData {
  id: string;
  genetics: PlantGenetics;
  startGrowingAt?: number; // Timestamp when growth started
}

interface SeedStackData {
  id: string;
  genetics: PlantGenetics[];
}

interface PotData {
  id: string;
  plantId?: string; // ID of the plant growing in this pot, undefined if empty
}

const TARGET_PURPLE_COUNT = 3;

export default function Home() {
  // Start with no cabbages - only seeds
  const [cabbages, setCabbages] = useState<CabbageData[]>([]);

  const [fullyGrownCabbageIds, setFullyGrownCabbageIds] = useState<Set<string>>(
    new Set()
  );

  // Seed stacks state
  const [seedStacks, setSeedStacks] = useState<SeedStackData[]>([
    {
      id: "s1",
      genetics: [
        { allele1: false, allele2: false }, // RR
        { allele1: true, allele2: true }, // rr
      ],
    },
  ]);
  const [selectedSeedIds, setSelectedSeedIds] = useState<string[]>([]);

  // Pots state - start with all empty pots
  const [pots, setPots] = useState<PotData[]>([
    { id: "p1" },
    { id: "p2" },
    { id: "p3" },
    { id: "p4" },
    { id: "p5" },
  ]);
  const [selectedPotIds, setSelectedPotIds] = useState<string[]>([]);

  // Money state - earned from selling cabbages
  const [money, setMoney] = useState<number>(0);

  // Count purple cabbages (only count fully grown ones in pots)
  const fullyGrownCabbagesInPots = useMemo(() => {
    return pots
      .filter((pot) => pot.plantId && fullyGrownCabbageIds.has(pot.plantId))
      .map((pot) => cabbages.find((c) => c.id === pot.plantId)!)
      .filter(Boolean);
  }, [pots, cabbages, fullyGrownCabbageIds]);

  const purpleCount = useMemo(
    () => countPurpleCabbages(fullyGrownCabbagesInPots),
    [fullyGrownCabbagesInPots]
  );

  const hasWon = purpleCount >= TARGET_PURPLE_COUNT;

  const handleBreed = () => {
    if (selectedPotIds.length !== 2) return;

    const pot1 = pots.find((p) => p.id === selectedPotIds[0]);
    const pot2 = pots.find((p) => p.id === selectedPotIds[1]);

    if (!pot1?.plantId || !pot2?.plantId) return;

    const parent1 = cabbages.find((c) => c.id === pot1.plantId);
    const parent2 = cabbages.find((c) => c.id === pot2.plantId);

    if (!parent1 || !parent2) return;

    // Both plants must be fully grown to breed
    if (
      !fullyGrownCabbageIds.has(parent1.id) ||
      !fullyGrownCabbageIds.has(parent2.id)
    ) {
      return;
    }

    // Generate exactly 1 seed from breeding
    const newSeed = breed(parent1.genetics, parent2.genetics);

    // Add seed to the first seed stack (or create a new one if none exist)
    setSeedStacks((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: `s${Date.now()}`,
            genetics: [newSeed],
          },
        ];
      }
      // Add to the first seed stack
      return prev.map((stack, index) =>
        index === 0
          ? {
              ...stack,
              genetics: [...stack.genetics, newSeed],
            }
          : stack
      );
    });

    // Plants remain in their pots after breeding

    // Clear selection
    setSelectedPotIds([]);
  };

  const handleCull = () => {
    if (selectedPotIds.length === 0) return;

    // Get all selected pots with plants
    const potsToCull = selectedPotIds
      .map((potId) => pots.find((p) => p.id === potId))
      .filter((pot) => pot && pot.plantId);

    if (potsToCull.length === 0) return;

    // Get all plant IDs to remove
    const plantIdsToRemove = potsToCull
      .map((pot) => pot!.plantId!)
      .filter(Boolean);

    // Remove plants from pots
    setPots((prev) =>
      prev.map((p) =>
        selectedPotIds.includes(p.id) && p.plantId
          ? { ...p, plantId: undefined }
          : p
      )
    );

    // Remove plants from cabbages list
    setCabbages((prev) => prev.filter((c) => !plantIdsToRemove.includes(c.id)));

    // Remove from fully grown set
    setFullyGrownCabbageIds((prev) => {
      const updated = new Set(prev);
      plantIdsToRemove.forEach((id) => updated.delete(id));
      return updated;
    });

    // Clear selection
    setSelectedPotIds([]);
  };

  const handleCabbageFullyGrown = (cabbageId: string) => {
    setFullyGrownCabbageIds((prev) => new Set(prev).add(cabbageId));
  };

  // Handle pot selection - automatically handles planting or breeding based on context
  const handlePotSelection = (potIds: string[]) => {
    setSelectedPotIds(potIds);

    // If a seed is selected and an empty pot is selected, plant immediately
    if (potIds.length > 0 && selectedSeedIds.length > 0) {
      const potId = potIds[0];
      const seedId = selectedSeedIds[0];

      const pot = pots.find((p) => p.id === potId);

      // Can only plant in empty pots
      if (pot && !pot.plantId) {
        const seedStack = seedStacks.find((s) => s.id === seedId);

        // Need a seed stack with at least one seed
        if (!seedStack || seedStack.genetics.length === 0) return;

        // Use the first genetics from the seed stack
        const newGenetics = seedStack.genetics[0];

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

        // Remove the first seed from the stack
        setSeedStacks((prev) => {
          const updated = prev.map((s) =>
            s.id === seedId ? { ...s, genetics: s.genetics.slice(1) } : s
          );
          // Remove seed stacks with 0 seeds
          return updated.filter((s) => s.genetics.length > 0);
        });

        // Clear selections
        setSelectedSeedIds([]);
        setSelectedPotIds([]);
      }
    }
  };

  // Check if we can breed (need 2 pots with fully grown plants selected)
  const canBreed = useMemo(() => {
    if (selectedPotIds.length !== 2) return false;
    const pot1 = pots.find((p) => p.id === selectedPotIds[0]);
    const pot2 = pots.find((p) => p.id === selectedPotIds[1]);
    if (!pot1?.plantId || !pot2?.plantId) return false;
    return (
      fullyGrownCabbageIds.has(pot1.plantId) &&
      fullyGrownCabbageIds.has(pot2.plantId)
    );
  }, [selectedPotIds, pots, fullyGrownCabbageIds]);

  // Check if we can cull (need at least 1 pot with a plant selected)
  const canCull = useMemo(() => {
    if (selectedPotIds.length === 0) return false;
    return selectedPotIds.some((potId) => {
      const pot = pots.find((p) => p.id === potId);
      return pot && pot.plantId;
    });
  }, [selectedPotIds, pots]);

  // Check if we can sell (need at least 1 pot with a fully grown plant selected)
  const canSell = useMemo(() => {
    if (selectedPotIds.length === 0) return false;
    return selectedPotIds.some((potId) => {
      const pot = pots.find((p) => p.id === potId);
      if (!pot?.plantId) return false;
      const plant = cabbages.find((c) => c.id === pot.plantId);
      return plant && fullyGrownCabbageIds.has(plant.id);
    });
  }, [selectedPotIds, pots, cabbages, fullyGrownCabbageIds]);

  // Shop items data - each item handles its own purchase logic
  const shopItems: ShopItemData[] = [
    {
      id: "item4",
      color: "#60a5fa",
      label: "Extra Pot",
      price: 10,
      onPurchase: () => {
        if (money < 10) return;
        setMoney((prev) => prev - 10);
        setPots((prev) => [...prev, { id: `p${Date.now()}` }]);
      },
    },
  ];

  // Get selected plant(s) for catalog
  const selectedPlants = useMemo(() => {
    return selectedPotIds
      .map((potId) => {
        const pot = pots.find((p) => p.id === potId);
        if (!pot?.plantId) return null;
        const plant = cabbages.find((c) => c.id === pot.plantId);
        if (!plant || !fullyGrownCabbageIds.has(plant.id)) return null;
        return { pot, plant };
      })
      .filter(Boolean) as Array<{ pot: PotData; plant: CabbageData }>;
  }, [selectedPotIds, pots, cabbages, fullyGrownCabbageIds]);

  // Check if selected plant is purple (both alleles are true)
  const hasPurpleSelected = useMemo(() => {
    return selectedPlants.some(
      ({ plant }) => plant.genetics.allele1 && plant.genetics.allele2
    );
  }, [selectedPlants]);

  // Check if selected plant is green (at least one allele is false)
  const hasGreenSelected = useMemo(() => {
    return selectedPlants.some(
      ({ plant }) => !plant.genetics.allele1 || !plant.genetics.allele2
    );
  }, [selectedPlants]);

  // Handler to sell plants of a specific type
  const handleSellByType = (isPurple: boolean) => {
    if (selectedPlants.length === 0) return;

    // Filter plants by type
    const plantsToSell = selectedPlants.filter(({ plant }) => {
      const isPlantPurple = plant.genetics.allele1 && plant.genetics.allele2;
      return isPlantPurple === isPurple;
    });

    if (plantsToSell.length === 0) return;

    // Calculate money earned
    const pricePerPlant = isPurple ? 10 : 5;
    const totalEarned = plantsToSell.length * pricePerPlant;
    setMoney((prev) => prev + totalEarned);

    // Get all plant IDs to remove
    const plantIdsToRemove = plantsToSell
      .map(({ pot }) => pot.plantId!)
      .filter(Boolean);

    // Remove plants from pots
    setPots((prev) =>
      prev.map((p) =>
        plantIdsToRemove.includes(p.plantId || "")
          ? { ...p, plantId: undefined }
          : p
      )
    );

    // Remove plants from cabbages list
    setCabbages((prev) => prev.filter((c) => !plantIdsToRemove.includes(c.id)));

    // Remove from fully grown set
    setFullyGrownCabbageIds((prev) => {
      const updated = new Set(prev);
      plantIdsToRemove.forEach((id) => updated.delete(id));
      return updated;
    });

    // Clear selection
    setSelectedPotIds([]);
  };

  // Catalog items data - each item handles its own sell logic
  const catalogItems: CatalogItemData[] = [
    {
      id: "green-cabbage",
      color: "#4ade80", // Green color
      label: "Green Cabbage",
      price: 2,
      canSell: hasGreenSelected,
      onSell: () => handleSellByType(false),
    },
    {
      id: "purple-cabbage",
      color: "#a78bfa", // Purple color
      label: "Purple Cabbage",
      price: 10,
      canSell: hasPurpleSelected,
      onSell: () => handleSellByType(true),
    },
  ];

  const canPlant =
    selectedSeedIds.length > 0 &&
    selectedPotIds.length > 0 &&
    selectedPotIds.some((potId) => {
      const pot = pots.find((p) => p.id === potId);
      return pot && !pot.plantId;
    });
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
              Plant seeds in pots, wait for them to grow, then select 2 fully
              grown plants in pots and click Breed to get 1 seed. Plants remain
              in their pots after breeding.
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
          </div>

          {/* Seed Stacks Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seeds</h2>
            <p className="text-gray-600 mb-6">Select a seed</p>
            <PlantCollection
              items={seedStacks}
              maxSelected={1}
              selectedIds={selectedSeedIds}
              onSelectionChange={setSelectedSeedIds}
              renderItem={(seedStack, isSelected, onSelect) => (
                <div className="flex flex-col items-center">
                  <SeedStack
                    genetics={seedStack.genetics}
                    size={100}
                    isSelected={isSelected}
                    onSelect={onSelect}
                  />
                  <p className="text-gray-600 mb-6">Cabbages</p>
                </div>
              )}
            />
          </div>

          {/* Pots Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pots</h2>
            <p className="text-gray-600 mb-6">
              {selectedSeedIds.length > 0
                ? "Select an empty pot to plant your seeds."
                : selectedPotIds.length === 2
                ? "Select 2 fully grown plants to breed them, or select plants to cull."
                : "Select seeds and an empty pot to plant, select 2 fully grown plants to breed, or select plants to cull."}
            </p>
            <div className="mb-6 flex gap-4 justify-center">
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
                Breed Selected Plants
              </button>
              <button
                onClick={handleCull}
                disabled={!canCull}
                className={`
                  px-6 py-3 rounded-lg font-semibold text-white transition-all
                  ${
                    canCull
                      ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Cull Selected Plant{selectedPotIds.length !== 1 ? "s" : ""}
              </button>
            </div>

            <PlantCollection
              items={pots}
              maxSelected={2}
              selectedIds={selectedPotIds}
              onSelectionChange={handlePotSelection}
              renderItem={(pot, isSelected, onSelect) => {
                const isEmpty = !pot.plantId;
                const plant = pot.plantId
                  ? cabbages.find((c) => c.id === pot.plantId)
                  : null;
                const isFullyGrown = plant
                  ? fullyGrownCabbageIds.has(plant.id)
                  : false;
                // Can select empty pots (for planting) or pots with any plants (for breeding or culling)
                const canSelect = isEmpty || !!plant;

                return (
                  <Pot
                    size={100}
                    isSelected={isSelected}
                    onSelect={canSelect ? onSelect : undefined}
                    isEmpty={isEmpty}
                    canSelect={canSelect}
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

          {/* Catalog Section */}
          <div className="mt-12 mb-12">
            <Catalog items={catalogItems} />
          </div>

          {/* Shop Section */}
          <div className="mt-12 mb-12">
            <Shop money={money} items={shopItems} />
          </div>
        </div>
      </div>
    </main>
  );
}
