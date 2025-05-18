'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';

export default function Login() {
 
  const router = useRouter();
  const [user, setUser]=useState<Object | null>(null)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  

  useEffect(()=>{
    const getAuth = async()=>{
      try { 
      setLoading(true)
      const user = await account.get();
      if(user){
          router.push("/dashboard")
      }
      } catch (error) {
        setLoading(false)
        console.log(error)
      }
    }
    getAuth();
  },[])
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await account.createEmailPasswordSession(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A]">
      <div className="bg-[#1A1A1A] p-8 rounded-lg shadow-md w-96 border border-[#333333]">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-[#333333] bg-[#2A2A2A] px-3 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-purple-600 text-white py-2 px-4 rounded-md transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <a
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
