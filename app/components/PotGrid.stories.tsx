import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import PotGrid, { PotData } from "./PotGrid";
import { PlantGenetics } from "../types/genetics";
import { PlantType } from "../types/seed";

// Sample genetics data for stories
const sampleGenetics: PlantGenetics[] = [
  {
    chromosome1: [true, true, true],
    chromosome2: [true, true, true],
  },
  {
    chromosome1: [false, false, false],
    chromosome2: [false, false, false],
  },
  {
    chromosome1: [true, false, true],
    chromosome2: [false, true, false],
  },
  {
    chromosome1: [true, true, false],
    chromosome2: [false, false, true],
  },
  {
    chromosome1: [false, true, true],
    chromosome2: [true, false, false],
  },
  {
    chromosome1: [true, false, false],
    chromosome2: [false, true, true],
  },
];

const meta = {
  title: "Components/PotGrid",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to create pot data
const createPotData = (
  id: number,
  isEmpty: boolean,
  genetics?: PlantGenetics
): PotData => ({
  id,
  isEmpty,
  plant: genetics
    ? {
        genetics,
        plantType: PlantType.ShepherdsSpindel,
      }
    : undefined,
});

export const Default: Story = {
  render: () => {
    const pots: PotData[] = [
      createPotData(0, false, sampleGenetics[0]),
      createPotData(1, false, sampleGenetics[1]),
      createPotData(2, false, sampleGenetics[2]),
      createPotData(3, true),
      createPotData(4, false, sampleGenetics[3]),
      createPotData(5, true),
    ];

    return (
      <div className="w-screen">
        <PotGrid pots={pots} multiSelect={false} />
      </div>
    );
  },
};

export const WithEmptyPots: Story = {
  render: () => {
    const pots: PotData[] = [
      createPotData(0, true),
      createPotData(1, true),
      createPotData(2, true),
      createPotData(3, true),
      createPotData(4, true),
      createPotData(5, true),
    ];

    return (
      <div className="w-screen">
        <PotGrid pots={pots} />
      </div>
    );
  },
};

export const SingleSelect: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const pots: PotData[] = sampleGenetics
      .slice(0, 6)
      .map((gen, index) => createPotData(index, false, gen));

    return (
      <div className="w-screen">
        <div className="mb-4 text-sm text-gray-600">
          Selected: {selectedIds.length > 0 ? selectedIds.join(", ") : "None"}
        </div>
        <PotGrid
          pots={pots}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          multiSelect={false}
        />
      </div>
    );
  },
};

export const MultiSelect: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([0, 2]);

    const pots: PotData[] = sampleGenetics
      .slice(0, 6)
      .map((gen, index) => createPotData(index, false, gen));

    return (
      <div className="w-screen">
        <div className="mb-4 text-sm text-gray-600">
          Selected: {selectedIds.length > 0 ? selectedIds.join(", ") : "None"}
        </div>
        <PotGrid
          pots={pots}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          multiSelect={true}
        />
      </div>
    );
  },
};

export const CustomColumns: Story = {
  render: () => {
    const pots: PotData[] = sampleGenetics
      .slice(0, 8)
      .map((gen, index) => createPotData(index, false, gen));

    return (
      <div className="w-screen max-w-6xl space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold">2 Columns</h3>
          <PotGrid pots={pots.slice(0, 4)} className="grid-cols-2" />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">3 Columns</h3>
          <PotGrid pots={pots} className="grid-cols-3" />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">4 Columns</h3>
          <PotGrid pots={pots} className="grid-cols-4" />
        </div>
      </div>
    );
  },
};

export const MixedPots: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const pots: PotData[] = [
      createPotData(0, false, sampleGenetics[0]),
      createPotData(1, true),
      createPotData(2, false, sampleGenetics[1]),
      createPotData(3, true),
      createPotData(4, false, sampleGenetics[2]),
      createPotData(5, true),
      createPotData(6, false, sampleGenetics[3]),
      createPotData(7, true),
      createPotData(8, false, sampleGenetics[4]),
    ];

    return (
      <div className="w-screen">
        <div className="mb-4 text-sm text-gray-600">
          Selected: {selectedIds.length > 0 ? selectedIds.join(", ") : "None"}
        </div>
        <PotGrid
          pots={pots}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          multiSelect={true}
        />
      </div>
    );
  },
};

export const SomePotsNotSelectable: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

    const pots: PotData[] = sampleGenetics.slice(0, 6).map((gen, index) => ({
      ...createPotData(index, false, gen),
      canSelect: index !== 1 && index !== 4, // Pots 1 and 4 cannot be selected
    }));

    return (
      <div className="w-screen">
        <div className="mb-4 text-sm text-gray-600">
          Selected: {selectedIds.length > 0 ? selectedIds.join(", ") : "None"}
          <br />
          <span className="text-xs text-gray-500">
            Pots 1 and 4 are not selectable
          </span>
        </div>
        <PotGrid
          pots={pots}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          multiSelect={true}
        />
      </div>
    );
  },
};

export const CustomGap: Story = {
  render: () => {
    const pots: PotData[] = sampleGenetics
      .slice(0, 6)
      .map((gen, index) => createPotData(index, false, gen));

    return (
      <div className="w-screen space-y-8">
        <div>
          <h3 className="mb-4 text-lg font-semibold">Default gap (gap-4)</h3>
          <PotGrid pots={pots} />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Small gap (gap-0)</h3>
          <PotGrid pots={pots} className="gap-0" />
        </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Large gap (gap-20)</h3>
          <PotGrid pots={pots} className="gap-20" />
        </div>
      </div>
    );
  },
};
