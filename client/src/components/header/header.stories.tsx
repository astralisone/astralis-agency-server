import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './index';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../providers/theme-provider';

const meta = {
  title: 'Sections/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof Header>;

// Default Header
export const Default: Story = {};

// With Active Link
export const WithActiveLink: Story = {
  parameters: {
    reactRouter: {
      routePath: '/marketplace',
      location: {
        pathname: '/marketplace'
      }
    }
  }
};

// Mobile View
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet View
export const Tablet: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Desktop View
export const Desktop: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// Dark Theme
export const DarkTheme: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark">
          <div className="dark">
            <Story />
          </div>
        </ThemeProvider>
      </BrowserRouter>
    ),
  ],
};

// With Notifications
export const WithNotifications: Story = {
  parameters: {
    mockData: {
      notifications: [
        { id: 1, message: 'New message received' },
        { id: 2, message: 'Your order has been shipped' },
      ],
      unreadCount: 2,
    },
  },
};

// With User Menu
export const WithUserMenu: Story = {
  parameters: {
    mockData: {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://github.com/shadcn.png',
      },
      isAuthenticated: true,
    },
  },
};

// Loading State
export const Loading: Story = {
  parameters: {
    mockData: {
      isLoading: true,
    },
  },
}; 