import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Umbel from "./Umbel";
import { PlantGenetics } from "../../types/genetics";
import { PlantType } from "../../types/seed";

// Sample genetics data for stories
const sampleGenetics: PlantGenetics = {
  chromosome1: [true, false, true, false, true],
  chromosome2: [false, true, false, true, false],
};

const meta = {
  title: "Components/Plants/Umbel",
  component: Umbel,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    genetics: {
      control: "object",
      description: "The plant's genetic data",
    },
    plantType: {
      control: "select",
      options: Object.values(PlantType),
      description: "The type of plant",
    },
    showGenotype: {
      control: "boolean",
      description: "Whether to display the genotype information",
    },
    isSelected: {
      control: "boolean",
      description: "Whether the plant is currently selected",
    },
    onSelect: {
      action: "selected",
      description: "Callback when selection state changes",
    },
    startGrowingAt: {
      control: "number",
      description: "Timestamp when growth should start",
    },
    onFullyGrown: {
      action: "fullyGrown",
      description: "Callback when growth completes",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-32 h-32">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Umbel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    genetics: sampleGenetics,
    plantType: PlantType.Umbel,
    showGenotype: false,
    isSelected: false,
  },
};

export const Selected: Story = {
  args: {
    genetics: sampleGenetics,
    plantType: PlantType.Umbel,
    showGenotype: false,
    isSelected: true,
  },
};

export const WithGenotype: Story = {
  args: {
    genetics: sampleGenetics,
    plantType: PlantType.Umbel,
    showGenotype: true,
    isSelected: false,
  },
};

export const SelectedWithGenotype: Story = {
  args: {
    genetics: sampleGenetics,
    plantType: PlantType.Umbel,
    showGenotype: true,
    isSelected: true,
  },
};

export const Interactive: Story = {
  args: {
    genetics: sampleGenetics,
    plantType: PlantType.Umbel,
    showGenotype: false,
  },
  render: () => {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <Umbel
        genetics={sampleGenetics}
        plantType={PlantType.Umbel}
        showGenotype={false}
        isSelected={isSelected}
        onSelect={setIsSelected}
      />
    );
  },
};

export const DifferentGenetics: Story = {
  args: {
    genetics: sampleGenetics,
    plantType: PlantType.Umbel,
  },
  render: () => {
    const genetics1: PlantGenetics = {
      chromosome1: [true, true, true],
      chromosome2: [true, true, true],
    };
    const genetics2: PlantGenetics = {
      chromosome1: [false, false, false],
      chromosome2: [false, false, false],
    };
    const genetics3: PlantGenetics = {
      chromosome1: [true, false, true, false],
      chromosome2: [true, false, true, false],
    };

    return (
      <div className="flex gap-4">
        <div className="w-32 h-32">
          <Umbel
            genetics={genetics1}
            plantType={PlantType.Umbel}
            showGenotype={true}
          />
        </div>
        <div className="w-32 h-32">
          <Umbel
            genetics={genetics2}
            plantType={PlantType.Umbel}
            showGenotype={true}
          />
        </div>
        <div className="w-32 h-32">
          <Umbel
            genetics={genetics3}
            plantType={PlantType.Umbel}
            showGenotype={true}
          />
        </div>
      </div>
    );
  },
};
