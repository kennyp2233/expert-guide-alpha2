// src/app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

export default function HomePage() {
  const router = useRouter();
  const hasHydrated = useAuthStore(state => state.hasHydrated);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  useEffect(() => {
    if (!hasHydrated) return;

    // Si no está logueado, al login. Si ya lo está, al dashboard.
    if (!isAuthenticated) {
      router.replace('/auth/login');
    } else {
      router.replace('/dashboard');
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Mientras esperamos rehidratación, mostramos spinner
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
