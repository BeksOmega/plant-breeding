// Plant genetics data structure
// Each plant has two chromosomes, each containing parallel arrays of traits
// true = recessive chromosome
// false = dominant chromosome
// chromosome1[0] and chromosome2[0]: color trait (purple/green)
// chromosome1[1] and chromosome2[1]: growing speed trait (slow/fast)

export interface PlantGenetics {
  chromosome1: [boolean, boolean]; // First chromosome: [color, speed]
  chromosome2: [boolean, boolean]; // Second chromosome: [color, speed]
}

// Determine phenotype color based on genotype
// Purple (recessive) only shows if both chromosomes are true (homozygous recessive)
// Green (dominant) shows if at least one chromosome is false (has dominant chromosome)
export function getPhenotypeColor(genetics: PlantGenetics): string {
  // If both are true (homozygous recessive), show purple
  if (genetics.chromosome1[0] && genetics.chromosome2[0]) {
    return "#a78bfa"; // Purple color
  }
  // Otherwise, show green (dominant trait)
  return "#4ade80"; // Green color
}

// Get genotype string representation (e.g., "RR, SS" for color and speed)
export function getGenotype(genetics: PlantGenetics): string {
  const colorChar1 = genetics.chromosome1[0] ? "r" : "R";
  const colorChar2 = genetics.chromosome2[0] ? "r" : "R";
  const speedChar1 = genetics.chromosome1[1] ? "s" : "S";
  const speedChar2 = genetics.chromosome2[1] ? "s" : "S";
  return `${colorChar1}${colorChar2}, ${speedChar1}${speedChar2}`;
}

// Get growing speed in milliseconds based on speed trait
// Dominant (S): 10 seconds (10000ms)
// Recessive (s): 2 seconds (2000ms)
// Recessive only shows if both chromosomes are true (homozygous recessive)
export function getGrowingSpeed(genetics: PlantGenetics): number {
  // If both are true (homozygous recessive), fast growth (2s)
  if (genetics.chromosome1[1] && genetics.chromosome2[1]) {
    return 2000; // 2 seconds
  }
  // Otherwise, slow growth (10s) - dominant trait
  return 10000; // 10 seconds
}

// Breed two plants by randomly selecting one chromosome from each parent
export function breed(
  parent1: PlantGenetics,
  parent2: PlantGenetics
): PlantGenetics {
  // Randomly select one chromosome from parent1
  const chromosome1 =
    Math.random() < 0.5 ? parent1.chromosome1 : parent1.chromosome2;
  // Randomly select one chromosome from parent2
  const chromosome2 =
    Math.random() < 0.5 ? parent2.chromosome1 : parent2.chromosome2;

  return {
    chromosome1,
    chromosome2,
  };
}

// Count purple (recessive) cabbages
export function countPurpleCabbages(
  cabbages: { genetics: PlantGenetics }[]
): number {
  return cabbages.filter(
    (cabbage) =>
      cabbage.genetics.chromosome1[0] && cabbage.genetics.chromosome2[0]
  ).length;
}

// Mutate a plant's genetics by randomly flipping one boolean value
export function mutate(genetics: PlantGenetics): PlantGenetics {
  // Create a deep copy
  const mutated: PlantGenetics = {
    chromosome1: [...genetics.chromosome1],
    chromosome2: [...genetics.chromosome2],
  };

  // Randomly select which chromosome and which trait to flip
  const chromosomeIndex = Math.random() < 0.5 ? 0 : 1;
  const traitIndex = Math.random() < 0.5 ? 0 : 1;

  // Flip the selected boolean
  if (chromosomeIndex === 0) {
    mutated.chromosome1[traitIndex] = !mutated.chromosome1[traitIndex];
  } else {
    mutated.chromosome2[traitIndex] = !mutated.chromosome2[traitIndex];
  }

  return mutated;
}
