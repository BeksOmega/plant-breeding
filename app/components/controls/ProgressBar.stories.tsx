import type { Meta, StoryObj } from "@storybook/react";
import ProgressBar from "./ProgressBar";
import { useState } from "react";

const meta = {
  title: "Components/ProgressBar",
  component: ProgressBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Progress value (0-100)",
    },
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Visual style variant",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Size variant",
    },
    disabled: {
      control: "boolean",
      description: "Whether the progress bar is disabled",
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    variant: "primary",
    size: "md",
    disabled: false,
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Primary: Story = {
  args: {
    value: 75,
    variant: "primary",
    size: "md",
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Secondary: Story = {
  args: {
    value: 60,
    variant: "secondary",
    size: "md",
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Small: Story = {
  args: {
    value: 40,
    variant: "primary",
    size: "sm",
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Medium: Story = {
  args: {
    value: 65,
    variant: "primary",
    size: "md",
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Large: Story = {
  args: {
    value: 80,
    variant: "primary",
    size: "lg",
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    value: 50,
    variant: "primary",
    size: "md",
    disabled: true,
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Zero: Story = {
  args: {
    value: 0,
    variant: "primary",
    size: "md",
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Full: Story = {
  args: {
    value: 100,
    variant: "primary",
    size: "md",
  },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const [value, setValue] = useState(0);
    return (
      <div className="w-64 space-y-4">
        <ProgressBar value={value} variant="primary" size="md" />
        <div className="flex gap-2">
          <button
            onClick={() => setValue(Math.max(0, value - 10))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            -10
          </button>
          <button
            onClick={() => setValue(Math.min(100, value + 10))}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            +10
          </button>
        </div>
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div className="space-y-2">
        <div className="text-sm font-medium">Primary Variant</div>
        <ProgressBar value={25} variant="primary" size="md" />
        <ProgressBar value={50} variant="primary" size="md" />
        <ProgressBar value={75} variant="primary" size="md" />
        <ProgressBar value={100} variant="primary" size="md" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Secondary Variant</div>
        <ProgressBar value={25} variant="secondary" size="md" />
        <ProgressBar value={50} variant="secondary" size="md" />
        <ProgressBar value={75} variant="secondary" size="md" />
        <ProgressBar value={100} variant="secondary" size="md" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Sizes</div>
        <ProgressBar value={60} variant="primary" size="sm" />
        <ProgressBar value={60} variant="primary" size="md" />
        <ProgressBar value={60} variant="primary" size="lg" />
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Disabled</div>
        <ProgressBar value={50} variant="primary" size="md" disabled />
        <ProgressBar value={50} variant="secondary" size="md" disabled />
      </div>
    </div>
  ),
};

