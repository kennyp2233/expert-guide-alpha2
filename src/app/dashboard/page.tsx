'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings, BarChart4, FileText, Truck, Calendar } from 'lucide-react';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    
    const modules = [
        {
            title: 'Solicitudes',
            description: 'Gestionar solicitudes de exportación',
            icon: FileText,
            href: '/dashboard/solicitudes',
            color: 'bg-blue-100 dark:bg-blue-900',
        },
        {
            title: 'Clientes',
            description: 'Administrar clientes y contratos',
            icon: User,
            href: '/dashboard/clientes',
            color: 'bg-green-100 dark:bg-green-900',
        },
        {
            title: 'Logística',
            description: 'Control de envíos y rastreo',
            icon: Truck,
            href: '/dashboard/logistica',
            color: 'bg-amber-100 dark:bg-amber-900',
        },
        {
            title: 'Calendario',
            description: 'Programación de cortes y envíos',
            icon: Calendar,
            href: '/dashboard/calendario',
            color: 'bg-purple-100 dark:bg-purple-900',
        },
        {
            title: 'Reportes',
            description: 'Estadísticas y análisis',
            icon: BarChart4,
            href: '/dashboard/reportes',
            color: 'bg-red-100 dark:bg-red-900',
        },
        {
            title: 'Configuración',
            description: 'Ajustes de cuenta y sistema',
            icon: Settings,
            href: '/dashboard/configuracion',
            color: 'bg-gray-100 dark:bg-gray-800',
        },
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Bienvenida */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
                    <p className="text-muted-foreground">
                        Bienvenido, {user?.username || 'Usuario'}, al sistema de gestión EHC ERP para floricultura
                    </p>
                </div>
            </div>

            {/* Grid de módulos */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {modules.map((module, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-md ${module.color}`}>
                                    <module.icon className="h-5 w-5" />
                                </div>
                                <CardTitle>{module.title}</CardTitle>
                            </div>
                            <CardDescription>{module.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => router.push(module.href)}
                            >
                                Acceder
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Estadísticas o widgets adicionales */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {['Solicitudes Pendientes', 'Envíos en Proceso', 'Clientes Activos', 'Variedades'].map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <CardDescription>{stat}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {Math.floor(Math.random() * 100)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}