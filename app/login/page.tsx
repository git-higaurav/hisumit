'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { account } from '@/lib/appwrite';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const user = await account.get();
        if (user) {
          router.push("/dashboard");
        }
      } catch (error) {
        // User is not authenticated, continue showing login form
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await account.createEmailPasswordSession(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] relative">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          {/* Gradient Circle */}
          <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/20 rounded-full transform rotate-12"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-0 left-0 w-full h-full">
            <svg className="w-full h-full opacity-5" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200"/>
              </pattern>
              <rect width="100" height="100" fill="url(#grid)"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="relative w-full max-w-md px-6">
        {/* Login Card */}
        <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
          {/* Header Section */}
          <div className="relative h-32 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute bottom-0 w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0 30 Q 25 0 50 15 Q 75 30 100 10 L 100 100 L 0 100" fill="#1A1A1A"/>
              </svg>
            </div>
            <div className="relative z-10 p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 py-6 -mt-6">
            <h1 className="text-2xl font-bold text-center text-white mb-1">Welcome Back</h1>
            <p className="text-gray-400 text-center text-sm mb-6">Sign in to continue to your account</p>

            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="rounded border-white/10 text-purple-500 focus:ring-purple-500 bg-white/5"
                  />
                  <label htmlFor="remember" className="ml-2 text-gray-300">
                    Remember me
                  </label>
                </div>
                <Link 
                  href="/forgot-password" 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg transition-transform ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
              <Link
                href="/"
                className="inline-flex items-center text-gray-400 hover:text-gray-300 text-sm group"
              >
                <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
