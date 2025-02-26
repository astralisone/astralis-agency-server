import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from './label';
import React from 'react';

const meta = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof Checkbox>;

// Basic Checkbox
export const Basic: Story = {
  render: () => <Checkbox />,
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

// Disabled States
export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Disabled (Unchecked)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Disabled (Checked)</Label>
      </div>
    </div>
  ),
};

// Controlled Checkbox
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id="controlled"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Label htmlFor="controlled">
          {checked ? 'Checked' : 'Unchecked'}
        </Label>
      </div>
    );
  },
};

// Form Example
export const FormExample: Story = {
  render: () => {
    const [preferences, setPreferences] = React.useState({
      emails: true,
      offers: false,
      updates: true,
    });

    return (
      <form className="w-[300px] space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="emails"
            checked={preferences.emails}
            onCheckedChange={(checked) =>
              setPreferences((prev) => ({ ...prev, emails: checked === true }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="emails">Marketing emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about new products and features.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="offers"
            checked={preferences.offers}
            onCheckedChange={(checked) =>
              setPreferences((prev) => ({ ...prev, offers: checked === true }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="offers">Special offers</Label>
            <p className="text-sm text-muted-foreground">
              Receive special offers and discounts.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="updates"
            checked={preferences.updates}
            onCheckedChange={(checked) =>
              setPreferences((prev) => ({ ...prev, updates: checked === true }))
            }
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="updates">Product updates</Label>
            <p className="text-sm text-muted-foreground">
              Get notified about product updates.
            </p>
          </div>
        </div>
      </form>
    );
  },
};

// Terms and Conditions
export const TermsAndConditions: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox id="terms1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms1">Accept terms and conditions</Label>
          <p className="text-sm text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="terms2" defaultChecked />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms2">Remember me</Label>
          <p className="text-sm text-muted-foreground">
            Save your login information for next time.
          </p>
        </div>
      </div>
    </div>
  ),
}; 