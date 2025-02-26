import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import { Check, X, AlertCircle, Clock } from 'lucide-react';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

// Default Badge
export const Default: Story = {
  render: () => <Badge>Default</Badge>,
};

// All Variants
export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

// With Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge className="gap-1">
        <Check className="h-3 w-3" /> Success
      </Badge>
      <Badge variant="destructive" className="gap-1">
        <X className="h-3 w-3" /> Error
      </Badge>
      <Badge variant="secondary" className="gap-1">
        <AlertCircle className="h-3 w-3" /> Warning
      </Badge>
      <Badge variant="outline" className="gap-1">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    </div>
  ),
};

// Status Badges
export const Status: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      <Badge className="bg-red-500 hover:bg-red-600">Inactive</Badge>
      <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>
    </div>
  ),
};

// Notification Badges
export const Notifications: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div className="relative">
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
          3
        </Badge>
        <div className="h-10 w-10 bg-slate-200 rounded-full" />
      </div>
      <div className="relative">
        <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
          5
        </Badge>
        <div className="h-10 w-10 bg-slate-200 rounded-full" />
      </div>
    </div>
  ),
};

// Custom Styled
export const CustomStyled: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
        Premium
      </Badge>
      <Badge className="border-2 border-purple-500 bg-transparent text-purple-500 hover:bg-purple-500 hover:text-white">
        Pro
      </Badge>
      <Badge className="rounded-lg px-3 py-1">Custom Shape</Badge>
    </div>
  ),
}; 