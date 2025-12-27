'use client';

import { useState } from 'react';
import Plant from './Plant';

interface PlantData {
  id: string;
  color: string;
}

interface PlantCollectionProps {
  plants: PlantData[];
  maxSelected?: number;
  size?: number;
}

export default function PlantCollection({ 
  plants, 
  maxSelected = Infinity,
  size = 100 
}: PlantCollectionProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handlePlantSelect = (plantId: string, selected: boolean) => {
    setSelectedIds((prev) => {
      if (selected) {
        // If selecting and we're at max, remove the first selected
        if (prev.length >= maxSelected) {
          return [...prev.slice(1), plantId];
        }
        return [...prev, plantId];
      } else {
        // If deselecting, remove from the array
        return prev.filter((id) => id !== plantId);
      }
    });
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {plants.map((plant) => (
        <Plant
          key={plant.id}
          color={plant.color}
          size={size}
          isSelected={selectedIds.includes(plant.id)}
          onSelect={(selected) => handlePlantSelect(plant.id, selected)}
        />
      ))}
    </div>
  );
}

