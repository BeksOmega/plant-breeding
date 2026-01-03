import type { Meta, StoryObj } from "@storybook/react";
import ControlPanel from "./ControlPanel";

const meta = {
  title: "Components/ControlPanel",
  component: ControlPanel,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
    onPlant: {
      action: "plant clicked",
      description: "Callback when Plant button is clicked",
    },
    onBreed: {
      action: "breed clicked",
      description: "Callback when Breed button is clicked",
    },
    onCull: {
      action: "cull clicked",
      description: "Callback when Cull button is clicked",
    },
    disabledPlant: {
      control: "boolean",
      description: "Whether the Plant button is disabled",
    },
    disabledBreed: {
      control: "boolean",
      description: "Whether the Breed button is disabled",
    },
    disabledCull: {
      control: "boolean",
      description: "Whether the Cull button is disabled",
    },
  },
} satisfies Meta<typeof ControlPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithCustomStyling: Story = {
  args: {
    className: "bg-gray-100 border-2 border-gray-300",
  },
};

export const WithCallbacks: Story = {
  args: {
    onPlant: () => console.log("Plant button clicked"),
    onBreed: () => console.log("Breed button clicked"),
    onCull: () => console.log("Cull button clicked"),
  },
};

export const WithDisabledButtons: Story = {
  args: {
    disabledPlant: true,
    disabledBreed: false,
    disabledCull: true,
  },
};
