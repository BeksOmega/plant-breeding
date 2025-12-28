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
// Green (dominant) shows if at least one allele is false (has dominant allele)
export function getPhenotypeColor(genetics: PlantGenetics): string {
  // If both are true (homozygous recessive), show purple
  if (genetics.allele1 && genetics.allele2) {
    return '#a78bfa'; // Purple color
  }
  // Otherwise, show green (dominant trait)
  return '#4ade80'; // Green color
}

// Get genotype string representation (e.g., "RR", "Rr", "rr")
export function getGenotype(genetics: PlantGenetics): string {
  const allele1Char = genetics.allele1 ? 'r' : 'R';
  const allele2Char = genetics.allele2 ? 'r' : 'R';
  return `${allele1Char}${allele2Char}`;
}

