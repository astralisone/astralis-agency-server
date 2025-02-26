import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './card';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

// Simple Card
export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  ),
};

// Card with Footer
export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Newsletter</CardTitle>
        <CardDescription>Get updates on our latest features.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Subscribe to our newsletter to stay updated with our latest news and features.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Cancel</Button>
        <Button>Subscribe</Button>
      </CardFooter>
    </Card>
  ),
};

// Product Card
export const ProductCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <img
          src="https://via.placeholder.com/350x200"
          alt="Product"
          className="rounded-t-lg"
        />
        <CardTitle>Product Name</CardTitle>
        <CardDescription>$99.99</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Product description goes here. This is a sample product with sample text.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Add to Cart</Button>
      </CardFooter>
    </Card>
  ),
};

// Blog Post Card
export const BlogPost: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Understanding React Hooks</CardTitle>
        <CardDescription>Posted by John Doe • 5 min read</CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Learn how React Hooks can simplify your components and make them more
          reusable. We'll cover useState, useEffect, and custom hooks.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost">Share</Button>
        <Button variant="outline">Read More</Button>
      </CardFooter>
    </Card>
  ),
};

// Interactive Card
export const Interactive: Story = {
  render: () => (
    <Card className="w-[350px] hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see the effect</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects and appears clickable.</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full">Learn More</Button>
      </CardFooter>
    </Card>
  ),
}; 