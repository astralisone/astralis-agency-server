import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

const meta = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table>;

// Basic Table
export const Basic: Story = {
  render: () => (
    <Table>
      <TableCaption>A list of recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>2024-02-24</TableCell>
          <TableCell>Coffee Shop</TableCell>
          <TableCell>$5.99</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2024-02-23</TableCell>
          <TableCell>Grocery Store</TableCell>
          <TableCell>$75.50</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>2024-02-22</TableCell>
          <TableCell>Gas Station</TableCell>
          <TableCell>$45.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// With Footer
export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Product A</TableCell>
          <TableCell>2</TableCell>
          <TableCell>$10.00</TableCell>
          <TableCell>$20.00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Product B</TableCell>
          <TableCell>1</TableCell>
          <TableCell>$15.00</TableCell>
          <TableCell>$15.00</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell>$35.00</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
};

// User List
export const UserList: Story = {
  render: () => (
    <Table>
      <TableCaption>Active users in the system.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">John Doe</TableCell>
          <TableCell>john@example.com</TableCell>
          <TableCell>Admin</TableCell>
          <TableCell>
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
              Active
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Jane Smith</TableCell>
          <TableCell>jane@example.com</TableCell>
          <TableCell>User</TableCell>
          <TableCell>
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700">
              Away
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Bob Johnson</TableCell>
          <TableCell>bob@example.com</TableCell>
          <TableCell>User</TableCell>
          <TableCell>
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-red-100 text-red-700">
              Offline
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

// Compact Table
export const Compact: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Task</TableHead>
          <TableHead className="text-right">Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[
          { id: 'TASK-1234', task: 'Fix navigation bug', priority: 'High' },
          { id: 'TASK-1235', task: 'Update documentation', priority: 'Medium' },
          { id: 'TASK-1236', task: 'Add new feature', priority: 'Low' },
        ].map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.id}</TableCell>
            <TableCell>{task.task}</TableCell>
            <TableCell className="text-right">{task.priority}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}; 