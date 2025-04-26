'use client';

import { Rocket } from 'lucide-react';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { LoginForm } from '@/modules/auth/components/LoginForm';

export default function LoginPage() {
    return (
        <AuthGuard requireAuth={false}>
            <div className="flex min-h-screen flex-col">
                <header className="flex h-16 items-center border-b px-4">
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Rocket className="h-6 w-6 text-primary" />
                        <span className="text-primary">EHC ERP</span>
                    </div>
                </header>

                <div className="grid flex-1 md:grid-cols-2">
                    {/* Formulario */}
                    <div className="flex items-center justify-center p-4 md:p-8">
                        <div className="w-full max-w-md">
                            <LoginForm />
                        </div>
                    </div>

                    {/* Imagen o banner lateral */}
                    <div className="hidden bg-gradient-to-r from-primary/10 to-background md:flex md:items-center md:justify-center">
                        <div className="relative h-full w-full max-w-2xl p-8">
                            <div className="absolute inset-0 bg-primary/5 rounded-xl"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
                                <div className="flex items-center gap-2 font-bold text-3xl text-primary">
                                    <Rocket className="h-10 w-10" />
                                    <span>EHC ERP</span>
                                </div>
                                <h2 className="text-2xl font-bold">Plataforma especializada en floricultura</h2>
                                <p className="text-muted-foreground max-w-md">
                                    Gestión logística, documentación certificada y fidelización de clientes en tiempo real.
                                </p>
                                {/* Ilustración decorativa */}
                                <div className="mt-6 w-full max-w-md p-4 bg-card rounded-lg shadow-md border">
                                    <div className="aspect-video w-full bg-primary/10 rounded-md flex items-center justify-center">
                                        <Rocket className="h-16 w-16 text-primary opacity-50" />
                                    </div>
                                    <div className="mt-4 space-y-2">
                                        <div className="h-4 w-3/4 bg-primary/20 rounded-full"></div>
                                        <div className="h-4 w-full bg-primary/10 rounded-full"></div>
                                        <div className="h-4 w-5/6 bg-primary/20 rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}