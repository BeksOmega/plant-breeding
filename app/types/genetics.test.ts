import { describe, it, expect, beforeEach } from "vitest";
import {
  findPossibleRecessiveTraits,
  findPossibleDominantTraits,
  mutate,
  PlantGenetics,
  DNA_SEQUENCES,
} from "./genetics";

// Set up test DNA sequences for testing purposes
beforeEach(() => {
  // Clear and set up test sequences
  Object.keys(DNA_SEQUENCES).forEach((key) => {
    delete DNA_SEQUENCES[Number(key)];
  });
  DNA_SEQUENCES[0] = {
    true: "AAA",
    false: "TCT",
  };
  DNA_SEQUENCES[1] = {
    true: "GGC",
    false: "TAA",
  };
  DNA_SEQUENCES[2] = {
    true: "CGT",
    false: "GCA",
  };
});

describe("findPossibleRecessiveTraits", () => {
  it("should return empty array for empty input", () => {
    const result = findPossibleRecessiveTraits([]);
    expect(result).toEqual([]);
  });

  it("should find trait when all plants have true at index 0", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, false], chromosome2: [true, false] },
      { chromosome1: [true, true], chromosome2: [true, true] },
      { chromosome1: [true, false], chromosome2: [true, false] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: true,
        dnaSequence: DNA_SEQUENCES[0].true,
      },
    ]);
  });

  it("should find trait when all plants have false at index 0", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [false, false], chromosome2: [false, false] },
      { chromosome1: [false, true], chromosome2: [false, true] },
      { chromosome1: [false, false], chromosome2: [false, false] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: false,
        dnaSequence: DNA_SEQUENCES[0].false,
      },
    ]);
  });

  it("should not find trait when plants have different values", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, true], chromosome2: [true, true] },
      { chromosome1: [false, false], chromosome2: [false, false] },
      { chromosome1: [true, false], chromosome2: [true, false] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result).toEqual([]);
  });

  it("should not find trait when chromosomes have different values within same plant", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, true], chromosome2: [false, false] },
      { chromosome1: [true, true], chromosome2: [false, false] },
      { chromosome1: [true, true], chromosome2: [false, false] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result).toEqual([]);
  });

  it("should find multiple traits when all plants match at multiple indices", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, true], chromosome2: [true, true] },
      { chromosome1: [true, true], chromosome2: [true, true] },
      { chromosome1: [true, true], chromosome2: [true, true] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: true,
        dnaSequence: DNA_SEQUENCES[0].true,
      },
      {
        traitIndex: 1,
        value: true,
        dnaSequence: DNA_SEQUENCES[1].true,
      },
    ]);
  });

  it("should find trait at index 1 when all plants match", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, false], chromosome2: [false, false] },
      { chromosome1: [false, false], chromosome2: [true, false] },
      { chromosome1: [true, false], chromosome2: [false, false] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result).toEqual([
      {
        traitIndex: 1,
        value: false,
        dnaSequence: DNA_SEQUENCES[1].false,
      },
    ]);
  });

  it("should return empty array for single plant", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, false], chromosome2: [true, false] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    // Single plant returns early - need at least 2 plants to compare
    expect(result).toEqual([]);
  });

  it("should skip trait indices that don't exist in first plant", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true], chromosome2: [true] },
      { chromosome1: [true, false], chromosome2: [true, false] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: true,
        dnaSequence: DNA_SEQUENCES[0].true,
      },
    ]);
  });

  it("should handle plants with different chromosome lengths", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, false], chromosome2: [true, false] },
      { chromosome1: [true, false, true], chromosome2: [true, false, true] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: true,
        dnaSequence: DNA_SEQUENCES[0].true,
      },
      {
        traitIndex: 1,
        value: false,
        dnaSequence: DNA_SEQUENCES[1].false,
      },
    ]);
  });

  it("should return correct DNA sequence for true value", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true], chromosome2: [true] },
      { chromosome1: [true], chromosome2: [true] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result[0].dnaSequence).toBe("AAA");
  });

  it("should return correct DNA sequence for false value", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [false], chromosome2: [false] },
      { chromosome1: [false], chromosome2: [false] },
    ];

    const result = findPossibleRecessiveTraits(plants);
    expect(result[0].dnaSequence).toBe("TCT");
  });
});

describe("findPossibleDominantTraits", () => {
  it("should return empty array for empty input", () => {
    const result = findPossibleDominantTraits([]);
    expect(result).toEqual([]);
  });

  it("should return empty array for single plant", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, false], chromosome2: [true, false] },
    ];

    const result = findPossibleDominantTraits(plants);
    expect(result).toEqual([]);
  });

  it("should find traits when all plants have matching values in at least one chromosome", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, false], chromosome2: [false, true] },
      { chromosome1: [false, true], chromosome2: [true, false] },
    ];

    const result = findPossibleDominantTraits(plants);
    // All plants have true at index 0 (from chr1), false at index 0 (from chr2),
    // false at index 1 (from chr1), and true at index 1 (from chr2) in at least one chromosome
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: true,
        dnaSequence: DNA_SEQUENCES[0].true,
      },
      {
        traitIndex: 0,
        value: false,
        dnaSequence: DNA_SEQUENCES[0].false,
      },
      {
        traitIndex: 1,
        value: false,
        dnaSequence: DNA_SEQUENCES[1].false,
      },
      {
        traitIndex: 1,
        value: true,
        dnaSequence: DNA_SEQUENCES[1].true,
      },
    ]);
  });

  it("should not find trait when plants have different values", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, false], chromosome2: [false, true] },
      { chromosome1: [false, false], chromosome2: [false, true] },
    ];

    const result = findPossibleDominantTraits(plants);
    // Index 0: first plant has true (chr1) and false (chr2), second has false (both chr) - false matches!
    // Index 1: first plant has false (chr1) and true (chr2), second has false (chr2) and true (chr2) - both match!
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: false,
        dnaSequence: DNA_SEQUENCES[0].false,
      },
      {
        traitIndex: 1,
        value: false,
        dnaSequence: DNA_SEQUENCES[1].false,
      },
      {
        traitIndex: 1,
        value: true,
        dnaSequence: DNA_SEQUENCES[1].true,
      },
    ]);
  });

  it("should handle plants with different chromosome lengths", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true], chromosome2: [false] },
      { chromosome1: [true, false], chromosome2: [false, true] },
    ];

    const result = findPossibleDominantTraits(plants);
    // First plant has true (chr1) and false (chr2) at index 0
    // Both values match across all plants
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: true,
        dnaSequence: DNA_SEQUENCES[0].true,
      },
      {
        traitIndex: 0,
        value: false,
        dnaSequence: DNA_SEQUENCES[0].false,
      },
    ]);
  });

  it("should return correct DNA sequence for true value", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true], chromosome2: [false] },
      { chromosome1: [false], chromosome2: [true] },
    ];

    const result = findPossibleDominantTraits(plants);
    expect(result[0].dnaSequence).toBe("AAA");
  });

  it("should return correct DNA sequence for false value", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [false], chromosome2: [true] },
      { chromosome1: [true], chromosome2: [false] },
    ];

    const result = findPossibleDominantTraits(plants);
    expect(result[0].dnaSequence).toBe("TCT");
  });

  it("should work when all plants have value in both chromosomes", () => {
    const plants: PlantGenetics[] = [
      { chromosome1: [true, false], chromosome2: [true, false] },
      { chromosome1: [true, false], chromosome2: [true, false] },
    ];

    const result = findPossibleDominantTraits(plants);
    expect(result).toEqual([
      {
        traitIndex: 0,
        value: true,
        dnaSequence: DNA_SEQUENCES[0].true,
      },
      {
        traitIndex: 1,
        value: false,
        dnaSequence: DNA_SEQUENCES[1].false,
      },
    ]);
  });
});

describe("mutate", () => {
  it("should not mutate the original genetics object", () => {
    const original: PlantGenetics = {
      chromosome1: [true, false],
      chromosome2: [true, false],
    };
    const originalCopy = {
      chromosome1: [...original.chromosome1],
      chromosome2: [...original.chromosome2],
    };

    mutate(original);

    expect(original.chromosome1).toEqual(originalCopy.chromosome1);
    expect(original.chromosome2).toEqual(originalCopy.chromosome2);
  });

  it("should return a new object with mutated chromosomes", () => {
    const genetics: PlantGenetics = {
      chromosome1: [true, false],
      chromosome2: [true, false],
    };

    const result = mutate(genetics);

    expect(result).not.toBe(genetics);
    expect(result.chromosome1).not.toBe(genetics.chromosome1);
    expect(result.chromosome2).not.toBe(genetics.chromosome2);
  });

  it("should flip approximately 1/4 of alleles (4 alleles = 1 flip)", () => {
    const genetics: PlantGenetics = {
      chromosome1: [true, false],
      chromosome2: [true, false],
    };

    // Run multiple times to check that on average ~1 allele is flipped
    let totalFlipped = 0;
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      const result = mutate(genetics);
      let flipped = 0;

      if (result.chromosome1[0] !== genetics.chromosome1[0]) flipped++;
      if (result.chromosome1[1] !== genetics.chromosome1[1]) flipped++;
      if (result.chromosome2[0] !== genetics.chromosome2[0]) flipped++;
      if (result.chromosome2[1] !== genetics.chromosome2[1]) flipped++;

      totalFlipped += flipped;
    }

    const averageFlipped = totalFlipped / iterations;
    // Should be close to 1 (allowing some variance due to randomness)
    expect(averageFlipped).toBeGreaterThan(0.5);
    expect(averageFlipped).toBeLessThan(1.5);
  });

  it("should flip at least 1 allele when alleles exist", () => {
    const genetics: PlantGenetics = {
      chromosome1: [true, false],
      chromosome2: [true, false],
    };

    // Run multiple times - at least one allele should always be flipped
    for (let i = 0; i < 50; i++) {
      const result = mutate(genetics);
      let flipped = 0;

      if (result.chromosome1[0] !== genetics.chromosome1[0]) flipped++;
      if (result.chromosome1[1] !== genetics.chromosome1[1]) flipped++;
      if (result.chromosome2[0] !== genetics.chromosome2[0]) flipped++;
      if (result.chromosome2[1] !== genetics.chromosome2[1]) flipped++;

      expect(flipped).toBeGreaterThanOrEqual(1);
    }
  });

  it("should handle empty chromosomes", () => {
    const genetics: PlantGenetics = {
      chromosome1: [],
      chromosome2: [],
    };

    const result = mutate(genetics);

    expect(result.chromosome1).toEqual([]);
    expect(result.chromosome2).toEqual([]);
  });

  it("should handle chromosomes with different lengths", () => {
    const genetics: PlantGenetics = {
      chromosome1: [true, false, true],
      chromosome2: [false, true],
    };

    const result = mutate(genetics);

    expect(result.chromosome1.length).toBe(3);
    expect(result.chromosome2.length).toBe(2);
  });

  it("should flip alleles from both chromosomes", () => {
    const genetics: PlantGenetics = {
      chromosome1: [true, true, true, true],
      chromosome2: [false, false, false, false],
    };

    // Run multiple times to ensure both chromosomes can be mutated
    let chromosome1Flipped = false;
    let chromosome2Flipped = false;

    for (let i = 0; i < 100; i++) {
      const result = mutate(genetics);

      // Check if chromosome1 was mutated
      if (
        result.chromosome1.some(
          (val, idx) => val !== genetics.chromosome1[idx]
        )
      ) {
        chromosome1Flipped = true;
      }

      // Check if chromosome2 was mutated
      if (
        result.chromosome2.some(
          (val, idx) => val !== genetics.chromosome2[idx]
        )
      ) {
        chromosome2Flipped = true;
      }

      if (chromosome1Flipped && chromosome2Flipped) break;
    }

    // Both chromosomes should be mutated at least once across many runs
    expect(chromosome1Flipped).toBe(true);
    expect(chromosome2Flipped).toBe(true);
  });

  it("should correctly flip boolean values (true to false, false to true)", () => {
    const genetics: PlantGenetics = {
      chromosome1: [true],
      chromosome2: [false],
    };

    // Run multiple times until we see both values flipped
    let trueFlipped = false;
    let falseFlipped = false;

    for (let i = 0; i < 100; i++) {
      const result = mutate(genetics);

      if (result.chromosome1[0] === false) {
        trueFlipped = true;
      }
      if (result.chromosome2[0] === true) {
        falseFlipped = true;
      }

      if (trueFlipped && falseFlipped) break;
    }

    expect(trueFlipped).toBe(true);
    expect(falseFlipped).toBe(true);
  });

  it("should handle single allele in one chromosome", () => {
    const genetics: PlantGenetics = {
      chromosome1: [true],
      chromosome2: [],
    };

    const result = mutate(genetics);

    // Should flip the one allele
    expect(result.chromosome1[0]).toBe(false);
    expect(result.chromosome2).toEqual([]);
  });

  it("should flip approximately 1/4 of alleles for larger sets", () => {
    const genetics: PlantGenetics = {
      chromosome1: [true, false, true, false, true, false, true, false],
      chromosome2: [true, false, true, false, true, false, true, false],
    };

    // 16 alleles total, should flip ~4
    let totalFlipped = 0;
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      const result = mutate(genetics);
      let flipped = 0;

      for (let j = 0; j < genetics.chromosome1.length; j++) {
        if (result.chromosome1[j] !== genetics.chromosome1[j]) flipped++;
        if (result.chromosome2[j] !== genetics.chromosome2[j]) flipped++;
      }

      totalFlipped += flipped;
    }

    const averageFlipped = totalFlipped / iterations;
    // Should be close to 4 (allowing variance)
    expect(averageFlipped).toBeGreaterThan(2);
    expect(averageFlipped).toBeLessThan(6);
  });
});
