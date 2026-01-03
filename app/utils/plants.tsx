"use client";

import { ReactElement } from "react";
import { PlantGenetics } from "../types/genetics";
import { PlantType } from "../types/seed";
import { Plant } from "../components/plants/Plant";
import ShepherdsSpindel from "../components/plants/ShepherdsSpindel";

/**
 * Maps a PlantType to its corresponding React component.
 */
export function getPlantComponent(
  plantType: PlantType,
  genetics: PlantGenetics
): ReactElement<Plant> {
  switch (plantType) {
    case PlantType.ShepherdsSpindel:
      return <ShepherdsSpindel genetics={genetics} />;
    default:
      throw new Error(`Unknown plant type: ${plantType}`);
  }
}

