import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'UI/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof Separator>;

// Basic Horizontal Separator
export const Horizontal: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Notifications</h4>
        <p className="text-sm text-muted-foreground">
          Manage your notification preferences
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Account</div>
        <Separator orientation="vertical" />
        <div>Settings</div>
        <Separator orientation="vertical" />
        <div>Messages</div>
      </div>
    </div>
  ),
};

// Vertical Separator
export const Vertical: Story = {
  render: () => (
    <div className="flex h-[150px] items-center">
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Left Content</h4>
        <p className="text-sm text-muted-foreground">Some details here</p>
      </div>
      <Separator orientation="vertical" className="mx-8 h-full" />
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Right Content</h4>
        <p className="text-sm text-muted-foreground">More details here</p>
      </div>
    </div>
  ),
};

// List Separator
export const ListSeparator: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      {['Profile', 'Settings', 'Messages', 'Support', 'Logout'].map((item, i) => (
        <div key={item}>
          <div className="text-sm">{item}</div>
          {i < 4 && <Separator className="mt-4" />}
        </div>
      ))}
    </div>
  ),
};

// Custom Styled
export const CustomStyled: Story = {
  render: () => (
    <div className="w-[300px] space-y-4">
      <Separator className="bg-primary" />
      <Separator className="bg-destructive" />
      <Separator className="bg-green-500" />
      <Separator className="bg-blue-500" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Left</div>
        <Separator orientation="vertical" className="bg-primary" />
        <div>Middle</div>
        <Separator orientation="vertical" className="bg-destructive" />
        <div>Right</div>
      </div>
    </div>
  ),
};

// Section Divider
export const SectionDivider: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Section 1</h2>
        <p className="text-sm text-muted-foreground">
          This is the first section of content
        </p>
      </div>
      <Separator className="my-6" />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Section 2</h2>
        <p className="text-sm text-muted-foreground">
          This is the second section of content
        </p>
      </div>
      <Separator className="my-6" />
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Section 3</h2>
        <p className="text-sm text-muted-foreground">
          This is the third section of content
        </p>
      </div>
    </div>
  ),
}; 