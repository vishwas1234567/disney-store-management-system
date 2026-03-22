"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow border border-gray-100">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Sign Up</h1>
        {error && <div className="p-3 text-sm text-red-700 bg-red-50 rounded-md">{error}</div>}
        <form onSubmit={handleSignup} className="space-y-6">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email" className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500" />
          <button type="submit" disabled={isLoading} className="w-full py-2 px-4 shadow text-white bg-blue-600 rounded-lg hover:bg-blue-700">{isLoading ? 'Loading...' : 'Sign Up'}</button>
        </form>
        <p className="text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="text-blue-600">Sign in</Link></p>
      </div>
    </div>
  );
}
