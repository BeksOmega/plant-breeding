import { PlantType } from "../types/seed";
import { PlantGenetics } from "../types/genetics";

export interface PlantVariant {
  variantId: string;
  name: string;
  price: number;
}

export interface PlantCatalogItem {
  plantType: PlantType;
  name: string;
  basePrice: number;
  variants?: PlantVariant[];
}

// Base prices for different plant types with variants
export const PLANT_PRICES: PlantCatalogItem[] = [
  {
    plantType: PlantType.ShepherdsSpindel,
    name: "Shepherd's Spindel",
    basePrice: 2,
    variants: [
      {
        variantId: "purple",
        name: "Purple",
        price: 10,
      },
    ],
  },
];

// Price for a pot
export const POT_PRICE = 25;

// Price for a rocket ticket
export const ROCKET_TICKET_PRICE = 500;

// Price for a mutagen
export const MUTAGEN_PRICE = 50;

/**
 * Calculates the price of a plant based on its type and genetics.
 * Checks for variant matches (e.g., purple variant for Shepherd's Spindel).
 */
export function calculatePlantPrice(
  plantType: PlantType,
  genetics: PlantGenetics
): number {
  const catalogItem = PLANT_PRICES.find((item) => item.plantType === plantType);

  if (!catalogItem) {
    return 0;
  }

  // Check for variant matches
  if (catalogItem.variants) {
    // For Shepherd's Spindel, purple variant is determined by both chromosomes having true at index 0
    if (plantType === PlantType.ShepherdsSpindel) {
      const isPurple =
        genetics.chromosome1[0] === true && genetics.chromosome2[0] === true;
      if (isPurple) {
        const purpleVariant = catalogItem.variants.find(
          (v) => v.variantId === "purple"
        );
        if (purpleVariant) {
          return purpleVariant.price;
        }
      }
    }
  }

  // Return base price if no variant matches
  return catalogItem.basePrice;
}
