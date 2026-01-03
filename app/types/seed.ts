import { PlantGenetics } from "./genetics";

/**
 * Enum representing the different types of plants that can be grown from seeds.
 */
export enum PlantType {
  Umbel = "Umbel",
}

/**
 * Represents a seed that can be planted to grow a specific type of plant.
 * Contains the plant's genome and the type of plant it will grow into.
 */
export class Seed {
  /**
   * The genetic information of the plant that will grow from this seed.
   */
  readonly genome: PlantGenetics;

  /**
   * The type of plant this seed will grow into.
   */
  readonly plantType: PlantType;

  constructor(genome: PlantGenetics, plantType: PlantType) {
    this.genome = genome;
    this.plantType = plantType;
  }

  /**
   * Creates a copy of this seed.
   */
  clone(): Seed {
    return new Seed(
      {
        chromosome1: [...this.genome.chromosome1],
        chromosome2: [...this.genome.chromosome2],
      },
      this.plantType
    );
  }
}
