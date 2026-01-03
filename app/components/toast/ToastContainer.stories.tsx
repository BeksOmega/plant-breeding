import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ToastProvider, useToast } from "./ToastContainer";
import Button from "../controls/Button";

// Wrapper component that uses the toast hook
function ToastDemo() {
  const { showToast, removeToast } = useToast();
  const [toastIds, setToastIds] = useState<string[]>([]);

  const handleShowSimpleToast = () => {
    const id = showToast("Simple toast message");
    setToastIds((prev) => [...prev, id]);
  };

  const handleShowComplexToast = () => {
    const id = showToast(
      <div>
        <p className="font-bold">Plant Successfully Bred!</p>
        <p className="text-sm">New seed has been added to your inventory.</p>
      </div>
    );
    setToastIds((prev) => [...prev, id]);
  };

  const handleShowMultipleToasts = () => {
    showToast("First toast");
    setTimeout(() => showToast("Second toast"), 200);
    setTimeout(() => showToast("Third toast"), 400);
  };

  const handleRemoveLastToast = () => {
    if (toastIds.length > 0) {
      const lastId = toastIds[toastIds.length - 1];
      removeToast(lastId);
      setToastIds((prev) => prev.slice(0, -1));
    }
  };

  return (
    <div className="p-8 space-y-4">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Toast Controls</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleShowSimpleToast} variant="primary">
            Show Simple Toast
          </Button>
          <Button onClick={handleShowComplexToast} variant="primary">
            Show Complex Toast
          </Button>
          <Button onClick={handleShowMultipleToasts} variant="secondary">
            Show Multiple Toasts
          </Button>
          <Button
            onClick={handleRemoveLastToast}
            variant="secondary"
            disabled={toastIds.length === 0}
          >
            Remove Last Toast
          </Button>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: "Components/ToastContainer",
  component: ToastProvider,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => <ToastDemo />,
};

export const WithSimpleToast: Story = {
  args: {
    children: null,
  },
  render: () => {
    function SimpleToastDemo() {
      const { showToast } = useToast();
      return (
        <div className="p-8">
          <Button
            onClick={() => showToast("This is a simple toast message")}
            variant="primary"
          >
            Show Toast
          </Button>
        </div>
      );
    }
    return <SimpleToastDemo />;
  },
};

export const WithComplexContent: Story = {
  args: {
    children: null,
  },
  render: () => {
    function ComplexToastDemo() {
      const { showToast } = useToast();
      return (
        <div className="p-8">
          <Button
            onClick={() =>
              showToast(
                <div>
                  <p className="font-bold text-lg">Plant Successfully Bred!</p>
                  <p className="text-sm mt-1">
                    A new seed has been added to your inventory.
                  </p>
                </div>
              )
            }
            variant="primary"
          >
            Show Complex Toast
          </Button>
        </div>
      );
    }
    return <ComplexToastDemo />;
  },
};

export const MultipleToasts: Story = {
  args: {
    children: null,
  },
  render: () => {
    function MultipleToastsDemo() {
      const { showToast } = useToast();
      return (
        <div className="p-8 space-y-4">
          <Button
            onClick={() => {
              showToast("First toast notification");
              setTimeout(() => showToast("Second toast notification"), 300);
              setTimeout(() => showToast("Third toast notification"), 600);
            }}
            variant="primary"
          >
            Show Multiple Toasts
          </Button>
        </div>
      );
    }
    return <MultipleToastsDemo />;
  },
};

export const WithCustomDuration: Story = {
  args: {
    children: null,
  },
  render: () => {
    function CustomDurationDemo() {
      const { showToast } = useToast();
      return (
        <div className="p-8 space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Toasts auto-dismiss after the specified duration (default: 5s)
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => showToast("Quick toast (1s)", 1000)}
                variant="primary"
              >
                Show 1s Toast
              </Button>
              <Button
                onClick={() => showToast("Default toast (5s)", 5000)}
                variant="primary"
              >
                Show 5s Toast
              </Button>
              <Button
                onClick={() => showToast("Long toast (10s)", 10000)}
                variant="secondary"
              >
                Show 10s Toast
              </Button>
              <Button
                onClick={() =>
                  showToast("Permanent toast (no auto-dismiss)", 0)
                }
                variant="secondary"
              >
                Show Permanent Toast
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return <CustomDurationDemo />;
  },
};

export const WithoutAnimation: Story = {
  args: {
    children: null,
  },
  render: () => {
    function NoAnimationDemo() {
      const { showToast } = useToast();
      return (
        <div className="p-8 space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Toasts can be shown without animation by passing disableAnimation
              as the third parameter
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() =>
                  showToast("Toast with animation (default)", 5000, false)
                }
                variant="primary"
              >
                Show Animated Toast
              </Button>
              <Button
                onClick={() => showToast("Toast without animation", 5000, true)}
                variant="secondary"
              >
                Show Non-Animated Toast
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return <NoAnimationDemo />;
  },
};
