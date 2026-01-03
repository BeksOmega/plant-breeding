import { PlantGenetics } from "../../types/genetics";
import { PlantType } from "../../types/seed";

// Selection behavior interface
export interface Selectable {
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

// Growth behavior interface
export interface Growable {
  startGrowingAt?: number; // Timestamp when growth should start
  onFullyGrown?: () => void; // Callback when growth completes
}

// Base plant properties
export interface BasePlantProps {
  genetics: PlantGenetics;
  plantType: PlantType;
  showGenotype?: boolean;
}

// Plant interface combining Growable and BasePlantProps
export interface Plant extends Growable, BasePlantProps {}
