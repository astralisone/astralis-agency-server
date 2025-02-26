import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { Label } from './label';
import React from 'react';

const meta = {
  title: 'UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

// Basic Switch
export const Basic: Story = {
  render: () => <Switch />,
};

// With Label
export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

// Disabled States
export const DisabledStates: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Disabled (Unchecked)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Disabled (Checked)</Label>
      </div>
    </div>
  ),
};

// Controlled Switch
export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="controlled"
          checked={checked}
          onCheckedChange={setChecked}
        />
        <Label htmlFor="controlled">
          {checked ? 'Enabled' : 'Disabled'}
        </Label>
      </div>
    );
  },
};

// Form Example
export const FormExample: Story = {
  render: () => {
    const [settings, setSettings] = React.useState({
      notifications: true,
      newsletter: false,
      offers: true,
    });

    return (
      <form className="w-[300px] space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications" className="flex-1">
            Enable notifications
          </Label>
          <Switch
            id="notifications"
            checked={settings.notifications}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, notifications: checked }))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="newsletter" className="flex-1">
            Subscribe to newsletter
          </Label>
          <Switch
            id="newsletter"
            checked={settings.newsletter}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, newsletter: checked }))
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="offers" className="flex-1">
            Receive special offers
          </Label>
          <Switch
            id="offers"
            checked={settings.offers}
            onCheckedChange={(checked) =>
              setSettings((prev) => ({ ...prev, offers: checked }))
            }
          />
        </div>
      </form>
    );
  },
};

// With Description
export const WithDescription: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-2">
        <Switch id="dark-mode" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="dark-mode">Dark mode</Label>
          <p className="text-sm text-muted-foreground">
            Turn on dark mode to reduce eye strain
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        <Switch id="backup" defaultChecked />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="backup">Automatic backup</Label>
          <p className="text-sm text-muted-foreground">
            Backup your data every 24 hours
          </p>
        </div>
      </div>
    </div>
  ),
}; 