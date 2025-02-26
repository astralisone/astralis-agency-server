import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './textarea';
import { Label } from './label';

const meta = {
  title: 'UI/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    rows: {
      control: 'number',
      description: 'Number of visible text lines',
    },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

// Basic Textarea
export const Basic: Story = {
  args: {
    placeholder: 'Type your message here.',
  },
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea
        id="message"
        placeholder="Type your message here."
      />
    </div>
  ),
};

// Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'You cannot type here.',
    value: 'This textarea is disabled.',
  },
};

// With Default Value
export const WithValue: Story = {
  args: {
    value: 'This is some default text that can be edited.',
  },
};

// Custom Height
export const CustomHeight: Story = {
  args: {
    placeholder: 'This textarea has 10 visible lines.',
    rows: 10,
  },
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <form className="w-full max-w-sm space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Title</Label>
        <Textarea
          id="title"
          placeholder="Enter a title..."
          className="h-10"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter a detailed description..."
          rows={5}
        />
      </div>
    </form>
  ),
};

// Error State
export const Error: Story = {
  render: () => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="error">Error message</Label>
      <Textarea
        id="error"
        placeholder="Type your message here."
        className="border-red-500 focus-visible:ring-red-500"
      />
      <p className="text-sm text-red-500">This field is required.</p>
    </div>
  ),
}; 