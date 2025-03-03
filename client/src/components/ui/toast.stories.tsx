import type { Meta, StoryObj } from '@storybook/react';
import {
  Toast,
  ToastAction,
  ToastProvider,
  ToastViewport,
} from './toast';
import { Button } from './button';
import { useToast } from './use-toast';

const meta = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <ToastViewport />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;

// Basic Toast
export const Basic: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() =>
          toast({
            title: 'Toast Title',
            description: 'Toast Description',
          })
        }
      >
        Show Toast
      </Button>
    );
  },
};

// Success Toast
export const Success: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() =>
          toast({
            title: 'Success!',
            description: 'Your action was completed successfully.',
            className: 'bg-green-600 text-white',
          })
        }
      >
        Show Success Toast
      </Button>
    );
  },
};

// Error Toast
export const Error: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        variant="destructive"
        onClick={() =>
          toast({
            variant: 'destructive',
            title: 'Error!',
            description: 'There was a problem with your request.',
          })
        }
      >
        Show Error Toast
      </Button>
    );
  },
};

// With Action
export const WithAction: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() =>
          toast({
            title: 'Scheduled: Catch up',
            description: 'Friday, February 24th at 5:30pm',
            action: (
              <ToastAction altText="View schedule">View schedule</ToastAction>
            ),
          })
        }
      >
        Show Toast with Action
      </Button>
    );
  },
};

// Multiple Toasts
export const MultipleToasts: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <div className="flex gap-2">
        <Button
          onClick={() =>
            toast({
              title: 'First Toast',
              description: 'This is the first toast.',
            })
          }
        >
          Show First Toast
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast({
              title: 'Second Toast',
              description: 'This is the second toast.',
              variant: 'destructive',
            })
          }
        >
          Show Second Toast
        </Button>
      </div>
    );
  },
};

// Custom Toast
export const CustomToast: Story = {
  render: () => {
    const { toast } = useToast();
    return (
      <Button
        onClick={() =>
          toast({
            title: 'Download Complete',
            description: 'Your file has been downloaded successfully.',
            action: (
              <ToastAction altText="Open file">Open file</ToastAction>
            ),
            className: 'bg-blue-600 text-white',
          })
        }
      >
        Show Custom Toast
      </Button>
    );
  },
}; 