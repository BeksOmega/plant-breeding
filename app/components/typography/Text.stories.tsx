import type { Meta, StoryObj } from '@storybook/react';
import Text from './Text';

const meta = {
  title: 'Typography/Text',
  component: Text,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The text content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is text using the Rajdhani font family without bottom margin.',
  },
};

export const Short: Story = {
  args: {
    children: 'Short text.',
  },
};

export const Long: Story = {
  args: {
    children:
      'This is a longer text that demonstrates how the component handles extended content. It shows how the Rajdhani font family renders across multiple lines and provides a good example of readability and typography in the plant breeding application.',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'This text has custom styling applied.',
    className: 'text-lg text-blue-600 font-bold',
  },
};

export const MultipleText: Story = {
  render: () => (
    <div>
      <Text>
        This is the first text. It introduces the topic and provides
        context for the following content.
      </Text>
      <Text>
        This is the second text. Notice there's no bottom margin between these
        text elements.
      </Text>
      <Text>
        This is the third text. It concludes the section and summarizes
        the key points.
      </Text>
    </div>
  ),
};

export const WithSpecialCharacters: Story = {
  args: {
    children:
      'This text contains special characters: ATGC, 50%, $100, & more!',
  },
};

export const WithLinks: Story = {
  render: () => (
    <Text>
      This text contains{' '}
      <a href="#" className="text-blue-500 underline">
        a link
      </a>{' '}
      to demonstrate how the component works with inline elements.
    </Text>
  ),
};

