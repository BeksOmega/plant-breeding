// Plant genetics data structure
// Each plant has two chromosomes, each containing alleles for all traits
// true = recessive allele
// false = dominant allele
// Index 0 = petal color, Index 1 = inner color

export interface PlantGenetics {
  chromosome1: boolean[]; // First chromosome [petal color, inner color, ...]
  chromosome2: boolean[]; // Second chromosome [petal color, inner color, ...]
}

// DNA sequence mapping for each trait
// Maps trait index -> allele value (true/false) -> 3-letter DNA sequence
type TraitSequences = {
  true: string;
  false: string;
};

export const DNA_SEQUENCES: Record<number, TraitSequences> = {
  0: {
    // petal color
    true: "AAA", // recessive (purple)
    false: "TCT", // dominant (blue)
  },
  1: {
    // inner color
    true: "GGC", // recessive (brown)
    false: "TAA", // dominant (black)
  },
  2: {
    // petal shape
    true: "CGT", // recessive (pointy)
    false: "GCA", // dominant (round)
  },
};

// Sequence the genome of a flower
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

// Determine phenotype color based on genotype
// Purple (recessive) only shows if both alleles are true (homozygous recessive)
// Blue (dominant) shows if at least one allele is false (has dominant allele)
export function getPhenotypeColor(genetics: PlantGenetics): string {
  // If both are true (homozygous recessive), show purple
  if (genetics.chromosome1[0] && genetics.chromosome2[0]) {
    return "#a78bfa"; // Purple color
  }
  // Otherwise, show blue (dominant trait)
  return "#60a5fa"; // Blue color (skyblue)
}

// Determine inner color phenotype based on genotype
// Brown (recessive) only shows if both alleles are true (homozygous recessive)
// Black (dominant) shows if at least one allele is false (has dominant allele)
export function getInnerColor(genetics: PlantGenetics): string {
  // If both are true (homozygous recessive), show brown
  if (genetics.chromosome1[1] && genetics.chromosome2[1]) {
    return "#8b4513"; // Brown color
  }
  // Otherwise, show black (dominant trait)
  return "#000000"; // Black color
}

// Determine petal shape phenotype based on genotype
// Pointy (recessive) only shows if both alleles are true (homozygous recessive)
// Round (dominant) shows if at least one allele is false (has dominant allele)
export function hasPointyPetals(genetics: PlantGenetics): boolean {
  // If trait index 2 doesn't exist, default to round (dominant)
  if (
    genetics.chromosome1[2] === undefined ||
    genetics.chromosome2[2] === undefined
  ) {
    return false;
  }
  // If both are true (homozygous recessive), show pointy petals
  return genetics.chromosome1[2] === true && genetics.chromosome2[2] === true;
}

// Get genotype string representation (e.g., "RR", "Rr", "rr")
export function getGenotype(genetics: PlantGenetics): string {
  const allele1Char = genetics.chromosome1[0] ? "r" : "R";
  const allele2Char = genetics.chromosome2[0] ? "r" : "R";
  return `${allele1Char}${allele2Char}`;
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

// Count purple (recessive) plants
export function countPurplePlants(
  plants: { genetics: PlantGenetics }[]
): number {
  return plants.filter(
    (plant) => plant.genetics.chromosome1[0] && plant.genetics.chromosome2[0]
  ).length;
}

// Count purple (recessive) cabbages (deprecated - use countPurplePlants instead)
export function countPurpleCabbages(
  cabbages: { genetics: PlantGenetics }[]
): number {
  return countPurplePlants(cabbages);
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
      results.push({
        traitIndex,
        value: val,
        dnaSequence: val
          ? DNA_SEQUENCES[traitIndex].true
          : DNA_SEQUENCES[traitIndex].false,
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
        if (sequences) {
          results.push({
            traitIndex,
            value: firstPlantChr1,
            dnaSequence: firstPlantChr1 ? sequences.true : sequences.false,
          });
        }
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
        if (sequences) {
          results.push({
            traitIndex,
            value: firstPlantChr2,
            dnaSequence: firstPlantChr2 ? sequences.true : sequences.false,
          });
        }
      }
    }
  }

  return results;
}
