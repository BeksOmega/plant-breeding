"use client";

import { ReactElement } from "react";
import { Plant } from "../components/plants/Plant";
import { PlantGenetics } from "../types/genetics";
import { PlantType } from "../types/seed";
import ShepherdsSpindel from "../components/plants/ShepherdsSpindel";

const DEFAULT_GROWTH_TIME_MS = 10000; // 10 seconds
const FAST_GROWTH_TIME_MS = 2000; // 2 seconds

/**
 * Calculates the growth time for a plant based on its genetics and type.
 */
export function calculateGrowthTime(
  plantType: PlantType,
  genetics: PlantGenetics
): number {
  switch (plantType) {
    case PlantType.ShepherdsSpindel:
      // Check if both chromosomes have true at index 1 (recessive trait for growth speed)
      const hasFastGrowth =
        genetics.chromosome1[1] === true && genetics.chromosome2[1] === true;
      return hasFastGrowth ? FAST_GROWTH_TIME_MS : DEFAULT_GROWTH_TIME_MS;
    default:
      return DEFAULT_GROWTH_TIME_MS;
  }
}

/**
 * Renders a Plant component from Plant props.
 */
export function renderPlant(plantProps: Plant): ReactElement<Plant> {
  switch (plantProps.plantType) {
    case "ShepherdsSpindel":
      return <ShepherdsSpindel {...plantProps} />;
    default:
      throw new Error(`Unknown plant type: ${plantProps.plantType}`);
  }
}

/**
 * Maps a PlantType to its corresponding React component.
 * @deprecated Use renderPlant instead with Plant props that include plantType.
 */
export function getPlantComponent(
  plantType: Plant["plantType"],
  genetics: Plant["genetics"]
): ReactElement<Plant> {
  return renderPlant({ genetics, plantType });
}

