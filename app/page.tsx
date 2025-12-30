"use client";

import { useState, useMemo } from "react";
import PlantCollection from "./components/PlantCollection";
import Flower from "./components/Flower";
import SeedStack from "./components/SeedStack";
import Pot from "./components/Pot";
import Trait from "./components/Trait";
import {
  PlantGenetics,
  breed,
  findPossibleRecessiveTraits,
  findPossibleDominantTraits,
  PossibleRecessiveTrait,
  PossibleDominantTrait,
} from "./types/genetics";

interface FlowerData {
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

interface TraitData {
  id: string;
  trait: PossibleRecessiveTrait | PossibleDominantTrait;
  isPossiblyRecessive: boolean; // true if from PossibleRecessiveTrait, false if from PossibleDominantTrait
}

// Goal: Find traits that give purple flower (AAA recessive) with black center (TAA dominant)

export default function Home() {
  // Start with no flowers - only seeds
  const [flowers, setFlowers] = useState<FlowerData[]>([]);

  const [fullyGrownFlowerIds, setFullyGrownFlowerIds] = useState<Set<string>>(
    new Set()
  );

  // Seed stacks state
  const [seedStacks, setSeedStacks] = useState<SeedStackData[]>([
    {
      id: "s1",
      genetics: [
        { chromosome1: [false, false], chromosome2: [false, false] }, // RR, BB
        { chromosome1: [true, true], chromosome2: [true, true] }, // rr, bb
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
  const [traitAnalysis, setTraitAnalysis] = useState<{
    recessive: PossibleRecessiveTrait[];
    dominant: PossibleDominantTrait[];
  } | null>(null);

  // Traits collection state
  const [traits, setTraits] = useState<TraitData[]>([]);
  const [selectedTraitIds, setSelectedTraitIds] = useState<string[]>([]);
  const [traitSubmissionResult, setTraitSubmissionResult] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);

  // Clear submission result when trait selection changes
  const handleTraitSelectionChange = (ids: string[]) => {
    setSelectedTraitIds(ids);
    if (traitSubmissionResult) {
      setTraitSubmissionResult(null);
    }
  };

  const handleBreed = () => {
    if (selectedPotIds.length !== 2) return;

    const pot1 = pots.find((p) => p.id === selectedPotIds[0]);
    const pot2 = pots.find((p) => p.id === selectedPotIds[1]);

    if (!pot1?.plantId || !pot2?.plantId) return;

    const parent1 = flowers.find((f) => f.id === pot1.plantId);
    const parent2 = flowers.find((f) => f.id === pot2.plantId);

    if (!parent1 || !parent2) return;

    // Both plants must be fully grown to breed
    if (
      !fullyGrownFlowerIds.has(parent1.id) ||
      !fullyGrownFlowerIds.has(parent2.id)
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

    // Remove plants from flowers list
    setFlowers((prev) => prev.filter((f) => !plantIdsToRemove.includes(f.id)));

    // Remove from fully grown set
    setFullyGrownFlowerIds((prev) => {
      const updated = new Set(prev);
      plantIdsToRemove.forEach((id) => updated.delete(id));
      return updated;
    });

    // Clear selection
    setSelectedPotIds([]);
  };

  const handleAnalyzeTraits = () => {
    if (selectedPotIds.length === 0) return;

    // Get all selected pots with plants
    const selectedPots = selectedPotIds
      .map((potId) => pots.find((p) => p.id === potId))
      .filter((pot) => pot && pot.plantId);

    if (selectedPots.length === 0) return;

    // Get all plants from selected pots
    const selectedPlants = selectedPots
      .map((pot) => flowers.find((f) => f.id === pot!.plantId!))
      .filter((plant): plant is FlowerData => plant !== undefined);

    if (selectedPlants.length === 0) return;

    // Extract genetics from plants
    const genetics = selectedPlants.map((plant) => plant.genetics);

    // Analyze traits
    const recessiveTraits = findPossibleRecessiveTraits(genetics);
    const dominantTraits = findPossibleDominantTraits(genetics);

    setTraitAnalysis({
      recessive: recessiveTraits,
      dominant: dominantTraits,
    });
  };

  const handleAddTraitsToCollection = () => {
    if (!traitAnalysis) return;

    const newTraits: TraitData[] = [];

    // Add recessive traits
    traitAnalysis.recessive.forEach((trait) => {
      const traitId = `trait-${trait.traitIndex}-${trait.value}-${trait.dnaSequence}-recessive`;
      // Check if trait already exists
      if (!traits.some((t) => t.id === traitId)) {
        newTraits.push({
          id: traitId,
          trait,
          isPossiblyRecessive: true,
        });
      }
    });

    // Add dominant traits
    traitAnalysis.dominant.forEach((trait) => {
      const traitId = `trait-${trait.traitIndex}-${trait.value}-${trait.dnaSequence}-dominant`;
      // Check if trait already exists
      if (!traits.some((t) => t.id === traitId)) {
        newTraits.push({
          id: traitId,
          trait,
          isPossiblyRecessive: false,
        });
      }
    });

    if (newTraits.length > 0) {
      setTraits((prev) => [...prev, ...newTraits]);
    }
  };

  // Check if we can breed a trait into a plant (need exactly 1 trait and 1 plant selected)
  const canBreedTrait = useMemo(() => {
    if (selectedTraitIds.length !== 1) return false;
    if (selectedPotIds.length !== 1) return false;

    const pot = pots.find((p) => p.id === selectedPotIds[0]);
    if (!pot?.plantId) return false;

    const plant = flowers.find((f) => f.id === pot.plantId);
    return !!plant;
  }, [selectedTraitIds, selectedPotIds, pots, flowers]);

  const handleBreedTrait = () => {
    if (!canBreedTrait) return;

    // Get the selected trait
    const selectedTrait = traits.find((t) => t.id === selectedTraitIds[0]);
    if (!selectedTrait) return;

    // Get the selected plant
    const pot = pots.find((p) => p.id === selectedPotIds[0]);
    if (!pot?.plantId) return;

    const plant = flowers.find((f) => f.id === pot.plantId);
    if (!plant) return;

    // Create a copy of the plant's genetics
    const modifiedGenetics: PlantGenetics = {
      chromosome1: [...plant.genetics.chromosome1],
      chromosome2: [...plant.genetics.chromosome2],
    };

    const { traitIndex, value } = selectedTrait.trait;

    // Ensure chromosomes are long enough
    while (modifiedGenetics.chromosome1.length <= traitIndex) {
      modifiedGenetics.chromosome1.push(false);
    }
    while (modifiedGenetics.chromosome2.length <= traitIndex) {
      modifiedGenetics.chromosome2.push(false);
    }

    // If trait is possibly dominant (isPossiblyRecessive === false), put it in either chromosome
    // If trait is possibly recessive (isPossiblyRecessive === true), put it in both chromosomes
    if (!selectedTrait.isPossiblyRecessive) {
      // Possibly dominant: randomly choose one chromosome
      const chromosomeToModify =
        Math.random() < 0.5
          ? modifiedGenetics.chromosome1
          : modifiedGenetics.chromosome2;
      chromosomeToModify[traitIndex] = value;
    } else {
      // Possibly recessive: put in both chromosomes
      modifiedGenetics.chromosome1[traitIndex] = value;
      modifiedGenetics.chromosome2[traitIndex] = value;
    }

    // Add the modified seed to the first seed stack (or create a new one if none exist)
    setSeedStacks((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: `s${Date.now()}`,
            genetics: [modifiedGenetics],
          },
        ];
      }
      // Add to the first seed stack
      return prev.map((stack, index) =>
        index === 0
          ? {
              ...stack,
              genetics: [...stack.genetics, modifiedGenetics],
            }
          : stack
      );
    });

    // Clear selections
    setSelectedTraitIds([]);
    setSelectedPotIds([]);
  };

  const handleSubmitTraits = () => {
    if (selectedTraitIds.length !== 2) return;

    const selectedTraits = selectedTraitIds
      .map((id) => traits.find((t) => t.id === id))
      .filter((t): t is TraitData => t !== undefined);

    if (selectedTraits.length !== 2) return;

    // Check if we have one trait with "AAA" (recessive, trait index 0) and one with "TAA" (dominant, trait index 1)
    // "AAA" should be recessive (isPossiblyRecessive === true)
    // "TAA" should be dominant (isPossiblyRecessive === false)
    const hasAAA = selectedTraits.some(
      (t) =>
        t.trait.dnaSequence === "AAA" &&
        t.trait.traitIndex === 0 &&
        t.isPossiblyRecessive === true
    );
    const hasTAA = selectedTraits.some(
      (t) =>
        t.trait.dnaSequence === "TAA" &&
        t.trait.traitIndex === 1 &&
        t.isPossiblyRecessive === false
    );

    if (hasAAA && hasTAA) {
      setTraitSubmissionResult({
        isCorrect: true,
        message:
          "🎉 Correct! You found the traits for a purple flower with a black center!",
      });
    } else {
      setTraitSubmissionResult({
        isCorrect: false,
        message:
          "❌ Incorrect. Make sure you have the right traits with the correct recessiveness / dominance.",
      });
    }
  };

  const handleFlowerFullyGrown = (flowerId: string) => {
    setFullyGrownFlowerIds((prev) => new Set(prev).add(flowerId));
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
        const newFlowerId = `f${now}`;
        const newFlower: FlowerData = {
          id: newFlowerId,
          genetics: newGenetics,
          startGrowingAt: now,
        };

        // Add the new plant
        setFlowers((prev) => [...prev, newFlower]);

        // Assign plant to pot
        setPots((prev) =>
          prev.map((p) => (p.id === potId ? { ...p, plantId: newFlowerId } : p))
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
      fullyGrownFlowerIds.has(pot1.plantId) &&
      fullyGrownFlowerIds.has(pot2.plantId)
    );
  }, [selectedPotIds, pots, fullyGrownFlowerIds]);

  // Check if we can cull (need at least 1 pot with a plant selected)
  const canCull = useMemo(() => {
    if (selectedPotIds.length === 0) return false;
    return selectedPotIds.some((potId) => {
      const pot = pots.find((p) => p.id === potId);
      return pot && pot.plantId;
    });
  }, [selectedPotIds, pots]);

  // Check if we can analyze traits (need at least 2 pots with plants selected)
  const canAnalyzeTraits = useMemo(() => {
    if (selectedPotIds.length < 2) return false;
    const selectedPotsWithPlants = selectedPotIds.filter((potId) => {
      const pot = pots.find((p) => p.id === potId);
      return pot && pot.plantId;
    });
    return selectedPotsWithPlants.length >= 2;
  }, [selectedPotIds, pots]);

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
              Goal: Find the traits that give you a purple flower with a black
              center.
            </p>
            <p className="text-gray-600 mb-6">
              Plant seeds in pots, wait for them to grow, then select 2 fully
              grown plants in pots and click Breed to get 1 seed.
            </p>
            <p className="text-gray-600 mb-6">
              Analyze plants to discover traits, then select 2 traits and submit
              to check if you found the correct combination for a purple flower
              with a black center. The traits selected must have the correct
              recessiveness / dominance.
            </p>
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
                  <p className="text-gray-600 mb-6">Flowers</p>
                </div>
              )}
            />
          </div>

          {/* Pots Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pots</h2>
            <p className="text-gray-600 mb-6">
              {selectedTraitIds.length === 1
                ? "Select a plant in a pot to breed the selected trait into it."
                : selectedSeedIds.length > 0
                ? "Select an empty pot to plant your seeds."
                : selectedPotIds.length === 2
                ? "Select 2 fully grown plants to breed them, or select plants to cull."
                : "Select seeds and an empty pot to plant, select 2 fully grown plants to breed, or select plants to cull."}
            </p>
            <div className="mb-6 flex gap-4 justify-center flex-wrap">
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
              <button
                onClick={handleAnalyzeTraits}
                disabled={!canAnalyzeTraits}
                className={`
                  px-6 py-3 rounded-lg font-semibold text-white transition-all
                  ${
                    canAnalyzeTraits
                      ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }
                `}
              >
                Analyze Traits
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
                  ? flowers.find((f) => f.id === pot.plantId)
                  : null;
                const isFullyGrown = plant
                  ? fullyGrownFlowerIds.has(plant.id)
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
                      <Flower
                        genetics={plant.genetics}
                        size={80}
                        isSelected={false}
                        startGrowingAt={plant.startGrowingAt}
                        onFullyGrown={() => handleFlowerFullyGrown(plant.id)}
                        showGenotype={false}
                      />
                    )}
                  </Pot>
                );
              }}
            />

            {/* Trait Analysis Results */}
            {traitAnalysis && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border-2 border-blue-300">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Trait Analysis Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recessive Traits */}
                  <div>
                    <h4 className="text-lg font-semibold text-purple-700 mb-3">
                      Possible Recessive Traits
                    </h4>
                    {traitAnalysis.recessive.length === 0 ? (
                      <p className="text-gray-600 italic">
                        No possible recessive traits found
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {traitAnalysis.recessive.map((trait, index) => (
                          <Trait
                            key={index}
                            trait={trait}
                            size={80}
                            isPossiblyRecessive={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dominant Traits */}
                  <div>
                    <h4 className="text-lg font-semibold text-blue-700 mb-3">
                      Possible Dominant Traits
                    </h4>
                    {traitAnalysis.dominant.length === 0 ? (
                      <p className="text-gray-600 italic">
                        No possible dominant traits found
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-4">
                        {traitAnalysis.dominant.map((trait, index) => (
                          <Trait
                            key={index}
                            trait={trait}
                            size={80}
                            isPossiblyRecessive={false}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {traitAnalysis.recessive.length === 0 &&
                  traitAnalysis.dominant.length === 0 && (
                    <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                      <p className="text-yellow-800 font-medium">
                        💡 Tip: No traits found. Try analyzing plants that have
                        features in common (e.g., same flower color or same
                        center color) to discover shared traits.
                      </p>
                    </div>
                  )}
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={handleAddTraitsToCollection}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
                  >
                    Add to Collection
                  </button>
                  <button
                    onClick={() => setTraitAnalysis(null)}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Traits Collection Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Traits</h2>
            <p className="text-gray-600 mb-6">
              {traits.length === 0
                ? "No traits collected yet. Analyze plants to discover traits."
                : selectedTraitIds.length === 2
                ? "Select 2 traits and click 'Submit traits' to check if you found the correct combination for a purple flower with a black center."
                : selectedTraitIds.length === 1 && selectedPotIds.length === 1
                ? "Select a plant in a pot to breed this trait into it."
                : selectedTraitIds.length === 1
                ? "Select exactly one trait and one plant to breed the trait into it, or select 2 traits to submit."
                : "Select exactly one trait and one plant to breed the trait into it, or select 2 traits to submit."}
            </p>
            {traits.length > 0 && (
              <>
                <PlantCollection
                  items={traits}
                  maxSelected={2}
                  selectedIds={selectedTraitIds}
                  onSelectionChange={handleTraitSelectionChange}
                  renderItem={(traitData, isSelected, onSelect) => (
                    <Trait
                      trait={traitData.trait}
                      size={80}
                      isSelected={isSelected}
                      onSelect={onSelect}
                      isPossiblyRecessive={traitData.isPossiblyRecessive}
                    />
                  )}
                />
                <div className="mt-6 flex flex-col items-center gap-4">
                  <button
                    onClick={handleSubmitTraits}
                    disabled={selectedTraitIds.length !== 2}
                    className={`
                      px-6 py-3 rounded-lg font-semibold text-white transition-all
                      ${
                        selectedTraitIds.length === 2
                          ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                          : "bg-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    Submit Traits
                  </button>
                  {traitSubmissionResult && (
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        traitSubmissionResult.isCorrect
                          ? "bg-green-100 border-green-500"
                          : "bg-red-100 border-red-500"
                      }`}
                    >
                      <p
                        className={`text-lg font-bold ${
                          traitSubmissionResult.isCorrect
                            ? "text-green-800"
                            : "text-red-800"
                        }`}
                      >
                        {traitSubmissionResult.message}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleBreedTrait}
                    disabled={!canBreedTrait}
                    className={`
                      px-6 py-3 rounded-lg font-semibold text-white transition-all
                      ${
                        canBreedTrait
                          ? "bg-purple-600 hover:bg-purple-700 cursor-pointer"
                          : "bg-gray-400 cursor-not-allowed"
                      }
                    `}
                  >
                    Get Modified Seed
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
