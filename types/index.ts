export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}
