import type { Meta, StoryObj } from '@storybook/react';
import Heading from './Heading';
import Paragraph from './Paragraph';

const meta = {
  title: 'Typography/All Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AllHeadingsAndParagraphs: Story = {
  render: () => (
    <div className="space-y-6 max-w-4xl">
      <Heading as="h1">Main Title: Plant Breeding Guide</Heading>
      <Paragraph>
        This is an introductory paragraph that follows the main heading. It
        provides context and sets the stage for the content that follows. Plant
        breeding is a fascinating field that combines genetics, agriculture, and
        innovation to develop new varieties of plants.
      </Paragraph>

      <Heading as="h2">Chapter 1: Understanding Genetics</Heading>
      <Paragraph>
        This paragraph explains the fundamentals of genetics in plant breeding.
        Understanding how traits are inherited is crucial for successful
        breeding programs. Genetic principles help breeders predict outcomes and
        make informed decisions.
      </Paragraph>
      <Paragraph>
        Another paragraph in this section that continues to explore the topic.
        It provides additional details and examples to help readers understand
        the concepts being discussed.
      </Paragraph>

      <Heading as="h3">Section 1.1: Mendelian Inheritance</Heading>
      <Paragraph>
        This subsection delves into Mendelian inheritance patterns. Gregor
        Mendel's work with pea plants laid the foundation for modern genetics.
        His principles of segregation and independent assortment are still
        relevant today.
      </Paragraph>

      <Heading as="h4">Subsection 1.1.1: Dominant and Recessive Traits</Heading>
      <Paragraph>
        This paragraph discusses dominant and recessive traits. Understanding
        these concepts is essential for predicting the characteristics of
        offspring in breeding programs.
      </Paragraph>

      <Heading as="h5">Key Points</Heading>
      <Paragraph>
        This is a paragraph under a smaller heading. It highlights important
        points that readers should remember. These key points help summarize
        complex information.
      </Paragraph>

      <Heading as="h6">Additional Notes</Heading>
      <Paragraph>
        This is the smallest heading level, used for minor notes or
        supplementary information. It's followed by a paragraph that provides
        additional context or details that might be useful but not essential.
      </Paragraph>

      <Heading as="h2">Chapter 2: Breeding Techniques</Heading>
      <Paragraph>
        This chapter covers various breeding techniques used in modern plant
        breeding. From traditional methods to advanced genetic engineering,
        breeders have many tools at their disposal.
      </Paragraph>

      <Heading as="h3">Section 2.1: Cross-Pollination</Heading>
      <Paragraph>
        Cross-pollination is one of the most common breeding techniques. It
        involves transferring pollen from one plant to another to create new
        genetic combinations.
      </Paragraph>

      <Heading as="h3">Section 2.2: Selection Methods</Heading>
      <Paragraph>
        Selection methods help breeders identify and propagate desirable traits.
        This process involves careful observation and documentation of plant
        characteristics over multiple generations.
      </Paragraph>
    </div>
  ),
};

