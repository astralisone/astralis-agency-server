import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import React from 'react';

const meta = {
  title: 'UI/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof RadioGroup>;

// Basic Radio Group
export const Basic: Story = {
  render: () => (
    <RadioGroup defaultValue="option-one">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Option One</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Option Two</Label>
      </div>
    </RadioGroup>
  ),
};

// With Descriptions
export const WithDescriptions: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" className="space-y-4">
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="default" id="default" className="mt-1" />
        <div>
          <Label htmlFor="default">Default</Label>
          <p className="text-sm text-muted-foreground">
            System default spacing and density
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="comfortable" id="comfortable" className="mt-1" />
        <div>
          <Label htmlFor="comfortable">Comfortable</Label>
          <p className="text-sm text-muted-foreground">
            Increased spacing for better readability
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <RadioGroupItem value="compact" id="compact" className="mt-1" />
        <div>
          <Label htmlFor="compact">Compact</Label>
          <p className="text-sm text-muted-foreground">
            Reduced spacing to show more content
          </p>
        </div>
      </div>
    </RadioGroup>
  ),
};

// Controlled Radio Group
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('light');
    return (
      <div className="space-y-4">
        <RadioGroup value={value} onValueChange={setValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="light" id="light" />
            <Label htmlFor="light">Light Theme</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="dark" id="dark" />
            <Label htmlFor="dark">Dark Theme</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="system" id="system" />
            <Label htmlFor="system">System Theme</Label>
          </div>
        </RadioGroup>
        <div className="text-sm text-muted-foreground">
          Selected value: {value}
        </div>
      </div>
    );
  },
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <form className="w-[400px] space-y-6">
      <div>
        <Label>Notification Preferences</Label>
        <RadioGroup defaultValue="all" className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all">All notifications</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="important" id="important" />
            <Label htmlFor="important">Important only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <Label htmlFor="none">No notifications</Label>
          </div>
        </RadioGroup>
      </div>
      <div>
        <Label>Privacy Settings</Label>
        <RadioGroup defaultValue="public" className="mt-2 space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="public" id="public" />
            <Label htmlFor="public">Public profile</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="private" id="private" />
            <Label htmlFor="private">Private profile</Label>
          </div>
        </RadioGroup>
      </div>
    </form>
  ),
};

// Disabled State
export const DisabledState: Story = {
  render: () => (
    <RadioGroup defaultValue="option-two" disabled className="space-y-2">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="disabled-1" />
        <Label htmlFor="disabled-1" className="text-muted-foreground">
          Disabled Option One
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="disabled-2" />
        <Label htmlFor="disabled-2" className="text-muted-foreground">
          Disabled Option Two
        </Label>
      </div>
    </RadioGroup>
  ),
}; 