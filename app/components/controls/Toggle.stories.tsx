import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Toggle from "./Toggle";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
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
    checked: {
      control: "boolean",
      description: "Whether the toggle is checked",
    },
    disabled: {
      control: "boolean",
      description: "Whether the toggle is disabled",
    },
    onChange: {
      action: "changed",
      description: "Change handler",
    },
    offLabel: {
      control: "text",
      description: "Label text for the 'off' state (left side)",
    },
    onLabel: {
      control: "text",
      description: "Label text for the 'on' state (right side)",
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    variant: "primary",
    disabled: false,
  },
  render: (args) => {
    const [checked, setChecked] = useState(args.checked);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Checked: Story = {
  args: {
    variant: "primary",
  },
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};

export const Disabled: Story = {
  args: {
    variant: "primary",
    disabled: true,
  },
  render: (args) => {
    return <Toggle {...args} checked={false} />;
  },
};

export const DisabledChecked: Story = {
  args: {
    variant: "primary",
    disabled: true,
  },
  render: (args) => {
    return <Toggle {...args} checked={true} />;
  },
};

export const AllVariants: Story = {
  render: () => {
    const [primaryChecked, setPrimaryChecked] = useState(false);
    const [secondaryChecked, setSecondaryChecked] = useState(false);
    const [disabledUnchecked, setDisabledUnchecked] = useState(false);
    const [disabledChecked, setDisabledChecked] = useState(true);

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <Toggle
            variant="primary"
            checked={primaryChecked}
            onChange={setPrimaryChecked}
          />
          <Toggle
            variant="secondary"
            checked={secondaryChecked}
            onChange={setSecondaryChecked}
          />
        </div>
        <div className="flex gap-4 items-center">
          <Toggle
            variant="primary"
            disabled
            checked={disabledUnchecked}
            onChange={setDisabledUnchecked}
          />
          <Toggle
            variant="secondary"
            disabled
            checked={disabledChecked}
            onChange={setDisabledChecked}
          />
        </div>
      </div>
    );
  },
};

export const CustomLabels: Story = {
  args: {
    variant: "primary",
    onLabel: "Plant",
    offLabel: "Seed",
  },
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Toggle {...args} checked={checked} onChange={setChecked} />;
  },
};
