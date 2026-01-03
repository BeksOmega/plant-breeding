import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Pot from "./Pot";
import ShepherdsSpindel from "./plants/ShepherdsSpindel";
import { PlantGenetics } from "../types/genetics";
import { PlantType } from "../types/seed";

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
        <ShepherdsSpindel
          genetics={sampleGenetics}
          plantType={PlantType.ShepherdsSpindel}
        />
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
            <ShepherdsSpindel
              genetics={genetics1}
              plantType={PlantType.ShepherdsSpindel}
            />
          </Pot>
        </div>
        <div className="w-32 h-32">
          <Pot isEmpty={false}>
            <ShepherdsSpindel
              genetics={genetics2}
              plantType={PlantType.ShepherdsSpindel}
            />
          </Pot>
        </div>
        <div className="w-32 h-32">
          <Pot isEmpty={false}>
            <ShepherdsSpindel
              genetics={genetics3}
              plantType={PlantType.ShepherdsSpindel}
            />
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
            <ShepherdsSpindel
              genetics={sampleGenetics}
              plantType={PlantType.ShepherdsSpindel}
            />
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
        <ShepherdsSpindel
          genetics={sampleGenetics}
          plantType={PlantType.ShepherdsSpindel}
        />
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
              plantType={PlantType.ShepherdsSpindel}
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
              plantType={PlantType.ShepherdsSpindel}
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
              plantType={PlantType.ShepherdsSpindel}
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
        <ShepherdsSpindel
          genetics={sampleGenetics}
          plantType={PlantType.ShepherdsSpindel}
          showGenotype={true}
        />
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
              <ShepherdsSpindel
                genetics={gen}
                plantType={PlantType.ShepherdsSpindel}
              />
            </Pot>
          </div>
        ))}
      </div>
    );
  },
};

export const GrowingPlant: Story = {
  render: () => {
    const startTime = Date.now();
    return (
      <div className="w-32 h-32">
        <Pot isEmpty={false}>
          <ShepherdsSpindel
            genetics={sampleGenetics}
            plantType={PlantType.ShepherdsSpindel}
            startGrowingAt={startTime}
          />
        </Pot>
      </div>
    );
  },
};

export const PartiallyGrown: Story = {
  render: () => {
    // Start growth 3 seconds ago (30% complete)
    const startTime = Date.now() - 3000;
    return (
      <div className="w-32 h-32">
        <Pot isEmpty={false}>
          <ShepherdsSpindel
            genetics={sampleGenetics}
            plantType={PlantType.ShepherdsSpindel}
            startGrowingAt={startTime}
          />
        </Pot>
      </div>
    );
  },
};

export const AlmostGrown: Story = {
  render: () => {
    // Start growth 8 seconds ago (80% complete)
    const startTime = Date.now() - 8000;
    return (
      <div className="w-32 h-32">
        <Pot isEmpty={false}>
          <ShepherdsSpindel
            genetics={sampleGenetics}
            plantType={PlantType.ShepherdsSpindel}
            startGrowingAt={startTime}
          />
        </Pot>
      </div>
    );
  },
};

export const FullyGrown: Story = {
  render: () => {
    // Plant started growing more than 10 seconds ago (fully grown, no progress bar)
    const startTime = Date.now() - 15000;
    return (
      <div className="w-32 h-32">
        <Pot isEmpty={false}>
          <ShepherdsSpindel
            genetics={sampleGenetics}
            plantType={PlantType.ShepherdsSpindel}
            startGrowingAt={startTime}
          />
        </Pot>
      </div>
    );
  },
};

export const MultipleGrowthStages: Story = {
  render: () => {
    const now = Date.now();
    const stages = [
      { label: "Just planted", startTime: now },
      { label: "25% grown", startTime: now - 2500 },
      { label: "50% grown", startTime: now - 5000 },
      { label: "75% grown", startTime: now - 7500 },
      { label: "Fully grown", startTime: now - 12000 },
    ];

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-5 gap-4">
          {stages.map((stage, index) => (
            <div key={index} className="w-32">
              <div className="mb-2 text-xs text-center text-gray-600">
                {stage.label}
              </div>
              <Pot isEmpty={false}>
                <ShepherdsSpindel
                  genetics={sampleGenetics}
                  plantType={PlantType.ShepherdsSpindel}
                  startGrowingAt={stage.startTime}
                />
              </Pot>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
