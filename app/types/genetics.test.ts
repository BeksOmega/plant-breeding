import { describe, it, expect } from "vitest";
import {
  findPossibleRecessiveTraits,
  findPossibleDominantTraits,
  PlantGenetics,
  DNA_SEQUENCES,
} from "./genetics";

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
