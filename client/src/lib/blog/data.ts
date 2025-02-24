import type { BlogPost } from "./types"

export const blogPosts: BlogPost[] = [
  // Existing posts...
  {
    id: 4,
    title: "The Future of AI in Design: Collaboration, Not Replacement",
    excerpt: "Exploring how artificial intelligence is enhancing creative workflows and empowering designers.",
    content: `The integration of AI in design has sparked both excitement and concern within the creative community. However, the reality is showing that AI is becoming a powerful collaborative tool rather than a replacement for human creativity.

    Today's AI-powered design tools are enhancing workflows by automating repetitive tasks, generating initial concepts, and providing data-driven insights into user preferences. This allows designers to focus more on strategic thinking and creative problem-solving.

    One of the most significant impacts of AI in design is in the prototyping phase. AI can now generate multiple variations of a design concept in seconds, allowing designers to explore more possibilities and iterate faster. This doesn't replace the designer's judgment but rather provides a broader foundation for creative exploration.

    The key to successful AI integration lies in understanding its role as an enhancer of human creativity rather than a substitute. Designers who embrace AI as a collaborative tool are finding new ways to push creative boundaries while maintaining the human touch that makes design truly impactful.`,
    date: "March 18, 2024",
    readTime: "6 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "David Kim",
      role: "AI Design Specialist",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    }
  },
  {
    id: 5,
    title: "Sustainable Web Design: Building a Greener Digital Future",
    excerpt: "Learn how sustainable web design practices can reduce environmental impact while improving user experience.",
    content: `As the digital world continues to grow, so does its environmental impact. Sustainable web design is emerging as a crucial approach to creating digital products that are both user-friendly and environmentally conscious.

    The core principles of sustainable web design include optimizing image sizes, minimizing server requests, and choosing energy-efficient hosting providers. These practices not only reduce carbon emissions but also improve website performance and user experience.

    Color choices and dark mode implementations can significantly impact energy consumption, especially on OLED screens. By designing with sustainability in mind, we can create beautiful interfaces that consume less energy.

    Performance optimization is a key aspect of sustainable web design. Faster loading times mean less server processing time and reduced energy consumption. This includes techniques like lazy loading, efficient caching, and optimized code.

    The future of web design must balance aesthetic appeal with environmental responsibility. By adopting sustainable practices today, we can help build a greener digital future while delivering exceptional user experiences.`,
    date: "March 17, 2024",
    readTime: "7 min read",
    category: "Sustainability",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Emma Green",
      role: "Sustainability Design Lead",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    }
  },
  {
    id: 6,
    title: "Mastering Mobile-First Design in 2024",
    excerpt: "Essential strategies and best practices for creating exceptional mobile-first digital experiences.",
    content: `Mobile-first design has evolved from a trend to a fundamental requirement in modern web development. As mobile devices continue to dominate internet usage, understanding and implementing effective mobile-first strategies is crucial for success.

    The key to mobile-first design lies in prioritizing content and functionality based on mobile user needs. This means focusing on essential features first and progressively enhancing the experience for larger screens.

    Performance optimization becomes even more critical in mobile-first design. Techniques like responsive images, efficient loading strategies, and touch-friendly interfaces are essential for creating smooth mobile experiences.

    Typography and spacing play crucial roles in mobile design. Careful consideration must be given to readability and touch target sizes to ensure comfortable user interaction on smaller screens.

    Testing across multiple devices and screen sizes remains a critical part of the mobile-first design process. Real-device testing provides insights that emulators alone cannot capture.`,
    date: "March 16, 2024",
    readTime: "9 min read",
    category: "Mobile Development",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "James Wilson",
      role: "Mobile UX Expert",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    }
  },
  {
    id: 7,
    title: "The Psychology of Color in Digital Design",
    excerpt: "Understanding how color choices influence user behavior and brand perception in digital spaces.",
    content: `Color psychology plays a crucial role in digital design, influencing user emotions, behaviors, and brand perceptions. Understanding these psychological impacts can help create more effective and engaging digital experiences.

    Different colors evoke different emotional responses. Blue often conveys trust and stability, making it popular among corporate websites. Red can create urgency or excitement, while green is associated with growth and environmental themes.

    Cultural context must be considered when choosing colors for global audiences. What works in one culture might have different or even negative connotations in another. This understanding is crucial for international brands and applications.

    Color accessibility is another vital consideration. Ensuring sufficient contrast ratios and providing alternatives for color-blind users helps create inclusive designs that work for everyone.

    The strategic use of color in calls-to-action, navigation elements, and branding can significantly impact user engagement and conversion rates. Testing different color combinations can help optimize these elements for better results.`,
    date: "March 14, 2024",
    readTime: "8 min read",
    category: "Design Psychology",
    image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
    author: {
      name: "Sophie Chen",
      role: "UX Psychology Researcher",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    }
  }
]