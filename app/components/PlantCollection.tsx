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
  draggable?: boolean;
  onReorder?: (reorderedItems: T[]) => void;
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
  draggable = false,
  onReorder,
  renderItem,
}: PlantCollectionProps<T>) {
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
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

  const handleDragStart = (index: number) => {
    if (!draggable) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    if (!draggable || draggedIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    if (!draggable) return;
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    if (!draggable || draggedIndex === null || !onReorder) return;
    e.preventDefault();

    if (draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Create a new array with reordered items
    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    onReorder(newItems);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    if (!draggable) return;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable={draggable}
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          className={`
            ${draggable ? "cursor-move" : ""}
            ${draggedIndex === index ? "opacity-50" : ""}
            ${
              dragOverIndex === index && draggedIndex !== index
                ? "scale-110 transition-transform ring-2 ring-green-500 ring-offset-2"
                : ""
            }
          `}
        >
          {renderItem(item, selectedIds.includes(item.id), (selected) =>
            handleItemSelect(item.id, selected)
          )}
        </div>
      ))}
    </div>
  );
}
