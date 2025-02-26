import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { Button } from './button';
import { CalendarDays, Mail } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';

const meta = {
  title: 'UI/HoverCard',
  component: HoverCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof HoverCard>;

// Basic HoverCard
export const Basic: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">Hover over me</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Basic Hover Card</h4>
          <p className="text-sm">
            This is a basic hover card that appears when you hover over the trigger.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// User Profile Card
export const UserProfile: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@shadcn</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@shadcn</h4>
            <p className="text-sm">
              The creator of this amazing UI component library.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs text-muted-foreground">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// Feature Preview
export const FeaturePreview: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button>New Features</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">✨ New Features</h4>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span>Improved performance</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span>Dark mode support</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            <span>New components added</span>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

// Contact Card
export const ContactCard: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Mail className="h-4 w-4" />
          Contact
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Contact Information</h4>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Email:</strong> example@email.com
            </p>
            <p>
              <strong>Phone:</strong> (555) 123-4567
            </p>
            <p>
              <strong>Location:</strong> San Francisco, CA
            </p>
          </div>
          <div className="pt-2">
            <Button variant="secondary" className="w-full text-xs">
              Send Message
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}; 