import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { HomePage } from '@/pages/Home';
import { MarketplacePage } from '@/pages/Marketplace';
import { BlogPage } from '@/pages/Blog';
import { ContactPage } from '@/pages/Contact';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock data
const mockMarketplaceItems = {
  status: 'success',
  data: {
    items: [
      {
        id: '1',
        title: 'Test Item',
        slug: 'test-item',
        description: 'Test description',
        price: 99.99,
        imageUrl: 'https://example.com/image.jpg',
        status: 'AVAILABLE',
        category: { name: 'Test Category', slug: 'test-category' },
        seller: { name: 'Test Seller', avatar: null },
        tags: [{ name: 'Test Tag', slug: 'test-tag' }],
        featured: true,
      },
    ],
    pagination: {
      page: 1,
      limit: 9,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
};

const mockBlogPosts = {
  status: 'success',
  data: {
    posts: [
      {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
        excerpt: 'Test excerpt',
        author: { name: 'Test Author', avatar: null },
        publishedAt: new Date().toISOString(),
        category: { name: 'Test Category', slug: 'test-category' },
        tags: [{ name: 'Test Tag', slug: 'test-tag' }],
        _count: { comments: 0, likes: 0 },
        viewCount: 0,
      },
    ],
    pagination: {
      page: 1,
      limit: 9,
      total: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
};

const mockCategories = {
  status: 'success',
  data: [
    { name: 'Test Category', slug: 'test-category', _count: { marketplaceItems: 1, posts: 1 } },
  ],
};

const mockTags = {
  status: 'success',
  data: [
    { name: 'Test Tag', slug: 'test-tag', _count: { marketplaceItems: 1, posts: 1 } },
  ],
};

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <ThemeProvider>
      {children}
    </ThemeProvider>
  </BrowserRouter>
);

describe('API Integration Tests', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe('Home Page', () => {
    beforeEach(() => {
      mockFetch
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMarketplaceItems),
        }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBlogPosts),
        }));
    });

    it('loads and displays featured items and blog posts', async () => {
      render(<HomePage />, { wrapper: TestWrapper });

      // Check loading states
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Test Item')).toBeInTheDocument();
        expect(screen.getByText('Test Post')).toBeInTheDocument();
      });

      // Verify API calls
      expect(mockFetch).toHaveBeenCalledWith('/api/marketplace?featured=true&limit=3');
      expect(mockFetch).toHaveBeenCalledWith('/api/blog?limit=3&sortBy=publishedAt&order=desc');
    });
  });

  describe('Marketplace Page', () => {
    beforeEach(() => {
      mockFetch
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockMarketplaceItems),
        }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTags),
        }));
    });

    it('loads and displays marketplace items with filters', async () => {
      render(<MarketplacePage />, { wrapper: TestWrapper });

      // Check loading states
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Test Item')).toBeInTheDocument();
      });

      // Test search filter
      const searchInput = screen.getByPlaceholderText(/search/i);
      fireEvent.change(searchInput, { target: { value: 'test' } });

      // Verify API call with search parameter
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('search=test'));
      });
    });
  });

  describe('Blog Page', () => {
    beforeEach(() => {
      mockFetch
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockBlogPosts),
        }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        }))
        .mockImplementationOnce(() => Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTags),
        }));
    });

    it('loads and displays blog posts with filters', async () => {
      render(<BlogPage />, { wrapper: TestWrapper });

      // Check loading states
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Test Post')).toBeInTheDocument();
      });

      // Test search filter
      const searchInput = screen.getByPlaceholderText(/search posts/i);
      fireEvent.change(searchInput, { target: { value: 'test' } });

      // Verify API call with search parameter
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('search=test'));
      });
    });
  });

  describe('Contact Page', () => {
    it('submits form data successfully', async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          status: 'success',
          data: { id: '1', status: 'pending' },
        }),
      }));

      render(<ContactPage />, { wrapper: TestWrapper });

      // Fill out form
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
      fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test Message' } });

      // Submit form
      fireEvent.click(screen.getByText(/send message/i));

      // Check loading state
      expect(screen.getByText(/sending/i)).toBeInTheDocument();

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      });

      // Verify form submission
      expect(mockFetch).toHaveBeenCalledWith('/api/submit-form', expect.any(Object));
    });

    it('handles form submission errors', async () => {
      mockFetch.mockImplementationOnce(() => Promise.resolve({
        ok: false,
        json: () => Promise.resolve({
          status: 'error',
          message: 'Something went wrong',
        }),
      }));

      render(<ContactPage />, { wrapper: TestWrapper });

      // Fill out form
      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Test Subject' } });
      fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Test Message' } });

      // Submit form
      fireEvent.click(screen.getByText(/send message/i));

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });
  });
}); 