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

    const hasHydrated = useAuthStore((s) => s.hasHydrated);
    const accessToken = useAuthStore((s) => s.accessToken);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const user = useAuthStore((s) => s.user);
    const getProfile = useAuthStore((s) => s.getProfile);

    useEffect(() => {
        if (!hasHydrated) return;

        // 1) Si tengo token pero aún no estoy marcado como "auth", reconstruyo perfil
        if (accessToken && !isAuthenticated) {
            getProfile();
            return;
        }

        const returnUrl = window.location.pathname + window.location.search;

        // 2) Ruta protegida y no hay token → envío al login
        if (requireAuth && !accessToken) {
            router.replace(`/auth/login?returnUrl=${encodeURIComponent(returnUrl)}`);
            return;
        }

        // 3) Ruta pública de auth y ya estoy logueado → voy al dashboard
        if (
            !requireAuth &&
            isAuthenticated &&
            (returnUrl.startsWith('/auth/login') ||
                returnUrl.startsWith('/auth/register'))
        ) {
            router.replace('/dashboard');
            return;
        }

        // 4) Control de roles
        if (
            requireAuth &&
            isAuthenticated &&
            allowedRoles?.length &&
            user
        ) {
            const hasRole = user.roles.some((r) =>
                allowedRoles.includes(r.nombre)
            );
            if (!hasRole) {
                router.replace('/access-denied');
            }
        }
    }, [
        hasHydrated,
        accessToken,
        isAuthenticated,
        requireAuth,
        allowedRoles,
        user,
        getProfile,
        router,
    ]);

    // Spinner mientras hidrata o valida perfil
    if (!hasHydrated || (accessToken && !isAuthenticated)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
