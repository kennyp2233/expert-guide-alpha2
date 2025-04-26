'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Rocket,
    Home,
    FileText,
    Users,
    Truck,
    Calendar,
    BarChart4,
    Settings,
    Menu,
    X,
    LogOut,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';
import { AuthGuard } from '@/modules/auth/components/AuthGuard';
import { ThemeToggle } from '@/shared/components/ThemeToggle';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
        icon: Home,
    },
    {
        title: 'Solicitudes',
        href: '/dashboard/solicitudes',
        icon: FileText,
    },
    {
        title: 'Clientes',
        href: '/dashboard/clientes',
        icon: Users,
    },
    {
        title: 'Logística',
        href: '/dashboard/logistica',
        icon: Truck,
    },
    {
        title: 'Calendario',
        href: '/dashboard/calendario',
        icon: Calendar,
    },
    {
        title: 'Reportes',
        href: '/dashboard/reportes',
        icon: BarChart4,
    },
    {
        title: 'Configuración',
        href: '/dashboard/configuracion',
        icon: Settings,
    },
];

function SidebarNav() {
    const pathname = usePathname();

    return (
        <nav className="grid items-start px-2 gap-2">
            {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={index}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                    >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [open, setOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated]);

    return (
        <AuthGuard>
            <div className="flex min-h-screen flex-col">
                {/* Mobile Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                            <div className="flex items-center gap-2 font-bold text-xl mb-6">
                                <Rocket className="h-6 w-6 text-primary" />
                                <span className="text-primary">EHC ERP</span>
                            </div>
                            <SidebarNav />
                        </SheetContent>
                    </Sheet>
                    <div className="flex items-center gap-2 font-bold text-xl">
                        <Rocket className="h-6 w-6 text-primary" />
                        <span className="text-primary">EHC ERP</span>
                    </div>
                    <div className="flex-1 flex justify-end gap-2">
                        <ThemeToggle />
                    </div>
                </header>

                <div className="flex flex-1">
                    {/* Sidebar (desktop) */}
                    <aside className="hidden lg:flex fixed z-30 inset-y-0 left-0 w-64 border-r bg-background flex-col">
                        <div className="flex items-center h-16 gap-2 font-bold text-xl px-4 border-b">
                            <Rocket className="h-6 w-6 text-primary" />
                            <span className="text-primary">EHC ERP</span>
                        </div>
                        <div className="flex-1 overflow-auto py-4">
                            <SidebarNav />
                        </div>

                        <div className="border-t p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="text-sm font-medium">{user?.usuario || 'Usuario'}</div>
                                </div>
                                <ThemeToggle />
                            </div>
                            <Separator className="my-2" />
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() => logout()}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 lg:ml-64">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}