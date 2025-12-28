"use client";

import { useState, useMemo, useRef } from "react";
import PlantCollection from "./components/PlantCollection";
import Cabbage from "./components/Cabbage";
import SeedStack from "./components/SeedStack";
import Mutagen from "./components/Mutagen";
import AutoBreederItem from "./components/AutoBreederItem";
import AutoBreeder, { AutoBreederHandle } from "./components/AutoBreeder";
import Pot from "./components/Pot";
import Shop, { ShopItemData } from "./components/Shop";
import Catalog, { CatalogItemData } from "./components/Catalog";
import {
  PlantGenetics,
  breed,
  countPurpleCabbages,
  getPhenotypeColor,
  getGenotype,
  mutate,
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

interface MutagenStackData {
  id: string;
  count: number;
}

interface AutoBreederStackData {
  id: string;
  count: number;
}

interface PotData {
  id: string;
  plantId?: string; // ID of the plant growing in this pot, undefined if empty
}

const TARGET_MONEY = 100;

export default function Home() {
  // Debug mode state
  const [showDebugGenotypes, setShowDebugGenotypes] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

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
        { chromosome1: [false, false], chromosome2: [false, false] }, // RR, SS
        // For testing purposes, you can uncomment this to use the rr, ss genotype
        // { chromosome1: [true, true], chromosome2: [true, true] }, // rr, ss
        { chromosome1: [false, true], chromosome2: [true, true] }, // Rr, ss
      ],
    },
  ]);
  const [selectedSeedIds, setSelectedSeedIds] = useState<string[]>([]);

  // Mutagen stacks state
  const [mutagenStacks, setMutagenStacks] = useState<MutagenStackData[]>([]);
  const [selectedMutagenIds, setSelectedMutagenIds] = useState<string[]>([]);

  // Auto breeder stacks state
  const [autoBreederStacks, setAutoBreederStacks] = useState<
    AutoBreederStackData[]
  >([]);
  const [selectedAutoBreederIds, setSelectedAutoBreederIds] = useState<
    string[]
  >([]);

  // Pots with mutagen glow (Set of pot IDs)
  const [potsWithMutagenGlow, setPotsWithMutagenGlow] = useState<Set<string>>(
    new Set()
  );

  // Pots with auto breeders applied (Set of pot pair keys, e.g., "p1-p2")
  const [potsWithAutoBreeder, setPotsWithAutoBreeder] = useState<Set<string>>(
    new Set()
  );

  // Selected auto breeder seed pairs (Set of pair keys)
  const [selectedAutoBreederSeedPairs, setSelectedAutoBreederSeedPairs] =
    useState<Set<string>>(new Set());

  // Refs to auto breeder components (Map of pair key -> ref)
  const autoBreederRefs = useRef<Map<string, AutoBreederHandle>>(new Map());

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

  const hasWon = money >= TARGET_MONEY;

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

    // Get pot IDs that had plants culled
    const potIdsToClearGlow = selectedPotIds.filter((potId) => {
      const pot = pots.find((p) => p.id === potId);
      return pot && pot.plantId;
    });

    // Remove plants from pots
    setPots((prev) =>
      prev.map((p) =>
        selectedPotIds.includes(p.id) && p.plantId
          ? { ...p, plantId: undefined }
          : p
      )
    );

    // Remove mutagen glow from pots that had plants culled
    setPotsWithMutagenGlow((prev) => {
      const updated = new Set(prev);
      potIdsToClearGlow.forEach((id) => updated.delete(id));
      return updated;
    });

    // Remove auto breeders from pots that had plants culled
    setPotsWithAutoBreeder((prev) => {
      const updated = new Set(prev);
      potIdsToClearGlow.forEach((potId) => {
        // Remove any pair that contains this pot ID
        Array.from(updated).forEach((pairKey) => {
          const [id1, id2] = pairKey.split("-");
          if (id1 === potId || id2 === potId) {
            updated.delete(pairKey);
          }
        });
      });
      return updated;
    });

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

  // Handle seed selection - clear pot selections when selecting a seed
  const handleSeedSelection = (seedIds: string[]) => {
    setSelectedSeedIds(seedIds);
    // Clear pot selections when selecting a seed
    if (seedIds.length > 0) {
      setSelectedPotIds([]);
      setSelectedMutagenIds([]);
      setSelectedAutoBreederIds([]);
      setSelectedAutoBreederSeedPairs(new Set());
    }
  };

  // Handle mutagen selection - clear pot and seed selections when selecting a mutagen
  const handleMutagenSelection = (mutagenIds: string[]) => {
    setSelectedMutagenIds(mutagenIds);
    // Clear pot and seed selections when selecting a mutagen
    if (mutagenIds.length > 0) {
      setSelectedPotIds([]);
      setSelectedSeedIds([]);
      setSelectedAutoBreederIds([]);
      setSelectedAutoBreederSeedPairs(new Set());
    }
  };

  // Handle pot selection - automatically handles planting or breeding based on context
  const handlePotSelection = (potIds: string[]) => {
    setSelectedPotIds(potIds);

    // If an auto breeder is selected and two pots are selected, apply auto breeder
    if (potIds.length === 2 && selectedAutoBreederIds.length > 0) {
      const pot1Index = pots.findIndex((p) => p.id === potIds[0]);
      const pot2Index = pots.findIndex((p) => p.id === potIds[1]);

      // Allow any two selected pots (not just adjacent ones)
      if (pot1Index !== -1 && pot2Index !== -1) {
        const autoBreederId = selectedAutoBreederIds[0];
        const autoBreederStack = autoBreederStacks.find(
          (ab) => ab.id === autoBreederId
        );

        if (autoBreederStack && autoBreederStack.count > 0) {
          // Create a key for the pot pair (sorted to ensure consistency)
          const potPairKey = [potIds[0], potIds[1]].sort().join("-");

          // Reorder pots: move the two selected pots to the beginning
          setPots((prevPots) => {
            const newPots = [...prevPots];
            const pot1 = newPots[pot1Index];
            const pot2 = newPots[pot2Index];

            // Remove both pots from their current positions
            newPots.splice(Math.max(pot1Index, pot2Index), 1);
            newPots.splice(Math.min(pot1Index, pot2Index), 1);

            // Add them at the beginning
            return [pot1, pot2, ...newPots];
          });

          // Add auto breeder to the pot pair
          setPotsWithAutoBreeder((prev) => new Set(prev).add(potPairKey));

          // Check if there will be auto breeders remaining after consuming one
          const willHaveRemainingAutoBreeders = autoBreederStack.count > 1;

          // Consume one auto breeder
          setAutoBreederStacks((prev) => {
            const updated = prev.map((stack) =>
              stack.id === autoBreederId
                ? { ...stack, count: stack.count - 1 }
                : stack
            );
            // Remove stacks with 0 count
            return updated.filter((s) => s.count > 0);
          });

          // If auto breeders remain, keep the auto breeder selected; otherwise clear it
          if (!willHaveRemainingAutoBreeders) {
            setSelectedAutoBreederIds([]);
          }
          // Always deselect the pots after applying auto breeder
          setSelectedPotIds([]);
          return;
        }
      }
    }

    // If a mutagen is selected and an empty pot is selected, apply glow
    if (potIds.length > 0 && selectedMutagenIds.length > 0) {
      const potId = potIds[0];
      const mutagenId = selectedMutagenIds[0];

      const pot = pots.find((p) => p.id === potId);
      const mutagenStack = mutagenStacks.find((m) => m.id === mutagenId);

      // Can only apply mutagen to empty pots
      if (pot && !pot.plantId && mutagenStack && mutagenStack.count > 0) {
        // Check if there will be mutagens remaining after consuming one
        const willHaveRemainingMutagens = mutagenStack.count > 1;

        // Add glow to pot
        setPotsWithMutagenGlow((prev) => new Set(prev).add(potId));

        // Consume one mutagen
        setMutagenStacks((prev) => {
          const updated = prev.map((stack) =>
            stack.id === mutagenId
              ? { ...stack, count: stack.count - 1 }
              : stack
          );
          // Remove stacks with 0 count
          return updated.filter((s) => s.count > 0);
        });

        // If mutagens remain, keep the mutagen selected; otherwise clear it
        if (!willHaveRemainingMutagens) {
          setSelectedMutagenIds([]);
        }
        // Always deselect the pot after applying mutagen
        setSelectedPotIds([]);
        return;
      }
    }

    // If an auto breeder seed is selected and an empty pot is selected, plant immediately
    if (potIds.length > 0 && selectedAutoBreederSeedPairs.size > 0) {
      const potId = potIds[0];
      const pairKey = Array.from(selectedAutoBreederSeedPairs)[0];

      const pot = pots.find((p) => p.id === potId);

      // Can only plant in empty pots
      if (pot && !pot.plantId) {
        const autoBreederRef = autoBreederRefs.current.get(pairKey);
        if (autoBreederRef && autoBreederRef.hasSeeds()) {
          // Check if there will be seeds remaining after planting (check before consuming)
          const seedCount = autoBreederRef.getSeedCount();
          const willHaveRemainingSeeds = seedCount > 1;

          const seedGenetics = autoBreederRef.getSeed();
          if (seedGenetics) {
            // Use the genetics from the auto breeder seed
            let newGenetics = seedGenetics;

            // If pot has mutagen glow, mutate the genetics
            if (potsWithMutagenGlow.has(potId)) {
              newGenetics = mutate(newGenetics);
            }

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

            // If no seeds remain, clear selection; otherwise keep it selected
            if (!willHaveRemainingSeeds) {
              setSelectedAutoBreederSeedPairs((prev) => {
                const updated = new Set(prev);
                updated.delete(pairKey);
                return updated;
              });
            }
            // Always deselect the pot after planting
            setSelectedPotIds([]);
            return;
          }
        }
      }
    }

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

        // Check if there will be seeds remaining after planting
        const willHaveRemainingSeeds = seedStack.genetics.length > 1;

        // Use the first genetics from the seed stack
        let newGenetics = seedStack.genetics[0];

        // If pot has mutagen glow, mutate the genetics
        if (potsWithMutagenGlow.has(potId)) {
          newGenetics = mutate(newGenetics);
          // Glow persists until plant is sold/culled
        }

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

        // If seeds remain, keep the seed selected; otherwise clear it
        if (!willHaveRemainingSeeds) {
          setSelectedSeedIds([]);
        }
        // Always deselect the pot after planting
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
      color: "#8B4513",
      label: "Extra Pot",
      price: 10,
      description:
        "Adds a new pot to your collection. More pots allow you to grow more plants simultaneously.",
      onPurchase: () => {
        if (money < 10) return;
        setMoney((prev) => prev - 10);
        setPots((prev) => [...prev, { id: `p${Date.now()}` }]);
      },
      shape: "square",
    },
    {
      id: "mutagen",
      color: "#22c55e",
      label: "Mutagen",
      price: 1,
      description:
        "Apply to an empty pot before planting. Seeds planted in mutagen-treated pots will have their genetics randomly mutated, potentially creating new traits.",
      onPurchase: () => {
        if (money < 1) return;
        setMoney((prev) => prev - 1);
        setMutagenStacks((prev) => {
          if (prev.length === 0) {
            return [
              {
                id: `m${Date.now()}`,
                count: 1,
              },
            ];
          }
          // Add to the first mutagen stack
          return prev.map((stack, index) =>
            index === 0
              ? {
                  ...stack,
                  count: stack.count + 1,
                }
              : stack
          );
        });
      },
      shape: "circle",
    },
    {
      id: "auto-breeder",
      color: "#ef4444",
      label: "Auto breeder",
      price: 25,
      description:
        "An auto breeder that can be used to automate breeding. Stack them like seeds and mutagen.",
      onPurchase: () => {
        if (money < 25) return;
        setMoney((prev) => prev - 25);
        setAutoBreederStacks((prev) => {
          if (prev.length === 0) {
            return [
              {
                id: `ab${Date.now()}`,
                count: 1,
              },
            ];
          }
          // Add to the first auto breeder stack
          return prev.map((stack, index) =>
            index === 0
              ? {
                  ...stack,
                  count: stack.count + 1,
                }
              : stack
          );
        });
      },
      shape: "square",
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

  // Check if selected plant is purple (both chromosomes are true)
  const hasPurpleSelected = useMemo(() => {
    return selectedPlants.some(
      ({ plant }) =>
        plant.genetics.chromosome1[0] && plant.genetics.chromosome2[0]
    );
  }, [selectedPlants]);

  // Check if selected plant is green (at least one chromosome is false)
  const hasGreenSelected = useMemo(() => {
    return selectedPlants.some(
      ({ plant }) =>
        !plant.genetics.chromosome1[0] || !plant.genetics.chromosome2[0]
    );
  }, [selectedPlants]);

  // Handler to sell plants of a specific type
  const handleSellByType = (isPurple: boolean, price: number) => {
    if (selectedPlants.length === 0) return;

    // Filter plants by type
    const plantsToSell = selectedPlants.filter(({ plant }) => {
      const isPlantPurple =
        plant.genetics.chromosome1[0] && plant.genetics.chromosome2[0];
      return isPlantPurple === isPurple;
    });

    if (plantsToSell.length === 0) return;

    // Calculate money earned using the price from catalogItems
    const totalEarned = plantsToSell.length * price;
    setMoney((prev) => prev + totalEarned);

    // Get all plant IDs to remove
    const plantIdsToRemove = plantsToSell
      .map(({ pot }) => pot.plantId!)
      .filter(Boolean);

    // Get pot IDs that had plants removed
    const potIdsToClearGlow = pots
      .filter((p) => plantIdsToRemove.includes(p.plantId || ""))
      .map((p) => p.id);

    // Remove plants from pots
    setPots((prev) =>
      prev.map((p) =>
        plantIdsToRemove.includes(p.plantId || "")
          ? { ...p, plantId: undefined }
          : p
      )
    );

    // Remove mutagen glow from pots that had plants sold
    setPotsWithMutagenGlow((prev) => {
      const updated = new Set(prev);
      potIdsToClearGlow.forEach((id) => updated.delete(id));
      return updated;
    });

    // Remove auto breeders from pots that had plants sold
    setPotsWithAutoBreeder((prev) => {
      const updated = new Set(prev);
      potIdsToClearGlow.forEach((potId) => {
        // Remove any pair that contains this pot ID
        Array.from(updated).forEach((pairKey) => {
          const [id1, id2] = pairKey.split("-");
          if (id1 === potId || id2 === potId) {
            updated.delete(pairKey);
          }
        });
      });
      return updated;
    });

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

  // Handler to remove an auto breeder from a pot pair and return seeds to resources
  const handleRemoveAutoBreeder = (
    pot1Id: string,
    pot2Id: string,
    seeds: PlantGenetics[]
  ) => {
    // Create the pair key (sorted to match how it's stored)
    const pairKey = [pot1Id, pot2Id].sort().join("-");

    // Add seeds from the auto breeder to general resources
    if (seeds.length > 0) {
      setSeedStacks((prev) => {
        if (prev.length === 0) {
          return [
            {
              id: `s${Date.now()}`,
              genetics: seeds,
            },
          ];
        }
        // Add to the first seed stack
        return prev.map((stack, index) =>
          index === 0
            ? {
                ...stack,
                genetics: [...stack.genetics, ...seeds],
              }
            : stack
        );
      });
    }

    // Remove from potsWithAutoBreeder
    setPotsWithAutoBreeder((prev) => {
      const updated = new Set(prev);
      updated.delete(pairKey);
      return updated;
    });

    // Add back to auto breeder stack
    setAutoBreederStacks((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: `ab${Date.now()}`,
            count: 1,
          },
        ];
      }
      // Add to the first auto breeder stack
      return prev.map((stack, index) =>
        index === 0
          ? {
              ...stack,
              count: stack.count + 1,
            }
          : stack
      );
    });
  };

  // Catalog items data - each item handles its own sell logic
  const catalogItems: CatalogItemData[] = [
    {
      id: "green-cabbage",
      color: "#4ade80", // Green color
      label: "Green Cabbage",
      price: 2,
      canSell: hasGreenSelected,
      onSell: () => handleSellByType(false, 2),
    },
    {
      id: "purple-cabbage",
      color: "#a78bfa", // Purple color
      label: "Purple Cabbage",
      price: 10,
      canSell: hasPurpleSelected,
      onSell: () => handleSellByType(true, 10),
    },
  ];

  const canPlant =
    selectedSeedIds.length > 0 &&
    selectedPotIds.length > 0 &&
    selectedPotIds.some((potId) => {
      const pot = pots.find((p) => p.id === potId);
      return pot && !pot.plantId;
    });

  // Check which pot pairs have auto breeders applied (for rendering)
  const potPairsWithAutoBreeder = useMemo(() => {
    const pairs: Array<[number, number]> = [];
    potsWithAutoBreeder.forEach((pairKey) => {
      const [potId1, potId2] = pairKey.split("-");
      const pot1Index = pots.findIndex((p) => p.id === potId1);
      const pot2Index = pots.findIndex((p) => p.id === potId2);
      if (pot1Index !== -1 && pot2Index !== -1) {
        // Return indices in order (lower index first)
        const sortedIndices =
          pot1Index < pot2Index
            ? [pot1Index, pot2Index]
            : [pot2Index, pot1Index];
        pairs.push([sortedIndices[0], sortedIndices[1]]);
      }
    });
    return pairs;
  }, [potsWithAutoBreeder, pots]);

  // Set of pot IDs that are already in an auto breeder pair
  const potIdsInAutoBreederPairs = useMemo(() => {
    const ids = new Set<string>();
    potsWithAutoBreeder.forEach((pairKey) => {
      const [potId1, potId2] = pairKey.split("-");
      ids.add(potId1);
      ids.add(potId2);
    });
    return ids;
  }, [potsWithAutoBreeder]);
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Plant Breeding
          </h1>

          {/* Debug Foldout */}
          <div className="mb-6 flex justify-center">
            <div className="w-full max-w-md">
              <button
                onClick={() => setIsDebugOpen(!isDebugOpen)}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium text-gray-700 transition-colors flex items-center justify-between"
              >
                <span>Debug Options</span>
                <span className="text-lg">{isDebugOpen ? "−" : "+"}</span>
              </button>
              {isDebugOpen && (
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="debug-checkbox"
                      checked={showDebugGenotypes}
                      onChange={(e) => setShowDebugGenotypes(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label
                      htmlFor="debug-checkbox"
                      className="text-sm font-medium text-gray-700 cursor-pointer"
                    >
                      Show Genotypes
                    </label>
                  </div>
                  <button
                    onClick={() => setMoney((prev) => prev + 100)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Give $100
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Breeding Game */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <p className="text-gray-600 mb-6">Goal: Earn ${TARGET_MONEY}.</p>
            <p className="text-gray-600 mb-6">
              Plant seeds in pots, wait for them to grow, then select 2 fully
              grown plants in pots and click Breed to get 1 seed.
            </p>
            <p className="text-gray-600 mb-6">
              Make faster growing and more valuable plants by breeding and
              mutating them.
            </p>

            {hasWon && (
              <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                <p className="text-2xl font-bold text-green-800">
                  🎉 Congratulations! You've earned ${money}!
                </p>
              </div>
            )}

            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-700">
                Money: ${money} / ${TARGET_MONEY}
              </p>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Resources</h2>
            <p className="text-gray-600 mb-6">
              Select a seed, mutagen, or auto breeder
            </p>

            <div className="flex flex-row gap-8 justify-center flex-wrap">
              {/* Seeds */}
              <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-row gap-4 flex-wrap justify-center">
                  {seedStacks.map((seedStack) => {
                    const isSelected = selectedSeedIds.includes(seedStack.id);
                    return (
                      <div
                        key={seedStack.id}
                        className="flex flex-col items-center"
                      >
                        <SeedStack
                          genetics={seedStack.genetics}
                          size={100}
                          isSelected={isSelected}
                          onSelect={(selected) => {
                            if (selected) {
                              handleSeedSelection([seedStack.id]);
                            } else {
                              handleSeedSelection([]);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-600">Cabbages</p>
              </div>

              {/* Mutagens */}
              <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-row gap-4 flex-wrap justify-center">
                  {mutagenStacks.map((mutagenStack) => {
                    const isSelected = selectedMutagenIds.includes(
                      mutagenStack.id
                    );
                    return (
                      <div
                        key={mutagenStack.id}
                        className="flex flex-col items-center"
                      >
                        <Mutagen
                          count={mutagenStack.count}
                          size={100}
                          isSelected={isSelected}
                          onSelect={(selected) => {
                            if (selected) {
                              handleMutagenSelection([mutagenStack.id]);
                            } else {
                              handleMutagenSelection([]);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-600">Mutagens</p>
              </div>

              {/* Auto Breeders */}
              <div className="flex flex-col gap-4 items-center">
                <div className="flex flex-row gap-4 flex-wrap justify-center">
                  {autoBreederStacks.map((autoBreederStack) => {
                    const isSelected = selectedAutoBreederIds.includes(
                      autoBreederStack.id
                    );
                    return (
                      <div
                        key={autoBreederStack.id}
                        className="flex flex-col items-center"
                      >
                        <AutoBreederItem
                          count={autoBreederStack.count}
                          size={100}
                          isSelected={isSelected}
                          onSelect={(selected: boolean) => {
                            if (selected) {
                              setSelectedAutoBreederIds([autoBreederStack.id]);
                              // Clear other selections when selecting auto breeder
                              setSelectedPotIds([]);
                              setSelectedSeedIds([]);
                              setSelectedMutagenIds([]);
                            } else {
                              setSelectedAutoBreederIds([]);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-600">Auto Breeders</p>
              </div>
            </div>
          </div>

          {/* Pots Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pots</h2>
            <p className="text-gray-600 mb-6">
              {selectedAutoBreederIds.length > 0
                ? "Select 2 adjacent pots to wrap them in an auto breeder."
                : selectedSeedIds.length > 0
                ? "Select an empty pot to plant your seeds."
                : selectedPotIds.length === 2
                ? "Select 2 fully grown plants to breed them."
                : "Select seeds and an empty pot to plant, select 2 fully grown plants to breed."}
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
            </div>

            {potPairsWithAutoBreeder.length > 0 ? (
              // Render pots with auto breeder wrappers for applied auto breeders
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {pots
                  .map((pot, index) => {
                    // Skip if this is the second pot of a pair (already rendered in wrapper)
                    const isSecondPotOfPair = potPairsWithAutoBreeder.some(
                      ([idx1, idx2]) => index === idx2
                    );

                    if (isSecondPotOfPair) {
                      return null;
                    }

                    const isEmpty = !pot.plantId;
                    const plant = pot.plantId
                      ? cabbages.find((c) => c.id === pot.plantId)
                      : null;
                    const isFullyGrown = plant
                      ? fullyGrownCabbageIds.has(plant.id)
                      : false;
                    // If auto breeder is selected, can't select pots that are already in a pair
                    const isInAutoBreederPair = potIdsInAutoBreederPairs.has(
                      pot.id
                    );
                    const canSelect =
                      selectedSeedIds.length > 0 ||
                      selectedMutagenIds.length > 0
                        ? isEmpty
                        : selectedAutoBreederIds.length > 0
                        ? (isEmpty || !!plant) && !isInAutoBreederPair
                        : isEmpty || !!plant;
                    const hasGlow = potsWithMutagenGlow.has(pot.id);
                    const isSelected = selectedPotIds.includes(pot.id);

                    const handleSelect = (selected: boolean) => {
                      if (selected) {
                        handlePotSelection([...selectedPotIds, pot.id]);
                      } else {
                        handlePotSelection(
                          selectedPotIds.filter((id) => id !== pot.id)
                        );
                      }
                    };

                    const renderPot = () => (
                      <div className="flex flex-col items-center">
                        <Pot
                          size={100}
                          isSelected={isSelected}
                          onSelect={canSelect ? handleSelect : undefined}
                          isEmpty={isEmpty}
                          canSelect={canSelect}
                          hasMutagenGlow={hasGlow}
                        >
                          {plant && (
                            <Cabbage
                              genetics={plant.genetics}
                              size={80}
                              isSelected={false}
                              startGrowingAt={plant.startGrowingAt}
                              onFullyGrown={() =>
                                handleCabbageFullyGrown(plant.id)
                              }
                              showGenotype={false}
                            />
                          )}
                        </Pot>
                        {showDebugGenotypes && plant && (
                          <div className="mt-2 text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {getGenotype(plant.genetics)}
                          </div>
                        )}
                      </div>
                    );

                    // If this is the first pot of an auto breeder pair, wrap both pots
                    const autoBreederPair = potPairsWithAutoBreeder.find(
                      ([idx1, idx2]) => index === idx1
                    );

                    if (autoBreederPair) {
                      const [, pot2Index] = autoBreederPair;
                      const pot2 = pots[pot2Index];
                      const isEmpty2 = !pot2.plantId;
                      const plant2 = pot2.plantId
                        ? cabbages.find((c) => c.id === pot2.plantId)
                        : null;
                      const isFullyGrown2 = plant2
                        ? fullyGrownCabbageIds.has(plant2.id)
                        : false;
                      const isInAutoBreederPair2 = potIdsInAutoBreederPairs.has(
                        pot2.id
                      );
                      const canSelect2 =
                        selectedSeedIds.length > 0 ||
                        selectedMutagenIds.length > 0
                          ? isEmpty2
                          : selectedAutoBreederIds.length > 0
                          ? (isEmpty2 || !!plant2) && !isInAutoBreederPair2
                          : isEmpty2 || !!plant2;
                      const hasGlow2 = potsWithMutagenGlow.has(pot2.id);
                      const isSelected2 = selectedPotIds.includes(pot2.id);

                      const handleSelect2 = (selected: boolean) => {
                        if (selected) {
                          handlePotSelection([...selectedPotIds, pot2.id]);
                        } else {
                          handlePotSelection(
                            selectedPotIds.filter((id) => id !== pot2.id)
                          );
                        }
                      };

                      // Get the pair key
                      const pairKey = [pot.id, pot2.id].sort().join("-");
                      const isSeedsSelected =
                        selectedAutoBreederSeedPairs.has(pairKey);

                      const handleSeedsSelect = (selected: boolean) => {
                        setSelectedAutoBreederSeedPairs((prev) => {
                          const updated = new Set(prev);
                          if (selected) {
                            updated.add(pairKey);
                            // Clear other selections
                            setSelectedPotIds([]);
                            setSelectedSeedIds([]);
                            setSelectedMutagenIds([]);
                            setSelectedAutoBreederIds([]);
                          } else {
                            updated.delete(pairKey);
                          }
                          return updated;
                        });
                      };

                      return (
                        <div key={pot.id} className="col-span-2">
                          <AutoBreeder
                            ref={(ref) => {
                              if (ref) {
                                autoBreederRefs.current.set(pairKey, ref);
                              } else {
                                autoBreederRefs.current.delete(pairKey);
                              }
                            }}
                            pot1={pot}
                            pot2={pot2}
                            pot1Plant={plant || undefined}
                            pot2Plant={plant2 || undefined}
                            pot1IsSelected={isSelected}
                            pot2IsSelected={isSelected2}
                            pot1CanSelect={canSelect}
                            pot2CanSelect={canSelect2}
                            pot1HasMutagenGlow={hasGlow}
                            pot2HasMutagenGlow={hasGlow2}
                            pot1IsFullyGrown={isFullyGrown}
                            pot2IsFullyGrown={isFullyGrown2}
                            fullyGrownCabbageIds={fullyGrownCabbageIds}
                            onPot1Select={handleSelect}
                            onPot2Select={handleSelect2}
                            onCabbageFullyGrown={handleCabbageFullyGrown}
                            onRemove={(seeds) =>
                              handleRemoveAutoBreeder(pot.id, pot2.id, seeds)
                            }
                            onSeedsSelect={handleSeedsSelect}
                            isSeedsSelected={isSeedsSelected}
                            showDebugGenotypes={showDebugGenotypes}
                          />
                        </div>
                      );
                    }

                    // Render normal pot
                    return <div key={pot.id}>{renderPot()}</div>;
                  })
                  .filter((item) => item !== null)}
              </div>
            ) : (
              <PlantCollection
                items={pots}
                selectedIds={selectedPotIds}
                onSelectionChange={handlePotSelection}
                draggable={false}
                onReorder={(reorderedPots) => setPots(reorderedPots)}
                renderItem={(pot, isSelected, onSelect) => {
                  const isEmpty = !pot.plantId;
                  const plant = pot.plantId
                    ? cabbages.find((c) => c.id === pot.plantId)
                    : null;
                  const isFullyGrown = plant
                    ? fullyGrownCabbageIds.has(plant.id)
                    : false;
                  // If seeds are selected, only empty pots can be selected (for planting)
                  // If mutagens are selected, only empty pots can be selected (for applying glow)
                  // If auto breeder is selected, allow selecting pots (but not ones already in a pair)
                  // Otherwise, any pot can be selected (for breeding or culling)
                  const isInAutoBreederPair = potIdsInAutoBreederPairs.has(
                    pot.id
                  );
                  const canSelect =
                    selectedSeedIds.length > 0 || selectedMutagenIds.length > 0
                      ? isEmpty
                      : selectedAutoBreederIds.length > 0
                      ? (isEmpty || !!plant) && !isInAutoBreederPair
                      : isEmpty || !!plant;

                  const hasGlow = potsWithMutagenGlow.has(pot.id);

                  return (
                    <div className="flex flex-col items-center">
                      <Pot
                        size={100}
                        isSelected={isSelected}
                        onSelect={canSelect ? onSelect : undefined}
                        isEmpty={isEmpty}
                        canSelect={canSelect}
                        hasMutagenGlow={hasGlow}
                      >
                        {plant && (
                          <Cabbage
                            genetics={plant.genetics}
                            size={80}
                            isSelected={false}
                            startGrowingAt={plant.startGrowingAt}
                            onFullyGrown={() =>
                              handleCabbageFullyGrown(plant.id)
                            }
                            showGenotype={false}
                          />
                        )}
                      </Pot>
                      {showDebugGenotypes && plant && (
                        <div className="mt-2 text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {getGenotype(plant.genetics)}
                        </div>
                      )}
                    </div>
                  );
                }}
              />
            )}
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
