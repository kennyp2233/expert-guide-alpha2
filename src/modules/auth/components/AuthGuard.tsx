// src/modules/auth/components/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    allowedRoles?: string[];
}

export function AuthGuard({
    children,
    requireAuth = true,
    allowedRoles,
}: AuthGuardProps) {
    const router = useRouter();
    // ← tres selectores independientes
    const hasHydrated = useAuthStore(state => state.hasHydrated);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);

    useEffect(() => {
        if (!hasHydrated) return;

        const returnUrl = window.location.pathname + window.location.search;

        if (requireAuth && !isAuthenticated) {
            router.push(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
            return;
        }

        if (!requireAuth && isAuthenticated &&
            (returnUrl.startsWith('/auth/login') ||
                returnUrl.startsWith('/auth/register'))) {
            router.push('/dashboard');
            return;
        }

        if (requireAuth && isAuthenticated && allowedRoles?.length && user) {
            const hasRole = user.roles.some(r => allowedRoles.includes(r.nombre));
            if (!hasRole) {
                router.push('/access-denied');
            }
        }
    }, [hasHydrated, isAuthenticated, requireAuth, allowedRoles, user, router]);

    if (!hasHydrated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
