import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Pot from "./Pot";
import ShepherdsSpindel from "./plants/ShepherdsSpindel";
import { PlantGenetics } from "../types/genetics";

// Sample genetics data for stories
const sampleGenetics: PlantGenetics = {
  chromosome1: [true, false, true, false, true],
  chromosome2: [false, true, false, true, false],
};

const meta = {
  title: "Components/Plants in Pots",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const SinglePlant: Story = {
  render: () => (
    <div className="w-32 h-32">
      <Pot isEmpty={false}>
        <ShepherdsSpindel genetics={sampleGenetics} />
      </Pot>
    </div>
  ),
};

export const MultiplePlants: Story = {
  render: () => {
    const genetics1: PlantGenetics = {
      chromosome1: [true, true, true],
      chromosome2: [true, true, true],
    };
    const genetics2: PlantGenetics = {
      chromosome1: [false, false, false],
      chromosome2: [false, false, false],
    };
    const genetics3: PlantGenetics = {
      chromosome1: [true, false, true, false],
      chromosome2: [true, false, true, false],
    };

    return (
      <div className="flex gap-4">
        <div className="w-32 h-32">
          <Pot isEmpty={false}>
            <ShepherdsSpindel genetics={genetics1} />
          </Pot>
        </div>
        <div className="w-32 h-32">
          <Pot isEmpty={false}>
            <ShepherdsSpindel genetics={genetics2} />
          </Pot>
        </div>
        <div className="w-32 h-32">
          <Pot isEmpty={false}>
            <ShepherdsSpindel genetics={genetics3} />
          </Pot>
        </div>
      </div>
    );
  },
};

export const WithEmptyPots: Story = {
  render: () => {
    return (
      <div className="flex gap-4">
        <div className="w-32 h-32">
          <Pot isEmpty={true} />
        </div>
        <div className="w-32 h-32">
          <Pot isEmpty={false}>
            <ShepherdsSpindel genetics={sampleGenetics} />
          </Pot>
        </div>
        <div className="w-32 h-32">
          <Pot isEmpty={true} />
        </div>
      </div>
    );
  },
};

export const SelectedPlant: Story = {
  render: () => (
    <div className="w-32 h-32">
      <Pot isEmpty={false} isSelected={true}>
        <ShepherdsSpindel genetics={sampleGenetics} />
      </Pot>
    </div>
  ),
};

export const InteractiveSelection: Story = {
  render: () => {
    const [selectedPot, setSelectedPot] = useState<number | null>(null);
    const [selectedPlant, setSelectedPlant] = useState<number | null>(null);

    const genetics1: PlantGenetics = {
      chromosome1: [true, true, true],
      chromosome2: [true, true, true],
    };
    const genetics2: PlantGenetics = {
      chromosome1: [false, false, false],
      chromosome2: [false, false, false],
    };
    const genetics3: PlantGenetics = {
      chromosome1: [true, false, true, false],
      chromosome2: [true, false, true, false],
    };

    return (
      <div className="flex gap-4">
        <div className="w-32 h-32">
          <Pot
            isEmpty={false}
            isSelected={selectedPot === 0}
            onSelect={(selected) => setSelectedPot(selected ? 0 : null)}
          >
            <ShepherdsSpindel
              genetics={genetics1}
              isSelected={selectedPlant === 0}
              onSelect={(selected) => setSelectedPlant(selected ? 0 : null)}
            />
          </Pot>
        </div>
        <div className="w-32 h-32">
          <Pot
            isEmpty={false}
            isSelected={selectedPot === 1}
            onSelect={(selected) => setSelectedPot(selected ? 1 : null)}
          >
            <ShepherdsSpindel
              genetics={genetics2}
              isSelected={selectedPlant === 1}
              onSelect={(selected) => setSelectedPlant(selected ? 1 : null)}
            />
          </Pot>
        </div>
        <div className="w-32 h-32">
          <Pot
            isEmpty={false}
            isSelected={selectedPot === 2}
            onSelect={(selected) => setSelectedPot(selected ? 2 : null)}
          >
            <ShepherdsSpindel
              genetics={genetics3}
              isSelected={selectedPlant === 2}
              onSelect={(selected) => setSelectedPlant(selected ? 2 : null)}
            />
          </Pot>
        </div>
      </div>
    );
  },
};

export const WithGenotype: Story = {
  render: () => (
    <div className="w-32 h-32">
      <Pot isEmpty={false}>
        <ShepherdsSpindel genetics={sampleGenetics} showGenotype={true} />
      </Pot>
    </div>
  ),
};

export const GridLayout: Story = {
  render: () => {
    const genetics: PlantGenetics[] = [
      {
        chromosome1: [true, true, true],
        chromosome2: [true, true, true],
      },
      {
        chromosome1: [false, false, false],
        chromosome2: [false, false, false],
      },
      {
        chromosome1: [true, false, true],
        chromosome2: [false, true, false],
      },
      {
        chromosome1: [true, true, false],
        chromosome2: [false, false, true],
      },
      {
        chromosome1: [false, true, true],
        chromosome2: [true, false, false],
      },
      {
        chromosome1: [true, false, false],
        chromosome2: [false, true, true],
      },
    ];

    return (
      <div className="grid grid-cols-3 gap-4">
        {genetics.map((gen, index) => (
          <div key={index} className="w-32">
            <Pot isEmpty={false}>
              <ShepherdsSpindel genetics={gen} />
            </Pot>
          </div>
        ))}
      </div>
    );
  },
};
