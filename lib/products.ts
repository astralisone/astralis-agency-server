export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Agency T-Shirt",
    description: "Premium cotton T-shirt with the agency's minimalist logo on the front. Available in black, white, and dark red. Perfect for design enthusiasts and agency supporters alike. Soft, comfortable, and stylish.",
    price: 25.00,
    category: "Branded Merchandise",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Designer Coffee Mug",
    description: "11oz ceramic mug with the agency's elegant logo and color scheme. Great for coffee lovers and creatives who want to represent the brand in style.",
    price: 15.00,
    category: "Branded Merchandise",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Premium Laptop Stickers",
    description: "Set of three premium vinyl stickers featuring the agency's logo and creative designs. Perfect for laptops, tablets, or notebooks.",
    price: 8.00,
    category: "Branded Merchandise",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 4,
    name: "Social Media Template Pack",
    description: "A bundle of editable social media templates for Instagram and LinkedIn, including story and post formats. Designed with a modern aesthetic, making it easy to showcase products or services professionally.",
    price: 30.00,
    category: "Digital Design Assets",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 5,
    name: "UI/UX Design Kit",
    description: "Comprehensive UI/UX design kit with buttons, icons, and layout templates for web and mobile applications. Ideal for designers and developers who want to speed up their design process.",
    price: 50.00,
    category: "Digital Design Assets",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 6,
    name: "Typography Pack",
    description: "Curated pack of unique fonts and typography pairings, perfect for creating cohesive and stylish designs. Ideal for creatives looking to enhance their projects.",
    price: 20.00,
    category: "Digital Design Assets",
    image: "https://images.unsplash.com/photo-1588075592446-265fd1e6e76f?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 7,
    name: "Design Basics Course",
    description: "A beginner-friendly course covering the fundamentals of design. Topics include color theory, typography, and layout. Learn at your own pace and improve your design skills.",
    price: 75.00,
    category: "Educational Products",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 8,
    name: "Branding Essentials E-Book",
    description: "A comprehensive guide to building a strong brand. This e-book covers logo design, color selection, and brand voice. Ideal for entrepreneurs and small businesses.",
    price: 15.00,
    category: "Educational Products",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 9,
    name: "Logo Design Package",
    description: "Custom logo design package, including three logo concepts and two rounds of revisions. Perfect for startups and small businesses looking for a strong brand identity.",
    price: 200.00,
    category: "Design Services",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 10,
    name: "Social Media Content Package",
    description: "Monthly package of custom-designed social media posts, including 10 posts and 5 stories tailored to your brand. Ideal for growing your online presence.",
    price: 100.00,
    category: "Design Services",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=60"
  }
]