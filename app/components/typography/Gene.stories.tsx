import type { Meta, StoryObj } from '@storybook/react';
import Gene from './Gene';

const meta = {
  title: 'Typography/Gene',
  component: Gene,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'The text content to display',
    },
    as: {
      control: 'select',
      options: ['span', 'div', 'p'],
      description: 'The HTML element to render as',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof Gene>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'ATCG',
  },
};

export const AsSpan: Story = {
  args: {
    children: 'ATCG',
    as: 'span',
  },
};

export const AsDiv: Story = {
  args: {
    children: 'ATCG',
    as: 'div',
  },
};

export const AsParagraph: Story = {
  args: {
    children: 'ATCG',
    as: 'p',
  },
};

export const LongSequence: Story = {
  args: {
    children: 'ATCGATCGATCGATCGATCGATCG',
    as: 'span',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: 'ATCG',
    className: 'text-2xl text-blue-500',
  },
};

export const MultipleGenes: Story = {
  render: () => (
    <div className="space-y-2">
      <Gene>ATCG</Gene>
      <Gene>GCTA</Gene>
      <Gene>TTAA</Gene>
      <Gene>CGGC</Gene>
    </div>
  ),
};


