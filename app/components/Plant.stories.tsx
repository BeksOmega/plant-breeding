import type { Meta, StoryObj } from "@storybook/react";
import Plant from "./Plant";

const meta = {
  title: "Components/Plant",
  component: Plant,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    color: {
      control: "color",
      description: "The background color of the plant",
    },
    size: {
      control: { type: "number", min: 50, max: 200, step: 10 },
      description: "The size of the plant in pixels",
    },
    isSelected: {
      control: "boolean",
      description: "Whether the plant is selected",
    },
  },
} satisfies Meta<typeof Plant>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    color: "#4ade80",
    size: 100,
  },
};

export const Large: Story = {
  args: {
    color: "#4ade80",
    size: 150,
  },
};

export const Small: Story = {
  args: {
    color: "#4ade80",
    size: 50,
  },
};

export const Selected: Story = {
  args: {
    color: "#4ade80",
    size: 100,
    isSelected: true,
  },
};

export const DifferentColors: Story = {
  args: {
    color: "#f59e0b",
    size: 100,
  },
};
