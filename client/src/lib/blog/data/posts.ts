import { authors } from "./authors"
import type { BlogPost } from "../types"

export const blogPosts: BlogPost[] = [
  // Previous posts remain unchanged (1-13)
  {
    id: 14,
    title: "Design Systems: From Theory to Implementation",
    excerpt: "A comprehensive guide to building and maintaining effective design systems.",
    content: `Design systems have become essential for maintaining consistency and efficiency in modern web development. This guide explores the key aspects of creating and implementing a successful design system.

    A well-structured design system consists of several key components: design tokens, components, patterns, and documentation. Each element plays a crucial role in creating a cohesive user experience across different platforms and applications.

    Design tokens form the foundation of a design system, defining fundamental values like colors, typography, spacing, and other visual properties. These tokens ensure consistency and make it easier to maintain and update the system.

    Component architecture requires careful consideration of reusability, flexibility, and maintainability. Modern approaches favor composition over inheritance, allowing for more flexible and maintainable component libraries.`,
    date: "March 14, 2024",
    readTime: "13 min read",
    category: "Design Systems",
    image: "https://images.unsplash.com/photo-1561883088-039e53143d73?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: authors.linaKumar
  },
  {
    id: 15,
    title: "Performance Optimization Techniques for Modern Web Apps",
    excerpt: "Advanced strategies for optimizing web application performance.",
    content: `Web performance optimization has become increasingly important as applications grow in complexity. This guide covers advanced techniques for improving application speed and user experience.

    Modern performance optimization goes beyond basic techniques, incorporating advanced strategies like module federation, tree shaking, and smart bundling. Understanding these concepts is crucial for building high-performance applications.

    Image optimization remains a critical aspect of web performance. Modern formats like WebP and AVIF, combined with responsive loading strategies, can significantly improve loading times while maintaining quality.

    JavaScript performance optimization requires a multi-faceted approach, including code splitting, lazy loading, and careful management of third-party dependencies. Understanding browser rendering and JavaScript execution is key to effective optimization.`,
    date: "March 13, 2024",
    readTime: "16 min read",
    category: "Performance",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: authors.marcusThompson
  },
  {
    id: 16,
    title: "Accessibility in Modern Web Applications",
    excerpt: "Essential practices for building inclusive web experiences.",
    content: `Web accessibility is not just a legal requirement but a fundamental aspect of good web design. This guide explores modern approaches to creating accessible web applications.

    ARIA attributes and semantic HTML form the foundation of accessible web applications. Understanding their proper usage is crucial for creating truly inclusive experiences.

    Keyboard navigation and focus management are essential aspects of web accessibility. Modern applications must provide robust keyboard support and clear focus indicators.

    Color contrast and typography play crucial roles in accessibility. Understanding WCAG guidelines and implementing them effectively ensures content is readable for all users.`,
    date: "March 12, 2024",
    readTime: "11 min read",
    category: "Accessibility",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: authors.sophiaChen
  },
  {
    id: 17,
    title: "State Management Patterns in React Applications",
    excerpt: "Modern approaches to managing state in React applications.",
    content: `State management continues to evolve in the React ecosystem. This article explores modern patterns and best practices for managing application state effectively.

    The trend towards simpler state management solutions has led to new patterns and tools. Understanding when to use local state, context, or external state management libraries is crucial.

    Server state management has become increasingly important with the rise of real-time applications. Tools like React Query and SWR have changed how we think about data fetching and caching.

    State persistence and hydration patterns are crucial for modern applications. Understanding these concepts helps create more resilient and user-friendly applications.`,
    date: "March 11, 2024",
    readTime: "14 min read",
    category: "React",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: authors.alexRodriguez
  },
  {
    id: 18,
    title: "Building Micro-frontends: Architecture and Implementation",
    excerpt: "A detailed guide to implementing micro-frontend architecture.",
    content: `Micro-frontend architecture has gained popularity as a way to scale frontend development. This guide explores the benefits, challenges, and implementation strategies.

    Different approaches to micro-frontend implementation each have their trade-offs. Understanding these helps in choosing the right approach for your specific needs.

    Module federation has become a key enabler for micro-frontends. Understanding its capabilities and limitations is crucial for successful implementation.

    Runtime integration patterns require careful consideration of performance and user experience. This includes strategies for loading and communicating between micro-frontends.`,
    date: "March 10, 2024",
    readTime: "17 min read",
    category: "Architecture",
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: authors.alexRodriguez
  },
  {
    id: 19,
    title: "CSS Architecture for Large-Scale Applications",
    excerpt: "Best practices for organizing and scaling CSS in large applications.",
    content: `CSS architecture becomes increasingly important as applications grow. This guide explores modern approaches to writing maintainable and scalable CSS.

    Modern CSS features like custom properties, container queries, and cascade layers have changed how we structure our stylesheets. Understanding these features is crucial for modern CSS architecture.

    CSS modules and CSS-in-JS solutions each have their place in modern applications. Understanding the trade-offs helps in choosing the right approach for your needs.

    Performance considerations in CSS architecture include strategies for code splitting, critical CSS, and managing specificity.`,
    date: "March 9, 2024",
    readTime: "12 min read",
    category: "CSS",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: authors.linaKumar
  },
  {
    id: 20,
    title: "API Design Patterns for Modern Web Applications",
    excerpt: "Best practices for designing and implementing web APIs.",
    content: `Well-designed APIs are crucial for modern web applications. This guide explores patterns and practices for creating effective and maintainable APIs.

    RESTful API design principles remain relevant but have evolved with modern requirements. Understanding these evolution helps in creating more effective APIs.

    GraphQL has changed how we think about API design. Understanding its benefits and trade-offs is crucial for modern API development.

    API versioning and documentation are crucial for maintaining backwards compatibility while allowing for evolution. This includes strategies for managing breaking changes and maintaining documentation.`,
    date: "March 8, 2024",
    readTime: "15 min read",
    category: "API Design",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: authors.marcusThompson
  }
]