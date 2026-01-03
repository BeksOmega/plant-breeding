import type { Meta, StoryObj } from "@storybook/react";
import Toast from "./Toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Content to display in the toast",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This is a toast notification",
  },
};

export const WithText: Story = {
  args: {
    children: "Plant successfully bred!",
  },
};

export const WithComplexContent: Story = {
  args: {
    children: (
      <div>
        <p className="font-bold">Success!</p>
        <p className="text-sm">Your plant has been successfully planted.</p>
      </div>
    ),
  },
};

export const MultipleToasts: Story = {
  render: () => (
    <div className="fixed top-0 left-0 flex flex-col gap-2">
      <Toast>First toast notification</Toast>
      <Toast>Second toast notification</Toast>
      <Toast>Third toast notification</Toast>
    </div>
  ),
};

