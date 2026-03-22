import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Product } from "../types/product";

const PRODUCTS_COLLECTION = "products";

export const productService = {
  /**
   * Adds a new product to the Firestore 'products' collection.
   * @param product The product data to add.
   * @returns The generated document ID.
   */
  async addProduct(product: Omit<Product, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
        ...product,
        createdAt: product.createdAt || new Date().toISOString(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding product: ", error);
      throw new Error("Could not add product");
    }
  },

  /**
   * Retrieves all products from the Firestore 'products' collection.
   * @returns An array of properly structured Product objects.
   */
  async getProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
      const products: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      return products;
    } catch (error) {
      console.error("Error getting products: ", error);
      throw new Error("Could not fetch products");
    }
  },

  /**
   * Deletes a product from the Firestore 'products' collection by ID.
   * @param id The ID of the product to delete.
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw new Error("Could not delete product");
    }
  },
};
