// Plant genetics data structure
// Each plant has two chromosomes, each containing parallel arrays of traits
// true = recessive chromosome
// false = dominant chromosome
// chromosome1[0] and chromosome2[0]: color trait (purple/green)
// chromosome1[1] and chromosome2[1]: growing speed trait (slow/fast)
// chromosome1[2] and chromosome2[2]: blue trait (blue/non-blue)

export interface PlantGenetics {
  chromosome1: [boolean, boolean, boolean]; // First chromosome: [color, speed, blue]
  chromosome2: [boolean, boolean, boolean]; // Second chromosome: [color, speed, blue]
}

// Determine phenotype color based on genotype
// Blue (recessive) only shows if both blue alleles are true AND both purple alleles are true
// Purple (recessive) only shows if both purple chromosomes are true (homozygous recessive) but blue is not
// Green (dominant) shows if at least one purple chromosome is false (has dominant chromosome)
export function getPhenotypeColor(genetics: PlantGenetics): string {
  const isPurple = genetics.chromosome1[0] && genetics.chromosome2[0];
  const isBlue = genetics.chromosome1[2] && genetics.chromosome2[2];

  // Blue only shows if both blue and purple are homozygous recessive
  if (isPurple && isBlue) {
    return "#3b82f6"; // Blue color
  }
  // If both are true (homozygous recessive), show purple
  if (isPurple) {
    return "#a78bfa"; // Purple color
  }
  // Otherwise, show green (dominant trait)
  return "#4ade80"; // Green color
}

// Get genotype string representation (e.g., "RR, SS, BB" for color, speed, and blue)
export function getGenotype(genetics: PlantGenetics): string {
  const colorChar1 = genetics.chromosome1[0] ? "r" : "R";
  const colorChar2 = genetics.chromosome2[0] ? "r" : "R";
  const speedChar1 = genetics.chromosome1[1] ? "s" : "S";
  const speedChar2 = genetics.chromosome2[1] ? "s" : "S";
  const blueChar1 = genetics.chromosome1[2] ? "b" : "B";
  const blueChar2 = genetics.chromosome2[2] ? "b" : "B";
  return (
    `${colorChar1}${colorChar2}, ${speedChar1}${speedChar2}, ${blueChar1}${blueChar2} - ` +
    `${colorChar1}${speedChar1}${blueChar1}, ${colorChar2}${speedChar2}${blueChar2}`
  );
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
// With 50% chance of recombination (crossover) between the parent's chromosomes
export function breed(
  parent1: PlantGenetics,
  parent2: PlantGenetics
): PlantGenetics {
  // Helper function to potentially recombine chromosomes from a parent
  const getChromosomeWithRecombination = (
    chrom1: [boolean, boolean, boolean],
    chrom2: [boolean, boolean, boolean]
  ): [boolean, boolean, boolean] => {
    // 50% chance of recombination
    if (Math.random() < 0.5) {
      // Pick a break point (between positions 0-1 or 1-2)
      const breakPoint = Math.random() < 0.5 ? 1 : 2;

      // Create recombinant chromosome
      // Take traits before break from chrom1, after break from chrom2
      const recombinant: [boolean, boolean, boolean] = [
        chrom1[0],
        chrom1[1],
        chrom1[2],
      ];

      // Swap traits after the break point
      for (let i = breakPoint; i < 3; i++) {
        recombinant[i] = chrom2[i];
      }

      return recombinant;
    } else {
      // No recombination, just randomly select one chromosome
      return Math.random() < 0.5 ? chrom1 : chrom2;
    }
  };

  // Get chromosomes from each parent (with potential recombination)
  const chromosome1 = getChromosomeWithRecombination(
    parent1.chromosome1,
    parent1.chromosome2
  );
  const chromosome2 = getChromosomeWithRecombination(
    parent2.chromosome1,
    parent2.chromosome2
  );

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
// blueCabbageUnlocked: if false, only affects R (color, index 0) and S (speed, index 1) genes
//                      if true, can affect all genes including B (blue, index 2)
export function mutate(
  genetics: PlantGenetics,
  blueCabbageUnlocked: boolean = false
): PlantGenetics {
  // Create a deep copy
  const mutated: PlantGenetics = {
    chromosome1: [...genetics.chromosome1],
    chromosome2: [...genetics.chromosome2],
  };

  // Randomly select which chromosome and which trait to flip
  const chromosomeIndex = Math.random() < 0.5 ? 0 : 1;

  // If blue cabbage is not unlocked, only allow mutations to R (0) and S (1) genes
  // If blue cabbage is unlocked, allow mutations to all genes (0, 1, 2)
  let traitIndex: number;
  if (blueCabbageUnlocked) {
    traitIndex = Math.floor(Math.random() * 3); // 0, 1, or 2 (color, speed, blue)
  } else {
    traitIndex = Math.floor(Math.random() * 2); // 0 or 1 (color, speed only)
  }

  // Flip the selected boolean
  if (chromosomeIndex === 0) {
    mutated.chromosome1[traitIndex] = !mutated.chromosome1[traitIndex];
  } else {
    mutated.chromosome2[traitIndex] = !mutated.chromosome2[traitIndex];
  }

  return mutated;
}

// Get readable color description (Green, Purple, or Blue)
export function getColorDescription(genetics: PlantGenetics): string {
  const isPurple = genetics.chromosome1[0] && genetics.chromosome2[0];
  const isBlue = genetics.chromosome1[2] && genetics.chromosome2[2];

  // Blue only shows if both blue and purple are homozygous recessive
  if (isPurple && isBlue) {
    return "Blue";
  }
  // If both are true (homozygous recessive), it's purple
  if (isPurple) {
    return "Purple";
  }
  // Otherwise, it's green (dominant trait)
  return "Green";
}

// Get readable speed description (Fast or Slow)
export function getSpeedDescription(genetics: PlantGenetics): string {
  // If both are true (homozygous recessive), it's fast
  if (genetics.chromosome1[1] && genetics.chromosome2[1]) {
    return "Fast";
  }
  // Otherwise, it's slow (dominant trait)
  return "Slow";
}

// Get tooltip text combining color and speed descriptions
export function getPlantTooltip(genetics: PlantGenetics): string {
  const color = getColorDescription(genetics);
  const speed = getSpeedDescription(genetics);
  return `${color}, ${speed}`;
}
