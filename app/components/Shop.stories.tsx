import type { Meta, StoryObj } from "@storybook/react";
import Shop from "./Shop";

const meta = {
  title: "Components/Shop",
  component: Shop,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    balance: {
      control: "number",
      description: "Current balance in coins",
    },
    onBuyPot: {
      action: "buy pot clicked",
      description: "Callback when Buy Pot button is clicked",
    },
    onBuyRocketTicket: {
      action: "buy rocket ticket clicked",
      description: "Callback when Buy Rocket Ticket button is clicked",
    },
    onBuyMutagen: {
      action: "buy mutagen clicked",
      description: "Callback when Buy Mutagen button is clicked",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Shop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    balance: 100,
  },
};

export const LowBalance: Story = {
  args: {
    balance: 10,
  },
};

export const HighBalance: Story = {
  args: {
    balance: 500,
  },
};

export const WithCallbacks: Story = {
  args: {
    balance: 100,
    onBuyPot: () => console.log("Buy pot clicked"),
    onBuyRocketTicket: () => console.log("Buy rocket ticket clicked"),
    onBuyMutagen: () => console.log("Buy mutagen clicked"),
  },
};

