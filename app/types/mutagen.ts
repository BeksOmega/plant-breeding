/**
 * Represents a mutagen item that can be used to modify plant genetics.
 * This is a data object that can be passed around and extended with properties later.
 */
export class Mutagen {
  constructor() {
    // No properties yet - can be extended later
  }

  /**
   * Creates a copy of this mutagen.
   */
  clone(): Mutagen {
    return new Mutagen();
  }
}

