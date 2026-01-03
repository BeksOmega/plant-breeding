"use client";

import { ReactElement } from "react";
import { Plant } from "../components/plants/Plant";
import ShepherdsSpindel from "../components/plants/ShepherdsSpindel";

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

