/**
 * Generates a random integer in the range [min, max] (inclusive).
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer between min and max
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

