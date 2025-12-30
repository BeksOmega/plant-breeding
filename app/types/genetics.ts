// Plant genetics data structure
// Each plant has a pair of alleles (booleans)
// true = recessive allele
// false = dominant allele

export interface PlantGenetics {
  allele1: boolean; // First allele
  allele2: boolean; // Second allele
}

// Determine phenotype color based on genotype
// Purple (recessive) only shows if both alleles are true (homozygous recessive)
// Blue (dominant) shows if at least one allele is false (has dominant allele)
export function getPhenotypeColor(genetics: PlantGenetics): string {
  // If both are true (homozygous recessive), show purple
  if (genetics.allele1 && genetics.allele2) {
    return '#a78bfa'; // Purple color
  }
  // Otherwise, show blue (dominant trait)
  return '#60a5fa'; // Blue color (skyblue)
}

// Get genotype string representation (e.g., "RR", "Rr", "rr")
export function getGenotype(genetics: PlantGenetics): string {
  const allele1Char = genetics.allele1 ? 'r' : 'R';
  const allele2Char = genetics.allele2 ? 'r' : 'R';
  return `${allele1Char}${allele2Char}`;
}

// Breed two plants by randomly selecting one allele from each parent
export function breed(parent1: PlantGenetics, parent2: PlantGenetics): PlantGenetics {
  // Randomly select one allele from parent1
  const allele1 = Math.random() < 0.5 ? parent1.allele1 : parent1.allele2;
  // Randomly select one allele from parent2
  const allele2 = Math.random() < 0.5 ? parent2.allele1 : parent2.allele2;
  return { allele1, allele2 };
}

// Count purple (recessive) plants
export function countPurplePlants(plants: { genetics: PlantGenetics }[]): number {
  return plants.filter(
    (plant) => plant.genetics.allele1 && plant.genetics.allele2
  ).length;
}

// Count purple (recessive) cabbages (deprecated - use countPurplePlants instead)
export function countPurpleCabbages(cabbages: { genetics: PlantGenetics }[]): number {
  return countPurplePlants(cabbages);
}

