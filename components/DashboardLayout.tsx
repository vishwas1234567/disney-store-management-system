"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService } from "@/services/authService";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await authService.logout();
  };

  const navLinks = [
    { 
      name: "Dashboard", 
      href: "/dashboard", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
      )
    },
    { 
      name: "Products", 
      href: "/products", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      )
    },
    { 
      name: "Billing", 
      href: "/billing", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      )
    },
    { 
      name: "Orders", 
      href: "/orders", 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
        </svg>
      )
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm z-20 shrink-0">
        <div className="h-16 flex items-center justify-center border-b border-gray-100 bg-white sticky top-0">
          <span className="text-xl font-extrabold text-blue-600 tracking-tight">Disney Store Admin</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-3 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-bold shadow-sm border border-blue-100" 
                    : "text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }`}
              >
                <div className={`${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {link.icon}
                </div>
                {link.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Layout Wrapping */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Sticky Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-6 lg:px-10 z-10 shrink-0">
          <div className="md:hidden">
            <span className="text-lg font-extrabold text-blue-600 tracking-tight">Disney Admin</span>
          </div>
          <div className="hidden md:flex items-center">
            <span className="text-gray-500 font-semibold tracking-wide text-sm bg-gray-100 px-3 py-1.5 rounded-lg">
              Secure Operations Dashboard
            </span>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-800 transition-colors bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-lg border border-red-100 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
        </header>

        {/* Scrollable Content Container (Dynamic Page Injection) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50">
          <div className="w-full h-full pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
