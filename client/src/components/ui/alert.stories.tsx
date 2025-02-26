import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { Terminal, AlertCircle, Info } from 'lucide-react';

const meta = {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

// Default Alert
export const Default: Story = {
  render: () => (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>
        This is a default alert providing information to the user.
      </AlertDescription>
    </Alert>
  ),
};

// Success Alert
export const Success: Story = {
  render: () => (
    <Alert className="border-green-500 text-green-700">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Successfully Deployed</AlertTitle>
      <AlertDescription>
        Your application has been successfully deployed to production.
      </AlertDescription>
    </Alert>
  ),
};

// Destructive Alert
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again to continue.
      </AlertDescription>
    </Alert>
  ),
};

// Simple Alert
export const Simple: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the cli.
      </AlertDescription>
    </Alert>
  ),
};

// With Custom Icon
export const WithCustomIcon: Story = {
  render: () => (
    <Alert className="border-blue-500">
      <Info className="h-4 w-4 text-blue-500" />
      <AlertTitle className="text-blue-500">Pro Tip</AlertTitle>
      <AlertDescription className="text-blue-700">
        You can customize the appearance of alerts using Tailwind CSS classes.
      </AlertDescription>
    </Alert>
  ),
}; 