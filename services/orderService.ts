import { collection, getDocs, doc, runTransaction } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Order } from "../types/order";

const ORDERS_COLLECTION = "orders";
const PRODUCTS_COLLECTION = "products";

export const orderService = {
  /**
   * Creates a new order in the Firestore 'orders' collection and utilizes a transaction to safely decrement product stock.
   * @param order The order data to add.
   * @returns The generated document ID of the new order.
   */
  async createOrder(order: Omit<Order, "id">): Promise<string> {
    try {
      const newOrderId = await runTransaction(db, async (transaction) => {
        // 1. Buffer array to hold necessary updates until all reads are done safely
        const productUpdates: { ref: any; newStock: number }[] = [];

        // 2. Read phase: Must read all docs sequentially before generating writes in a transaction
        for (const item of order.items) {
          const productRef = doc(db, PRODUCTS_COLLECTION, item.productId);
          const productSnap = await transaction.get(productRef);

          if (!productSnap.exists()) {
            throw new Error(`Product not found: ${item.name}`);
          }

          const currentStock = productSnap.data().stock;

          if (currentStock < item.quantity) {
            throw new Error(`Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`);
          }

          productUpdates.push({
            ref: productRef,
            newStock: currentStock - item.quantity,
          });
        }

        // 3. Write phase: Execute the stock updates safely
        for (const update of productUpdates) {
          transaction.update(update.ref, { stock: update.newStock });
        }

        // 4. Create the new order document atomically
        const newOrderRef = doc(collection(db, ORDERS_COLLECTION));
        transaction.set(newOrderRef, {
          ...order,
          createdAt: order.createdAt || new Date().toISOString(),
        });

        // Return the generated id from the transaction execution scope
        return newOrderRef.id;
      });

      return newOrderId;
    } catch (error: any) {
      console.error("Transaction failed during order generation: ", error);
      throw error; // Re-throw the explicit error constraint to the API controller
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
