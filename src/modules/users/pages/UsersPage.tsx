// src/modules/users/pages/UsersPage.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Filter, MoreHorizontal, User as UserIcon, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PendingApprovals } from '@/modules/users/components/PendingApprovals';
import { userService } from '@/modules/users/services/userService';
import { User, Role } from '@/types/user';
import { useToast } from '@/shared/hooks/useToast';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

export const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();
    const currentUser = useAuthStore((state) => state.user);

    const isAdmin = useMemo(
        () => currentUser?.roles.some(r => r.nombre === 'ADMIN'),
        [currentUser]
    );
    console.log('isAdmin', currentUser);

    const fetchUsers = useCallback(async () => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Obtener usuarios crudos con asignacionRoles
            const rawList = await userService.getUsers();
            // Transformar asignacionRoles -> roles para uso en la UI
            const list = rawList.map(user => ({
                ...user,
                roles: (user.asignacionRoles?.map(ar => ar.rol).filter(role => role !== undefined) ?? []) as Role[],
            }));
            setUsers(list);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar usuarios';
            toast(message, 'error');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [isAdmin, toast]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return users;
        return users.filter(u =>
            u.usuario.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term) ||
            u.roles.some(role => role.nombre.toLowerCase().includes(term))
        );
    }, [users, search]);

    const getRoleBadgeClass = (roleName: string) => {
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

    if (!isAdmin) {
        return (
            <div className="p-6">
                <Card>
                    <CardContent className="py-12 text-center">
                        <UserIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <CardTitle>Acceso Restringido</CardTitle>
                        <p>No tienes permisos para gestionar usuarios.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
                    <p className="text-muted-foreground">Administra usuarios, roles y permisos.</p>
                </div>
            </header>

            <Tabs defaultValue="usuarios" className="w-full">
                <TabsList>
                    <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
                    <TabsTrigger value="aprobaciones">Aprobaciones Pendientes</TabsTrigger>
                </TabsList>

                <TabsContent value="usuarios" className="mt-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                aria-label="Buscar usuarios"
                                placeholder="Buscar usuarios..."
                                className="pl-10"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />Filtros
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                                <p>Cargando usuarios...</p>
                            </div>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p>No se encontraron usuarios.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredUsers.map(u => (
                                <Card key={u.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="flex justify-between items-center pb-2">
                                        <CardTitle className="text-lg">{u.usuario}</CardTitle>
                                        <Badge
                                            className={
                                                u.activo
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                            }
                                        >
                                            {u.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center text-muted-foreground">
                                            <Mail className="h-4 w-4 mr-2" />{u.email}
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Roles</p>
                                            <div className="flex flex-wrap gap-1">
                                                {u.roles.length ? (
                                                    u.roles.map(r => (
                                                        <Badge key={r.id} className={getRoleBadgeClass(r.nombre)}>
                                                            {r.nombre}
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
                                                <p>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</p>
                                            </div>
                                            <Button variant="ghost" size="icon" aria-label="Más opciones">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="aprobaciones" className="mt-6">
                    <PendingApprovals />
                </TabsContent>
            </Tabs>
        </div>
    );
};
