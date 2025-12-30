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
