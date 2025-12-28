"use client";

import { useState, ReactNode } from "react";

interface SelectableItem {
  id: string;
}

interface PlantCollectionProps<T extends SelectableItem> {
  items: T[];
  maxSelected?: number;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  renderItem: (
    item: T,
    isSelected: boolean,
    onSelect: (selected: boolean) => void
  ) => ReactNode;
}

export default function PlantCollection<T extends SelectableItem>({
  items,
  maxSelected = Infinity,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  renderItem,
}: PlantCollectionProps<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const selectedIds =
    controlledSelectedIds !== undefined
      ? controlledSelectedIds
      : internalSelectedIds;

  const handleItemSelect = (itemId: string, selected: boolean) => {
    const getNewSelection = (prev: string[]): string[] => {
      if (selected) {
        // If selecting and we're at max, remove the first selected
        if (prev.length >= maxSelected) {
          return [...prev.slice(1), itemId];
        }
        return [...prev, itemId];
      } else {
        // If deselecting, remove from the array
        return prev.filter((id) => id !== itemId);
      }
    };

    if (controlledSelectedIds !== undefined) {
      // Controlled mode - call the callback
      const newSelection = getNewSelection(selectedIds);
      onSelectionChange?.(newSelection);
    } else {
      // Uncontrolled mode - update internal state
      setInternalSelectedIds((prev) => {
        const newSelection = getNewSelection(prev);
        onSelectionChange?.(newSelection);
        return newSelection;
      });
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => (
        <div key={item.id}>
          {renderItem(item, selectedIds.includes(item.id), (selected) =>
            handleItemSelect(item.id, selected)
          )}
        </div>
      ))}
    </div>
  );
}
