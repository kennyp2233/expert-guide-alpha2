'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../stores/useAuthStore';

interface AuthGuardProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    allowedRoles?: string[];
}

export function AuthGuard({
    children,
    requireAuth = true,
    allowedRoles
}: AuthGuardProps) {
    const { isAuthenticated, user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Si requiere autenticación y no está autenticado, redirigir a login
        if (requireAuth && !isAuthenticated) {
            router.push(`/auth/login?returnUrl=${encodeURIComponent(pathname)}`);
            return;
        }

        // Si está autenticado pero accede a rutas de login/registro, redirigir a dashboard
        if (isAuthenticated && !requireAuth && (
            pathname.includes('/auth/login') ||
            pathname.includes('/auth/register')
        )) {
            router.push('/dashboard');
            return;
        }

        // Verificar roles si se especifican
        if (requireAuth && isAuthenticated && allowedRoles?.length && user) {
            const hasRequiredRole = user.roles.some((role: string) => allowedRoles.includes(role));
            if (!hasRequiredRole) {
                // Redirigir a una página de acceso denegado
                router.push('/access-denied');
            }
        }
    }, [isAuthenticated, pathname, requireAuth, router, allowedRoles, user]);

    // Si estamos verificando la autenticación y requiere auth, mostramos un loading
    if (requireAuth && !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Verificando sesión...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}