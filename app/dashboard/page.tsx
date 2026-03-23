"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockProducts: Product[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <div className="bg-red-50 text-red-700 p-6 rounded-xl border border-red-100 flex flex-col items-center max-w-sm text-center">
          <svg className="w-12 h-12 text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="font-semibold text-lg">Failed to load payload</p>
          <p className="text-sm mt-1 opacity-80">Check your internet connection and verify that your API route is actively returning Firebase analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 md:p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Dashboard Overview</h1>

      {/* Analytics KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 flex flex-col justify-center transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-2 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 relative z-10">Total Products</p>
          <p className="text-5xl font-extrabold text-blue-600 relative z-10">{data.totalProducts}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 flex flex-col justify-center transition-all duration-300 hover:shadow-xl hover:border-purple-200 hover:-translate-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-2 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <svg className="w-24 h-24 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 relative z-10">Total Orders</p>
          <p className="text-5xl font-extrabold text-purple-600 relative z-10">{data.totalOrders}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 flex flex-col justify-center transition-all duration-300 hover:shadow-xl hover:border-green-200 hover:-translate-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-2 group-hover:scale-110 group-hover:opacity-20 transition-all duration-300">
            <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.311c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.311c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 relative z-10">Total Revenue</p>
          <p className="text-5xl font-extrabold text-green-500 relative z-10">${Number(data.totalRevenue).toFixed(2)}</p>
        </div>
      </div>

      {/* Low Stock Thresholds Section */}
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Internal Stock Alerts
        <span className="text-sm font-normal text-gray-400 ml-2">(Threshold {"<"} 5 Units)</span>
      </h2>
      
      {data.lowStockProducts && data.lowStockProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data.lowStockProducts.map(product => (
            <div key={product.id} className="bg-red-50 rounded-xl shadow border border-red-200 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow relative overflow-hidden group">
              <div className="absolute inset-0 bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <h3 className="font-bold text-gray-800 mb-2 truncate" title={product.name}>{product.name}</h3>
                <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-md uppercase tracking-widest">
                  {product.category}
                </span>
              </div>
              
              <div className="mt-6 flex justify-between items-end relative z-10">
                <span className="text-gray-500 font-medium text-sm">Sale: ${Number(product.price).toFixed(2)}</span>
                <span className="text-red-600 font-bold bg-red-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {product.stock} Left
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-10 text-center flex flex-col items-center">
            <div className="bg-emerald-100 p-3 rounded-full mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-emerald-900 font-bold text-xl mb-1">Inventory Looking Healthy!</p>
            <p className="text-gray-500 font-medium max-w-sm">You currently have no products reaching critical low-stock thresholds.</p>
        </div>
      )}
    </div>
  );
}