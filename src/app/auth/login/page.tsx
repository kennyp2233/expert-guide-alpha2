'use client';

import { Rocket } from 'lucide-react';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { LoginForm } from '@/modules/auth/components/LoginForm';

export default function LoginPage() {
    return (
        <AuthGuard requireAuth={false}>
            <div className="flex min-h-screen flex-col bg-muted/5">
                {/* Header con logo */}
                <header className="flex h-16 items-center border-b px-4 md:px-6 bg-background">
                    <div className="flex items-center gap-2 font-semibold text-xl">
                        <Rocket className="h-6 w-6 text-primary" />
                        <span className="text-primary">EHC ERP</span>
                    </div>
                </header>

                {/* Contenido principal con diseño responsive */}
                <div className="grid flex-1 md:grid-cols-2">
                    {/* Formulario */}
                    <div className="flex items-center justify-center p-4 md:p-6">
                        <div className="w-full max-w-md">
                            <div className="mb-6 md:hidden text-center">
                                <h1 className="text-2xl font-bold">Bienvenido al Sistema</h1>
                                <p className="mt-2 text-muted-foreground">
                                    Inicie sesión para continuar
                                </p>
                            </div>
                            <LoginForm />
                        </div>
                    </div>

                    {/* Banner lateral (solo en pantallas medianas y grandes) */}
                    <div className="hidden md:flex md:flex-col md:justify-center bg-gradient-to-br from-primary/10 to-background p-4 md:p-6">
                        <div className="max-w-md mx-auto space-y-6">
                            <div className="flex items-center justify-center">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Rocket className="h-10 w-10 text-primary" />
                                </div>
                            </div>
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold">Plataforma de Gestión Florícola</h1>
                                <p className="text-muted-foreground">
                                    Gestión eficiente de su producción, logística y ventas
                                </p>
                            </div>

                            {/* Características destacadas */}
                            <div className="bg-card shadow-sm rounded-lg p-4 space-y-4">
                                <h2 className="font-semibold text-center">Características principales</h2>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                                        <span>Gestión integrada de la cadena de suministro</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                                        <span>Seguimiento de producción en tiempo real</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                                        <span>Control de calidad y certificaciones</span>
                                    </li>
                                    <li className="flex items-center">
                                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                                        <span>Exportación simplificada y documentación</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}