import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Order } from "../types/order";

const ORDERS_COLLECTION = "orders";

export const orderService = {
  /**
   * Creates a new order in the Firestore 'orders' collection.
   * @param order The order data to add.
   * @returns The generated document ID of the new order.
   */
  async createOrder(order: Omit<Order, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
        ...order,
        // Ensures a valid timestamp is recorded on creation
        createdAt: order.createdAt || new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating order: ", error);
      throw new Error("Could not create order");
    }
  },

  /**
   * Retrieves all orders from the Firestore 'orders' collection.
   * @returns An array of properly structured Order objects.
   */
  async getOrders(): Promise<Order[]> {
    try {
      const querySnapshot = await getDocs(collection(db, ORDERS_COLLECTION));
      
      const orders: Order[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];
      
      // Optionally sort orders by createdAt descending 
      return orders.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.error("Error getting orders: ", error);
      throw new Error("Could not fetch orders");
    }
  }
};
