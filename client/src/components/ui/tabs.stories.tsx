import type { Meta, StoryObj } from '@storybook/react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './tabs';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import React from 'react';

const meta = {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

// Basic Tabs
export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">
          Make changes to your account here. Click save when you're done.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm text-muted-foreground">
          Change your password here. After saving, you'll be logged out.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

// Account Settings
export const AccountSettings: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@johndoe" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// Controlled Tabs
export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = React.useState("tab1");
    
    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList>
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
          <TabsTrigger value="tab3">Third</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <Card>
            <CardHeader>
              <CardTitle>Tab One</CardTitle>
              <CardDescription>Current tab value: {activeTab}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveTab("tab2")}>
                Go to Second Tab
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tab2">
          <Card>
            <CardHeader>
              <CardTitle>Tab Two</CardTitle>
              <CardDescription>Current tab value: {activeTab}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveTab("tab3")}>
                Go to Third Tab
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tab3">
          <Card>
            <CardHeader>
              <CardTitle>Tab Three</CardTitle>
              <CardDescription>Current tab value: {activeTab}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setActiveTab("tab1")}>
                Back to First Tab
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    );
  },
};

// Product Details
export const ProductDetails: Story = {
  render: () => (
    <Tabs defaultValue="description" className="w-[600px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      <TabsContent value="description">
        <Card>
          <CardHeader>
            <CardTitle>Product Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This premium product features high-quality materials and expert craftsmanship.
              Perfect for both professional and personal use, it offers outstanding
              performance and reliability.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="specifications">
        <Card>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium">Dimensions</div>
              <div className="text-muted-foreground">10" x 8" x 2"</div>
              <div className="font-medium">Weight</div>
              <div className="text-muted-foreground">2.5 lbs</div>
              <div className="font-medium">Material</div>
              <div className="text-muted-foreground">Aluminum</div>
              <div className="font-medium">Color</div>
              <div className="text-muted-foreground">Space Gray</div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="reviews">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>Average Rating: 4.5/5</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="font-medium">John D.</div>
                <div className="text-sm text-muted-foreground">★★★★★</div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Excellent product, exceeded my expectations!
              </p>
            </div>
            <div className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="font-medium">Sarah M.</div>
                <div className="text-sm text-muted-foreground">★★★★</div>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Good quality, but shipping took longer than expected.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

// Custom Styled
export const CustomStyled: Story = {
  render: () => (
    <Tabs defaultValue="music" className="w-[400px]">
      <TabsList className="bg-blue-50 dark:bg-blue-950">
        <TabsTrigger 
          value="music"
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Music
        </TabsTrigger>
        <TabsTrigger 
          value="podcasts"
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Podcasts
        </TabsTrigger>
        <TabsTrigger 
          value="audiobooks"
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          Audiobooks
        </TabsTrigger>
      </TabsList>
      <TabsContent value="music" className="mt-4">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Music Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600">
              Browse your favorite songs and albums.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="podcasts" className="mt-4">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Podcast Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600">
              Listen to your subscribed podcasts.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="audiobooks" className="mt-4">
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700">Audiobook Library</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-600">
              Continue listening to your audiobooks.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  ),
}; 