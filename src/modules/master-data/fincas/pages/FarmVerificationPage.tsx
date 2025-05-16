// src/modules/fincas/pages/FarmVerificationPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';
import { FarmVerificationList } from '../components/FarmVerificationList';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export function FarmVerificationPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Verificar si el usuario tiene permisos de admin
        if (user) {
            const hasAdminRole = user.roles.some(role => role.nombre === 'ADMIN');
            setIsAdmin(hasAdminRole);
        }
    }, [user]);

    if (!isAdmin) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-muted p-10 rounded-lg text-center">
                    <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-destructive" />
                    <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
                    <p className="text-muted-foreground mb-6">
                        No tiene permisos para acceder a esta sección. Esta área está reservada para administradores del sistema.
                    </p>
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <FarmVerificationList />
        </div>
    );
}