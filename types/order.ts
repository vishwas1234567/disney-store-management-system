export interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id?: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt?: any;
}