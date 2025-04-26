'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Filter, MoreHorizontal, User as UserIcon, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PendingApprovals } from '@/modules/users/components/PendingApprovals';
import { userService } from '@/modules/users/services/userService';
import { User } from '@/types/user';
import { useToast } from '@/shared/hooks/useToast';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

export default function UsuariosPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();
    const { user } = useAuthStore();

    // Verificar si el usuario es admin
    const isAdmin = user?.roles.some(role => role.nombre === 'ADMIN');

    // Cargar usuarios
    useEffect(() => {
        const fetchUsers = async () => {
            if (!isAdmin) return;

            try {
                setLoading(true);
                const usersList = await userService.getUsers();
                setUsers(usersList);
            } catch (error) {
                toast('Error al cargar los usuarios', 'error');
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [isAdmin, toast]);

    // Filtrar usuarios por búsqueda
    const filteredUsers = users.filter(user =>
        user.usuario.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.roles.some(role => role.nombre.toLowerCase().includes(search.toLowerCase()))
    );

    // Obtener badge para roles
    const getRoleBadge = (roleName: string) => {
        switch (roleName) {
            case 'ADMIN':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'FINCA':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'CLIENTE':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Si no es admin, mostrar mensaje de acceso denegado
    if (!isAdmin) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <UserIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
                        <p className="text-muted-foreground">
                            No tiene permisos para acceder a la gestión de usuarios.
                            Esta funcionalidad está disponible solo para administradores.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground">
                        Administre usuarios, roles y permisos del sistema
                    </p>
                </div>
            </div>

            <Tabs defaultValue="usuarios" className="w-full">
                <TabsList>
                    <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                    <TabsTrigger value="aprobaciones">Aprobaciones Pendientes</TabsTrigger>
                </TabsList>

                <TabsContent value="usuarios" className="space-y-6 mt-6">
                    {/* Búsqueda y Filtros */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar usuarios..."
                                className="pl-8"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtros
                        </Button>
                    </div>

                    {/* Lista de Usuarios */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            <div className="col-span-full flex justify-center py-8">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                    <p className="text-muted-foreground">Cargando usuarios...</p>
                                </div>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="col-span-full">
                                <Card>
                                    <CardContent className="py-8 text-center">
                                        <p className="text-muted-foreground">No se encontraron usuarios que coincidan con la búsqueda.</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            filteredUsers.map((user) => (
                                <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <CardTitle className="text-lg">{user.usuario}</CardTitle>
                                            <Badge className={user.activo
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }>
                                                {user.activo ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center text-muted-foreground">
                                            <Mail className="h-4 w-4 mr-2" />
                                            {user.email}
                                        </div>

                                        <div>
                                            <p className="text-muted-foreground mb-1">Roles</p>
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.length > 0 ? (
                                                    user.roles.map((role, index) => (
                                                        <Badge key={index} className={getRoleBadge(role.nombre)}>
                                                            {role.nombre}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Badge variant="outline">Sin roles</Badge>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Creado</p>
                                                <p>{new Date(user.createdAt || '').toLocaleDateString()}</p>
                                            </div>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="aprobaciones" className="mt-6">
                    <PendingApprovals />
                </TabsContent>
            </Tabs>
        </div>
    );
}