export type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  reorder_level: number;
  emoji: string;
  image_url: string | null;
  active: boolean;
};

export type Order = {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: OrderStatus;
  created_at: Date;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number | null;
  name: string;
  unit_price: number;
  quantity: number;
};

export type OrderStatus = "placed" | "packed" | "shipped" | "delivered" | "cancelled";
export const ORDER_STATUSES: OrderStatus[] = ["placed", "packed", "shipped", "delivered", "cancelled"];
export const CATEGORIES = ["Coffee & Tea", "Spices", "Rice & Grains", "Snacks", "Kitchenware"];
