'use client';

import Plant from './Plant';
import { PlantGenetics, getPhenotypeColor } from '../types/genetics';

interface CabbageProps {
  genetics: PlantGenetics;
  size?: number;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

export default function Cabbage({
  genetics,
  size = 100,
  isSelected,
  onSelect,
}: CabbageProps) {
  const color = getPhenotypeColor(genetics);

  return (
    <Plant
      color={color}
      size={size}
      isSelected={isSelected}
      onSelect={onSelect}
    />
  );
}

