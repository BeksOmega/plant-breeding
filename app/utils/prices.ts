import { PlantType } from "../types/seed";

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
    basePrice: 50,
    variants: [
      {
        variantId: "purple",
        name: "Purple",
        price: 75,
      },
    ],
  },
];

// Price for a pot
export const POT_PRICE = 25;

