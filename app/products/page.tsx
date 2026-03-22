"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching products. Check the console for more details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !category) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsAdding(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          stock: parseInt(stock, 10),
          category,
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");

      // Reset form state
      setName("");
      setPrice("");
      setStock("");
      setCategory("");

      // Refetch the data to show the new product
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to add product.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteProduct = async (id?: string) => {
    if (!id) return;
    
    // Simple confirmation before deleting
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");

      // Refetch data state to remount the UI without the deleted product
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product.");
    }
  };

  return (
    <div className="container mx-auto p-6 md:p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Product Management</h1>

      {/* Add New Product Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 border-b pb-2">Add New Product</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <input
              type="text"
              placeholder="Mickey Plush"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="19.99"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Stock</label>
            <input
              type="number"
              min="0"
              placeholder="50"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <input
              type="text"
              placeholder="Toys"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isAdding}
              className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
            >
              {isAdding ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>

      {/* Product List Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No products found. Use the form above to add some to your store!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm border-b uppercase tracking-wider">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 text-gray-800 font-medium">{product.name}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium tracking-wide">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">${Number(product.price).toFixed(2)}</td>
                    <td className="p-4">
                      {product.stock > 0 ? (
                        <span className="text-gray-600">{product.stock}</span>
                      ) : (
                        <span className="text-red-500 font-medium bg-red-50 px-2 py-1 rounded-md text-xs">Out of stock</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 font-medium transition-colors px-3 py-1.5 rounded-md text-sm cursor-pointer border border-transparent hover:border-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
