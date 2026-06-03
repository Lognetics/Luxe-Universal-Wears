export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryName: string;
  group: string;
  subcategory: string;
  brand: string;
  price: number;
  comparePrice: number | null;
  currency: string;
  colors: string[];
  sizes: string[];
  description: string;
  fabric: string;
  care: string;
  tags: string[];
  images: string[];
  rating: number;
  reviews: number;
  stock: number;
  sku: string;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  createdIndex: number;
};

export type Category = {
  slug: string;
  name: string;
  group: string;
  subcategories: string[];
  count: number;
  image: string | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};
