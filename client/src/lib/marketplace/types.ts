export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export type ProductCategory = 
  | "All Products"
  | "Branded Merchandise"
  | "Digital Design Assets"
  | "Educational Products"
  | "Design Services"
  | "Art & Photography"