import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
      description: 'The type of input',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

// Basic text input
export const Default: Story = {
  args: {
    type: 'text',
    placeholder: 'Enter text...',
  },
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Enter your email" />
    </div>
  ),
};

// Password Input
export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

// Disabled Input
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    value: 'Disabled value',
  },
};

// File Input
export const File: Story = {
  args: {
    type: 'file',
  },
};

// Number Input
export const Number: Story = {
  args: {
    type: 'number',
    placeholder: 'Enter a number',
  },
};

// Search Input
export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <form className="grid w-full max-w-sm items-center gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="username">Username</Label>
        <Input id="username" placeholder="Enter username" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input type="password" id="password" placeholder="Enter password" />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Enter email" />
      </div>
    </form>
  ),
};

// Error State
export const Error: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="error">Error Input</Label>
      <Input
        type="email"
        id="error"
        placeholder="Enter email"
        className="border-red-500 focus-visible:ring-red-500"
      />
      <p className="text-sm text-red-500">Please enter a valid email address</p>
    </div>
  ),
}; 