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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse border border-gray-200 shadow-sm rounded-lg">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-sm border-b border-gray-200 uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold border-r border-gray-200 min-w-[200px]">Order ID</th>
                  <th className="px-6 py-4 font-bold border-r border-gray-200 min-w-[200px]">Date Placed</th>
                  <th className="px-6 py-4 font-bold border-r border-gray-200 min-w-[300px]">Purchased Items</th>
                  <th className="px-6 py-4 font-bold text-right min-w-[150px]">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((order, index) => (
                  <tr 
                    key={order.id} 
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50/60 transition-colors duration-150`}
                  >
                    <td className="px-6 py-5 text-gray-800 font-mono font-medium border-r border-gray-200 align-top">
                      {order.id}
                    </td>
                    <td className="px-6 py-5 text-gray-600 font-medium whitespace-nowrap border-r border-gray-200 align-top">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-5 border-r border-gray-200">
                      <ul className="space-y-2.5">
                        {order.items.map((item, idx) => (
                          <li key={`${order.id}-${item.productId}-${idx}`} className="flex justify-between items-center bg-white p-2 border border-gray-100 rounded shadow-sm hover:border-gray-300 transition-colors">
                            <div className="flex items-center">
                              <span className="bg-blue-100/60 text-blue-800 text-[10px] font-bold px-2 py-1 rounded mr-3 border border-blue-200/50">
                                {item.quantity}x
                              </span>
                              <span className="font-semibold text-gray-800 text-sm truncate max-w-[150px]" title={item.name}>
                                {item.name}
                              </span>
                            </div>
                            <span className="text-gray-500 text-sm font-medium ml-4">
                              ${Number(item.price).toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-5 text-right font-bold text-lg text-green-600 align-top">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
