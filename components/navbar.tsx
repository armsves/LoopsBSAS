'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/shadcn/button';
import { Github, LogOut } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/github/check-auth');
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(data.authenticated || false);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/github/auth';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/github/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className='sticky top-0 z-50 border-b border-gray-6 bg-gray-2 backdrop-blur-sm'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        {/* Logo */}
        <Link href='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity'>
          <Image
            src='/chain-love-logo.svg'
            alt='ContribHub Logo'
            width={32}
            height={32}
            className='size-8'
          />
          <h1 className='text-xl font-bold text-gray-12'>ContribHub</h1>
        </Link>

        {/* GitHub Auth Button */}
        <div className='flex items-center gap-2'>
          {isCheckingAuth ? (
            <LoadingSpinner size={20} />
          ) : isAuthenticated ? (
            <Button
              variant='outline'
              onClick={handleLogout}
              className='flex items-center gap-2'
            >
              <LogOut className='size-4' />
              Logout
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              className='flex items-center gap-2'
            >
              <Github className='size-4' />
              Login with GitHub
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}


