"use client";

import { useEffect, useState } from "react";
import { Order } from "@/types/order";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
      alert("Error fetching orders. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown Date";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 md:p-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 tracking-tight">Order History</h1>

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-gray-100 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
          </svg>
          <p className="text-lg font-medium">No orders found.</p>
          <p className="text-sm mt-1">Generate a bill first to see it here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition hover:shadow-md">
              
              {/* Card Header */}
              <div className="bg-gray-50 px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Order ID
                  </span>
                  <span className="font-mono text-gray-900 font-semibold">
                    {order.id}
                  </span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Date Placed
                  </span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                
                <div className="flex flex-col sm:text-right">
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    Total Amount
                  </span>
                  <span className="font-bold text-xl text-green-600">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Card Body (Items) */}
              <div className="px-6 py-5">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 border-b pb-2">
                  Purchased Items
                </h3>
                <ul className="space-y-3">
                  {order.items.map((item, index) => (
                    <li key={`${order.id}-${item.productId}-${index}`} className="flex justify-between items-center group">
                      <div className="flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-md mr-3">
                          {item.quantity}x
                        </span>
                        <span className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
