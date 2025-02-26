import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from './ui/button';

const meta = {
  title: 'UI/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

// Basic Vertical Scroll
export const Basic: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag} className="text-sm">
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// With Separator
export const WithSeparator: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag) => (
          <div key={tag}>
            <div className="text-sm">{tag}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// Dynamic Content
export const DynamicContent: Story = {
  render: () => {
    const [items, setItems] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);

    const loadMore = React.useCallback(() => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setItems(prev => [
          ...prev,
          ...Array.from({ length: 10 }, (_, i) => `Item ${prev.length + i + 1}`)
        ]);
        setLoading(false);
      }, 1000);
    }, []);

    React.useEffect(() => {
      loadMore();
    }, [loadMore]);

    return (
      <ScrollArea className="h-[400px] w-[300px] rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 text-sm font-medium leading-none">Dynamic Loading</h4>
          {items.map((item) => (
            <div key={item} className="mb-4 rounded-lg border p-4 last:mb-0">
              <p className="text-sm">{item}</p>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          )}
          <Button 
            onClick={loadMore} 
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      </ScrollArea>
    );
  },
};

// Content Cards
export const ContentCards: Story = {
  render: () => (
    <ScrollArea className="h-[400px] w-[300px] rounded-md border p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="mb-4 rounded-lg border p-4 last:mb-0"
        >
          <h4 className="mb-2 text-sm font-medium">Card {i + 1}</h4>
          <p className="text-sm text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      ))}
    </ScrollArea>
  ),
};

// Horizontal Scroll
export const HorizontalScroll: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="w-[150px] shrink-0 rounded-md border p-4"
          >
            <div className="text-sm">Item {i + 1}</div>
            <div className="text-sm text-muted-foreground">
              Description for item {i + 1}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

// Chat/Message List
export const ChatList: Story = {
  render: () => (
    <ScrollArea className="h-[500px] w-[350px] rounded-md border p-4">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "mb-4 flex last:mb-0",
            i % 2 === 0 ? "justify-start" : "justify-end"
          )}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-2 max-w-[70%]",
              i % 2 === 0
                ? "bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground"
            )}
          >
            <p className="text-sm">
              This is message {i + 1}. {i % 2 === 0 ? "Received" : "Sent"} message
              example with some longer text to demonstrate wrapping.
            </p>
            <p className="mt-1 text-xs opacity-70">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      ))}
    </ScrollArea>
  ),
}; 