import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof Accordion>;

// Basic Accordion
export const Basic: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match your theme.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Multiple Sections Open
export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-[400px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>First Section</AccordionTrigger>
        <AccordionContent>
          This is the first section's content. Multiple sections can be open at once.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Second Section</AccordionTrigger>
        <AccordionContent>
          This is the second section's content. Try opening multiple sections!
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Third Section</AccordionTrigger>
        <AccordionContent>
          This is the third section's content. All sections can be open simultaneously.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// FAQ Style
export const FAQ: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[600px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          How do I get started with your service?
        </AccordionTrigger>
        <AccordionContent>
          Getting started is easy! Simply sign up for an account, choose your plan,
          and follow our quick setup guide. Our support team is always available to
          help if you need assistance.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          What payment methods do you accept?
        </AccordionTrigger>
        <AccordionContent>
          We accept all major credit cards (Visa, MasterCard, American Express),
          PayPal, and bank transfers. All payments are processed securely through
          our payment partners.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          Can I cancel my subscription at any time?
        </AccordionTrigger>
        <AccordionContent>
          Yes, you can cancel your subscription at any time. There are no long-term
          contracts or cancellation fees. Simply go to your account settings and
          follow the cancellation process.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

// Custom Styled
export const CustomStyled: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-[400px]">
      <AccordionItem value="item-1" className="border rounded-lg mb-2">
        <AccordionTrigger className="px-4">
          Custom Styled Section
        </AccordionTrigger>
        <AccordionContent className="px-4">
          This accordion has custom styling with rounded corners and spacing.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" className="border rounded-lg mb-2">
        <AccordionTrigger className="px-4">
          Another Custom Section
        </AccordionTrigger>
        <AccordionContent className="px-4">
          Each section is individually styled with a border and margin.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3" className="border rounded-lg">
        <AccordionTrigger className="px-4">
          Final Custom Section
        </AccordionTrigger>
        <AccordionContent className="px-4">
          The custom styling makes this accordion stand out from the default design.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}; 