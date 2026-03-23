"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { OrderItem } from "@/types/order";
import { generateInvoicePDF } from "@/lib/pdf";

export default function BillingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastOrder, setLastOrder] = useState<{ id: string, items: OrderItem[], totalAmount: number } | null>(null);

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
      alert("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const getProductStock = (productId: string) => {
    return products.find((p) => p.id === productId)?.stock || 0;
  };

  const addToCart = (product: Product) => {
    if (!product.id) return;
    if (product.stock <= 0) {
      alert("Product is out of stock!");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          alert(`Cannot add more. Only ${product.stock} in stock.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product.id as string,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ];
      }
    });
  };

  const increaseQuantity = (productId: string) => {
    const stock = getProductStock(productId);
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.productId === productId) {
          if (item.quantity >= stock) return item; // Can't add more than stock
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleGenerateBill = async () => {
    if (cart.length === 0) return;
    
    const orderData = {
      items: cart,
      totalAmount: calculateTotal(),
    };

    try {
      setIsSubmitting(true);
      setSuccessMsg("");
      setErrorMsg("");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      // Extract success data (which strictly contains identical orderId)
      const data = await res.json();

      // Hook state context mapping for invoice generators prior to clearing visual arrays natively
      setLastOrder({
        id: data.id,
        items: [...cart],
        totalAmount: calculateTotal()
      });

      // Success logic
      setCart([]);
      setSuccessMsg("Order successfully generated!");
      
      // Auto-hide success message after 10 seconds to allow time for downloading pdf
      setTimeout(() => setSuccessMsg(""), 10000);
      
      // To ensure product stock is correctly updated visually, we should refetch products
      fetchProducts();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Error generating bill. Check console for details.");
      
      // Auto-hide error message after 5 seconds to prevent stale alerts
      setTimeout(() => setErrorMsg(""), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Point of Sale / Billing</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE: Products List */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Available Products</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                No products found. Please add products in the management page.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium ml-2">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-4">Stock: {product.stock}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: Cart Area */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 sticky top-8 flex flex-col h-fit max-h-[calc(100vh-4rem)]">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Current Order</h2>
              </div>

              {/* Cart Items Area */}
              <div className="p-5 overflow-y-auto flex-1">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Cart is empty
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {cart.map((item) => (
                      <div key={item.productId} className="flex flex-col gap-2 py-3 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-800 flex-1">{item.name}</span>
                          <button 
                            onClick={() => removeFromCart(item.productId)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">${Number(item.price).toFixed(2)}</span>
                          
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => decreaseQuantity(item.productId)}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                            >
                              -
                            </button>
                            <span className="font-medium w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item.productId)}
                              disabled={item.quantity >= getProductStock(item.productId)}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Total Calculation Area */}
              <div className="p-5 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                {successMsg && (
                  <div className="mb-4 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 text-sm flex flex-col items-center gap-3">
                    <span className="font-semibold text-center">{successMsg}</span>
                    {lastOrder && (
                      <button 
                        onClick={() => generateInvoicePDF(lastOrder.id, lastOrder.items, lastOrder.totalAmount)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-sm shadow-sm transition-colors border border-transparent hover:border-green-500"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                        </svg>
                        Download Invoice (PDF)
                      </button>
                    )}
                  </div>
                )}
                {errorMsg && (
                  <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm font-medium text-center">
                    {errorMsg}
                  </div>
                )}
                
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax (0%)</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleGenerateBill}
                  disabled={cart.length === 0 || isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                      Generate Bill
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
