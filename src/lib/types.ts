export type Category = {
  id: string;
  name: string;
  image: string;
  imageHint: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: { url: string; hint: string }[];
  sizes?: string[];
  materials?: string[];
  stock: number;
  isFeatured: boolean;
  isOnSale?: {
    status: boolean;
    salePrice?: number;
  };
  createdAt: Date;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  userId: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'customer';
};
