"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

const publicRoutes = ['/', '/login', '/signup', '/register', '/forgot-password'];

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role || 'admin');
          } else {
            setRole('admin');
          }
        } catch (error) {
          console.error('Error fetching role:', error);
          setRole('admin');
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Protect routes and handle redirects
  useEffect(() => {
    if (!loading) {
      const isPublicRoute = publicRoutes.includes(pathname);
      const isAuthRoute = ['/login', '/signup', '/register'].includes(pathname);

      // If there's no user and user tries to access a protected route (not a public route)
      if (!user && !isPublicRoute) {
        router.push('/login');
        return;
      } 
      
      // If user is logged in
      if (user) {
        // Staff role restrictions
        if (role === 'staff') {
          // Admin has full access, but staff has ONLY billing page
          // Explicitly restricting /products and /dashboard, plus anything else
          if (pathname !== '/billing' || isAuthRoute) {
            router.push('/billing');
            return;
          }
        } 
        // Admin or others going to auth pages
        else if (isAuthRoute) {
          router.push('/dashboard');
        }
      }
    }
  }, [user, role, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center space-y-4">
            <svg className="w-12 h-12 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500 font-medium">Loading session...</p>
          </div>
        </div>
      ) : (
        user && !publicRoutes.includes(pathname) ? (
          <DashboardLayout>{children}</DashboardLayout>
        ) : (
          children
        )
      )}
    </AuthContext.Provider>
  );
};
