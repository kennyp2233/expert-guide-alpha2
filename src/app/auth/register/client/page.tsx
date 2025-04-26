'use client';

import Link from 'next/link';
import { Rocket, ArrowLeft } from 'lucide-react';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { RegisterClientForm } from '@/modules/auth/components/RegisterClientForm';

export default function RegisterClientPage() {
    return (
        <AuthGuard requireAuth={false}>
            <div className="flex min-h-screen flex-col">
                {/* Header con logo y navegación */}
                <header className="flex h-16 items-center border-b px-4 md:px-6">
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
                <main className="flex-1 flex items-center justify-center p-4 md:p-8 bg-muted/10">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold">Registro de Cliente</h1>
                            <p className="mt-2 text-muted-foreground">
                                Complete el formulario para acceder a nuestra plataforma
                            </p>
                        </div>

                        {/* Ahora sin props, el formulario se gestiona internamente */}
                        <RegisterClientForm />

                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            <p>
                                ¿Es una finca florícola?{' '}
                                <Link href="/auth/register/farm" className="text-primary hover:underline">
                                    Regístrese como finca
                                </Link>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
}
