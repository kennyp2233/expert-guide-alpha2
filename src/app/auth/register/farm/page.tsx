'use client';

import Link from 'next/link';
import { Rocket, ArrowLeft } from 'lucide-react';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { RegisterFarmForm } from '@/modules/auth/components/RegisterFarmForm';

export default function RegisterFarmPage() {
    return (
        <AuthGuard requireAuth={false}>
            <div className="flex min-h-screen flex-col bg-muted/5">
                {/* Header con logo y navegación */}
                <header className="flex h-16 items-center border-b px-4 md:px-6 bg-background">
                    <div className="flex items-center justify-between w-full">
                        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
                            <Rocket className="h-6 w-6 text-primary" />
                            <span className="text-primary">EHC ERP</span>
                        </Link>
                        <Link
                            href="/auth/login"
                            className="flex items-center text-sm font-medium hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver al inicio de sesión
                        </Link>
                    </div>
                </header>

                {/* Contenido principal */}
                <main className="flex-1 flex items-center justify-center p-4 md:p-6">
                    <div className="w-full max-w-lg">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold">Registro de Finca Florícola</h1>
                            <p className="mt-2 text-muted-foreground">
                                Complete el registro para empezar a utilizar nuestra plataforma
                            </p>
                        </div>

                        {/* El formulario gestiona internamente validación y envío */}
                        <RegisterFarmForm />

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p>
                                ¿Es un cliente comprador?{' '}
                                <Link href="/auth/register/client" className="text-primary hover:underline">
                                    Regístrese como cliente
                                </Link>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
