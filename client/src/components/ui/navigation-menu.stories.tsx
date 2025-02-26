import type { Meta, StoryObj } from '@storybook/react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';
import { cn } from '@/lib/utils';
import React from 'react';

const meta = {
  title: 'UI/NavigationMenu',
  component: NavigationMenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenu>;

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
  }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// Basic Navigation Menu
export const Basic: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <ListItem href="/docs" title="Introduction">
                A quick overview of the project and its features.
              </ListItem>
              <ListItem href="/docs/installation" title="Installation">
                Step-by-step guide to installing and setting up.
              </ListItem>
              <ListItem href="/docs/components" title="Components">
                Explore our collection of reusable components.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// Multiple Sections
export const MultipleSections: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px] md:w-[500px] md:grid-cols-2">
              <ListItem href="/products/analytics" title="Analytics">
                View detailed metrics and insights about your business.
              </ListItem>
              <ListItem href="/products/automation" title="Automation">
                Automate your workflow and increase productivity.
              </ListItem>
              <ListItem href="/products/security" title="Security">
                Keep your data safe with enterprise-grade security.
              </ListItem>
              <ListItem href="/products/integrations" title="Integrations">
                Connect with your favorite tools and services.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[400px]">
              <ListItem href="/resources/blog" title="Blog">
                Read the latest news and updates.
              </ListItem>
              <ListItem href="/resources/documentation" title="Documentation">
                Detailed guides and API references.
              </ListItem>
              <ListItem href="/resources/community" title="Community">
                Join our community of developers.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className="font-medium" href="/about">
            About
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

// Feature Grid
export const FeatureGrid: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Features</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 w-[600px] md:grid-cols-2">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Pro Features
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Unlock advanced features and capabilities with our Pro plan.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/features/analytics" title="Analytics">
                Powerful analytics and reporting tools.
              </ListItem>
              <ListItem href="/features/security" title="Security">
                Enterprise-grade security features.
              </ListItem>
              <ListItem href="/features/automation" title="Automation">
                Workflow automation capabilities.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}; 