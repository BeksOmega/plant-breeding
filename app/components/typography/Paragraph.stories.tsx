import type { Meta, StoryObj } from '@storybook/react';
import Paragraph from './Paragraph';

const meta = {
  title: 'Typography/Paragraph',
  component: Paragraph,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The paragraph text content',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Paragraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'This is a paragraph of text using the Rajdhani font family.',
  },
};

export const Short: Story = {
  args: {
    children: 'Short paragraph.',
  },
};

export const Long: Story = {
  args: {
    children:
      'This is a longer paragraph that demonstrates how the component handles extended text content. It shows how the Rajdhani font family renders across multiple lines and provides a good example of readability and typography in the plant breeding application.',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'This paragraph has custom styling applied.',
    className: 'text-lg text-blue-600 font-bold',
  },
};

export const MultipleParagraphs: Story = {
  args: {
    children: 'Paragraph text',
  },
  render: () => (
    <div className="space-y-4">
      <Paragraph>
        This is the first paragraph. It introduces the topic and provides
        context for the following content.
      </Paragraph>
      <Paragraph>
        This is the second paragraph. It continues the discussion and expands
        on the ideas presented in the first paragraph.
      </Paragraph>
      <Paragraph>
        This is the third paragraph. It concludes the section and summarizes
        the key points.
      </Paragraph>
    </div>
  ),
};

export const WithSpecialCharacters: Story = {
  args: {
    children:
      'This paragraph contains special characters: ATGC, 50%, $100, & more!',
  },
};

export const WithLinks: Story = {
  args: {
    children: 'Paragraph text',
  },
  render: () => (
    <Paragraph>
      This paragraph contains{' '}
      <a href="#" className="text-blue-500 underline">
        a link
      </a>{' '}
      to demonstrate how the component works with inline elements.
    </Paragraph>
  ),
};


