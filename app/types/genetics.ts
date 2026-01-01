// Plant genetics data structure
// Each plant has two chromosomes, each containing alleles for all traits
// true = recessive allele
// false = dominant allele

export interface PlantGenetics {
  chromosome1: boolean[]; // First chromosome
  chromosome2: boolean[]; // Second chromosome
}

// DNA sequence mapping for each trait
// Maps trait index -> allele value (true/false) -> 3-letter DNA sequence
type TraitSequences = {
  true: string;
  false: string;
};

export const DNA_SEQUENCES: Record<number, TraitSequences> = {};

// Sequence the genome of a plant
// Returns the DNA sequence for each chromosome by concatenating sequences for each trait
export function sequenceGenome(genetics: PlantGenetics): {
  chromosome1: string;
  chromosome2: string;
} {
  const sequenceChromosome = (chromosome: boolean[]): string => {
    return chromosome
      .map((allele, traitIndex) => {
        const sequences = DNA_SEQUENCES[traitIndex];
        if (!sequences) return "";
        return allele ? sequences.true : sequences.false;
      })
      .join("");
  };

  return {
    chromosome1: sequenceChromosome(genetics.chromosome1),
    chromosome2: sequenceChromosome(genetics.chromosome2),
  };
}

// Breed two plants by randomly selecting one chromosome from each parent
// This maintains trait linkage - all traits on the same chromosome are inherited together
export function breed(
  parent1: PlantGenetics,
  parent2: PlantGenetics
): PlantGenetics {
  // Randomly select one entire chromosome from parent1
  const chromosomeFromParent1 =
    Math.random() < 0.5 ? parent1.chromosome1 : parent1.chromosome2;

  // Randomly select one entire chromosome from parent2
  const chromosomeFromParent2 =
    Math.random() < 0.5 ? parent2.chromosome1 : parent2.chromosome2;

  // Create a copy of the chromosomes (to avoid reference issues)
  return {
    chromosome1: [...chromosomeFromParent1],
    chromosome2: [...chromosomeFromParent2],
  };
}

// Result type for finding possible recessive traits
export interface PossibleRecessiveTrait {
  traitIndex: number;
  value: boolean; // The value that all plants share at this trait index
  dnaSequence: string; // The DNA sequence associated with this value
}

// Result type for finding possible dominant traits
export interface PossibleDominantTrait {
  traitIndex: number;
  value: boolean; // The value that all plants share in at least one chromosome
  dnaSequence: string; // The DNA sequence associated with this value
}

// Find possible recessive traits by checking if all plants have the same value
// at each trait index across both chromosomes. Ignores the fact that we know
// recessive is encoded by "true" - it simply looks for uniformity.
export function findPossibleRecessiveTraits(
  plants: PlantGenetics[]
): PossibleRecessiveTrait[] {
  if (plants.length === 0 || plants.length === 1) {
    return [];
  }

  // Determine the maximum trait index by checking chromosome lengths
  const maxTraitIndex = Math.max(
    ...plants.map((plant) =>
      Math.max(plant.chromosome1.length, plant.chromosome2.length)
    )
  );

  const results: PossibleRecessiveTrait[] = [];

  // Check each trait index
  for (let traitIndex = 0; traitIndex < maxTraitIndex; traitIndex++) {
    const val = plants[0]?.chromosome1[traitIndex];
    if (val === undefined) {
      continue;
    }
    const allMatch = plants.every(
      (plant) =>
        plant.chromosome1[traitIndex] === val &&
        plant.chromosome2[traitIndex] === val
    );
    if (allMatch) {
      const sequences = DNA_SEQUENCES[traitIndex];
      results.push({
        traitIndex,
        value: val,
        dnaSequence: sequences ? (val ? sequences.true : sequences.false) : "",
      });
    }
  }

  return results;
}

// Find possible dominant traits by checking if all plants have the same value
// (either true or false) in at least one of their chromosomes at each trait index.
// Ignores the fact that we know dominant is encoded by "false" - it simply looks
// for uniformity in at least one chromosome.
export function findPossibleDominantTraits(
  plants: PlantGenetics[]
): PossibleDominantTrait[] {
  if (plants.length === 0 || plants.length === 1) {
    return [];
  }

  // Determine the maximum trait index by checking chromosome lengths
  const maxTraitIndex = Math.max(
    ...plants.map((plant) =>
      Math.max(plant.chromosome1.length, plant.chromosome2.length)
    )
  );

  const results: PossibleDominantTrait[] = [];

  // Check each trait index
  for (let traitIndex = 0; traitIndex < maxTraitIndex; traitIndex++) {
    // Check if first plant has a value in at least one chromosome
    const firstPlantChr1 = plants[0]?.chromosome1[traitIndex];
    const firstPlantChr2 = plants[0]?.chromosome2[traitIndex];

    // Skip if trait index doesn't exist in first plant
    if (firstPlantChr1 === undefined && firstPlantChr2 === undefined) {
      continue;
    }

    // Check both chromosomes of the first plant in parallel
    // Check if all plants have the value from chromosome1 in at least one chromosome
    if (firstPlantChr1 !== undefined) {
      const allHaveChr1Value = plants.every(
        (plant) =>
          plant.chromosome1[traitIndex] === firstPlantChr1 ||
          plant.chromosome2[traitIndex] === firstPlantChr1
      );

      if (allHaveChr1Value) {
        const sequences = DNA_SEQUENCES[traitIndex];
        results.push({
          traitIndex,
          value: firstPlantChr1,
          dnaSequence: sequences
            ? firstPlantChr1
              ? sequences.true
              : sequences.false
            : "",
        });
      }
    }

    // Check if all plants have the value from chromosome2 in at least one chromosome
    // Only add if it's different from chromosome1 value to avoid duplicates
    if (firstPlantChr2 !== undefined && firstPlantChr2 !== firstPlantChr1) {
      const allHaveChr2Value = plants.every(
        (plant) =>
          plant.chromosome1[traitIndex] === firstPlantChr2 ||
          plant.chromosome2[traitIndex] === firstPlantChr2
      );

      if (allHaveChr2Value) {
        const sequences = DNA_SEQUENCES[traitIndex];
        results.push({
          traitIndex,
          value: firstPlantChr2,
          dnaSequence: sequences
            ? firstPlantChr2
              ? sequences.true
              : sequences.false
            : "",
        });
      }
    }
  }

  return results;
}
