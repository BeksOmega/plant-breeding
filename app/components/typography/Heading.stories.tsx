import type { Meta, StoryObj } from "@storybook/react";
import Heading from "./Heading";

const meta = {
  title: "Typography/Heading",
  component: Heading,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "The heading text content",
    },
    as: {
      control: "select",
      options: ["h1", "h2", "h3", "h4", "h5", "h6"],
      description: "The heading level element to render as",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Plant Breeding",
    as: "h1",
  },
};

export const H1: Story = {
  args: {
    children: "Heading 1",
    as: "h1",
  },
};

export const H2: Story = {
  args: {
    children: "Heading 2",
    as: "h2",
  },
};

export const H3: Story = {
  args: {
    children: "Heading 3",
    as: "h3",
  },
};

export const H4: Story = {
  args: {
    children: "Heading 4",
    as: "h4",
  },
};

export const H5: Story = {
  args: {
    children: "Heading 5",
    as: "h5",
  },
};

export const H6: Story = {
  args: {
    children: "Heading 6",
    as: "h6",
  },
};

export const WithCustomClass: Story = {
  args: {
    children: "Custom Styled Heading",
    as: "h1",
    className: "text-4xl text-green-600 underline",
  },
};

export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading as="h1">Heading Level 1</Heading>
      <Heading as="h2">Heading Level 2</Heading>
      <Heading as="h3">Heading Level 3</Heading>
      <Heading as="h4">Heading Level 4</Heading>
      <Heading as="h5">Heading Level 5</Heading>
      <Heading as="h6">Heading Level 6</Heading>
    </div>
  ),
};

export const LongText: Story = {
  args: {
    children:
      "This is a very long heading that demonstrates how the component handles longer text content",
    as: "h1",
  },
};
