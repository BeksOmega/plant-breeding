"use client";

import { useState } from "react";
import Picker from "./controls/Picker";
import Toggle from "./controls/Toggle";
import Button from "./controls/Button";
import clsx from "clsx";
import Heading from "./typography/Heading";
import Surface from "./Surface";

interface ControlPanelProps {
  /** Additional CSS classes */
  className?: string;
  /** Callback when Plant button is clicked */
  onPlant?: () => void;
  /** Callback when Breed button is clicked */
  onBreed?: () => void;
  /** Callback when Cull button is clicked */
  onCull?: () => void;
  /** Whether the Plant button is disabled */
  disabledPlant?: boolean;
  /** Whether the Breed button is disabled */
  disabledBreed?: boolean;
  /** Whether the Cull button is disabled */
  disabledCull?: boolean;
  /** The current seed count */
  seedCount?: number;
}

/**
 * ControlPanel component - a control panel anchored in the bottom right
 * with a plant picker, toggle, and action buttons.
 */
export default function ControlPanel({
  className,
  onPlant,
  onBreed,
  onCull,
  disabledPlant = false,
  disabledBreed = false,
  disabledCull = false,
  seedCount = 0,
}: ControlPanelProps) {
  const [selectedPlantIndex, setSelectedPlantIndex] = useState(0);
  const [isPlantMode, setIsPlantMode] = useState(false);

  const plantOptions = ["spindel"];

  return (
    <Surface
      shadow="lg"
      className={clsx(
        "fixed bottom-4 right-4",
        "flex flex-col items-center",
        "z-50",
        "p-2",
        className
      )}
    >
      <Heading as="h5">Control panel</Heading>

      <div className="flex gap-4">
        {/* Left side: Picker and Toggle */}
        <div className="flex flex-col items-center place-content-between">
          <Picker
            options={plantOptions}
            value={selectedPlantIndex}
            onChange={setSelectedPlantIndex}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              className="px-8"
              onClick={onPlant}
              disabled={disabledPlant}
            >
              Plant
            </Button>
            <div className="w-16 text-center font-rajdhani text-sm border-2 border-gray-300 px-3 py-1.5">
              {seedCount}
            </div>
          </div>
          {/* <Toggle
            offLabel="Off"
            onLabel="Plant"
            checked={isPlantMode}
            onChange={setIsPlantMode}
          /> */}
        </div>

        {/* Right side: Stacked buttons */}
        <div className="flex flex-col gap-2 w-24">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={onBreed}
            disabled={disabledBreed}
          >
            Breed
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={onCull}
            disabled={disabledCull}
          >
            Cull
          </Button>
        </div>
      </div>
    </Surface>
  );
}
