import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Pot from "./Pot";

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
  render: () => {
    const [isSelected, setIsSelected] = useState(false);
    return (
      <Pot
        isEmpty={true}
        isSelected={isSelected}
        canSelect={true}
        onSelect={setIsSelected}
      />
    );
  },
};
