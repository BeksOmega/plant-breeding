import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Picker from "./Picker";

const meta = {
  title: "Components/Picker",
  component: Picker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Visual style variant",
    },
    disabled: {
      control: "boolean",
      description: "Whether the picker is disabled",
    },
    onChange: {
      action: "changed",
      description: "Change handler",
    },
    options: {
      control: "object",
      description: "Array of options to cycle through",
    },
    value: {
      control: "number",
      description: "Current selected index",
    },
    width: {
      control: "text",
      description: "Fixed width of the component",
    },
  },
} satisfies Meta<typeof Picker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: ["Option 1", "Option 2", "Option 3"],
    value: 0,
    variant: "primary",
    disabled: false,
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Picker
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    );
  },
};

export const Primary: Story = {
  args: {
    options: ["Small", "Medium", "Large", "Extra Large"],
    value: 0,
    variant: "primary",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Picker
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    );
  },
};

export const Secondary: Story = {
  args: {
    options: ["Red", "Green", "Blue", "Yellow"],
    value: 0,
    variant: "secondary",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Picker
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    );
  },
};

export const DifferentLengths: Story = {
  args: {
    options: [
      "A",
      "Very Long Option Name",
      "Short",
      "Another Extremely Long Option That Should Not Shift",
    ],
    value: 0,
    variant: "primary",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Picker
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    );
  },
};

export const Disabled: Story = {
  args: {
    options: ["Option 1", "Option 2", "Option 3"],
    value: 1,
    variant: "primary",
    disabled: true,
  },
  render: (args) => {
    return <Picker {...args} />;
  },
};

export const OneOption: Story = {
  args: {
    options: ["Option 1"],
    value: 0,
    variant: "primary",
    disabled: false,
  },
};

export const AllVariants: Story = {
  args: {
    options: ["Option 1", "Option 2", "Option 3"],
    value: 0,
  },
  render: () => {
    const [primaryValue, setPrimaryValue] = useState(0);
    const [secondaryValue, setSecondaryValue] = useState(0);
    const [disabledValue, setDisabledValue] = useState(1);
    const [oneOptionValue, setOneOptionValue] = useState(0);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Picker
            variant="primary"
            options={["Option 1", "Option 2", "Option 3"]}
            value={primaryValue}
            onChange={setPrimaryValue}
          />
          <Picker
            variant="secondary"
            options={["Option 1", "Option 2", "Option 3"]}
            value={secondaryValue}
            onChange={setSecondaryValue}
          />
        </div>
        <div className="flex gap-4 items-center">
          <Picker
            variant="primary"
            options={["Option 1", "Option 2", "Option 3"]}
            value={disabledValue}
            onChange={setDisabledValue}
            disabled
          />
          <Picker
            variant="secondary"
            options={["Option 1", "Option 2", "Option 3"]}
            value={disabledValue}
            onChange={setDisabledValue}
            disabled
          />
        </div>
        <div className="flex gap-4 items-center">
          <Picker
            variant="primary"
            options={["Option 1"]}
            value={oneOptionValue}
            onChange={setOneOptionValue}
          />
        </div>
      </div>
    );
  },
};

export const CustomWidth: Story = {
  args: {
    options: ["Tiny", "Small", "Medium", "Large", "Extra Large"],
    value: 0,
    variant: "primary",
    width: "w-64",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Picker
        {...args}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    );
  },
};
