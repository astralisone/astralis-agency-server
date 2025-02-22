export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  features: string[];
  category: 'template' | 'plugin' | 'service';
  status: 'available' | 'coming_soon';
} 