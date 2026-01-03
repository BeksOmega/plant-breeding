import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Pot from "./Pot";
import ShepherdsSpindel from "./plants/ShepherdsSpindel";
import { PlantType } from "../types/seed";

const meta = {
  title: "Components/Pot",
  component: Pot,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isSelected: {
      control: "boolean",
      description: "Whether the pot is currently selected",
    },
    isEmpty: {
      control: "boolean",
      description: "Whether the pot is empty (read-only)",
    },
    canSelect: {
      control: "boolean",
      description: "Whether the pot can be selected",
    },
    hasMutagen: {
      control: "boolean",
      description: "Whether this pot has mutagen applied",
    },
    onSelect: {
      action: "selected",
      description: "Callback when selection state changes",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-32 h-32">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Pot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isEmpty: true,
    isSelected: false,
    canSelect: true,
  },
};

export const Selected: Story = {
  args: {
    isEmpty: true,
    isSelected: true,
    canSelect: true,
  },
};

export const NotSelectable: Story = {
  args: {
    isEmpty: true,
    isSelected: false,
    canSelect: false,
  },
};

export const Interactive: Story = {
  args: {
    isEmpty: true,
    isSelected: false,
    canSelect: true,
  },
  render: (args) => {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <Pot
        {...args}
        isSelected={isSelected}
        onSelect={setIsSelected}
      />
    );
  },
};

export const WithGrowingPlant: Story = {
  args: {
    isEmpty: false,
  },
  render: () => {
    const startTime = Date.now();
    return (
      <Pot isEmpty={false}>
        <ShepherdsSpindel
          genetics={{
            chromosome1: [true, false, true],
            chromosome2: [false, true, false],
          }}
          plantType={PlantType.ShepherdsSpindel}
          startGrowingAt={startTime}
        />
      </Pot>
    );
  },
};

export const PartiallyGrown: Story = {
  args: {
    isEmpty: false,
  },
  render: () => {
    const startTime = Date.now() - 5000; // 50% grown
    return (
      <Pot isEmpty={false}>
        <ShepherdsSpindel
          genetics={{
            chromosome1: [true, false, true],
            chromosome2: [false, true, false],
          }}
          plantType={PlantType.ShepherdsSpindel}
          startGrowingAt={startTime}
        />
      </Pot>
    );
  },
};

export const WithMutagen: Story = {
  args: {
    isEmpty: true,
    isSelected: false,
    canSelect: true,
    hasMutagen: true,
  },
};
