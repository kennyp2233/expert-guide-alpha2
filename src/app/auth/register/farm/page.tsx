'use client';

import Link from 'next/link';
import { Rocket, ArrowLeft } from 'lucide-react';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { RegisterFarmForm } from '@/modules/auth/components/RegisterFarm';

export default function RegisterFarmPage() {
    return (
        <AuthGuard requireAuth={false}>
            <div className="flex min-h-screen flex-col">
                <header className="flex h-16 items-center border-b px-4">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 font-bold text-xl">
                            <Rocket className="h-6 w-6 text-primary" />
                            <span className="text-primary">EHC ERP</span>
                        </div>
                        <Link href="/auth/login" className="flex items-center text-sm font-medium hover:text-primary">
                            <ArrowLeft className="mr-1 h-4 w-4" /> Volver al inicio de sesión
                        </Link>
                    </div>
                </header>

                <div className="flex-1 p-4 md:p-8">
                    <div className="mx-auto max-w-5xl">
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold">Registro de Finca Florícola</h1>
                            <p className="mt-2 text-muted-foreground">
                                Complete el registro para empezar a utilizar nuestra plataforma de exportación
                            </p>
                        </div>

                        <RegisterFarmForm />

                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            <p>
                                Al registrarse, usted acepta nuestros{' '}
                                <Link href="/terms" className="text-primary hover:underline">
                                    Términos de Servicio
                                </Link>{' '}
                                y{' '}
                                <Link href="/privacy" className="text-primary hover:underline">
                                    Política de Privacidad
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}