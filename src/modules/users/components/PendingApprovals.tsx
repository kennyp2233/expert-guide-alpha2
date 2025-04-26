'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { userService } from '../services/userService';
import { useToast } from '@/shared/hooks/useToast';
import { PendingApprovalsResponse } from '@/types/user';

export function PendingApprovals() {
    const [pendingApprovals, setPendingApprovals] = useState<PendingApprovalsResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    // Función para cargar las aprobaciones pendientes
    const loadPendingApprovals = async () => {
        try {
            setLoading(true);
            const approvals = await userService.getPendingApprovals();
            setPendingApprovals(approvals);
        } catch (error) {
            toast('Error al cargar las aprobaciones pendientes', 'error');
            console.error('Error loading pending approvals:', error);
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        loadPendingApprovals();
    }, []);

    // Filtrar aprobaciones por búsqueda
    const filteredApprovals = pendingApprovals.filter(approval =>
        approval.usuario.usuario.toLowerCase().includes(search.toLowerCase()) ||
        approval.usuario.email.toLowerCase().includes(search.toLowerCase()) ||
        approval.rol.nombre.toLowerCase().includes(search.toLowerCase())
    );

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Manejar aprobación/rechazo de roles
    const handleApproveRole = async (userId: string, roleId: number) => {
        try {
            setLoading(true);
            await userService.approveUserRole(userId, roleId);
            toast('Rol aprobado exitosamente', 'success');
            // Recargar la lista
            loadPendingApprovals();
        } catch (error) {
            toast('Error al aprobar el rol', 'error');
            console.error('Error approving role:', error);
            setLoading(false);
        }
    };

    const handleRejectRole = async (userId: string, roleId: number) => {
        try {
            setLoading(true);
            await userService.rejectUserRole(userId, roleId);
            toast('Rol rechazado exitosamente', 'success');
            // Recargar la lista
            loadPendingApprovals();
        } catch (error) {
            toast('Error al rechazar el rol', 'error');
            console.error('Error rejecting role:', error);
            setLoading(false);
        }
    };

    if (loading && pendingApprovals.length === 0) {
        return (
            <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Cargando aprobaciones pendientes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Aprobaciones Pendientes</h2>
                    <p className="text-muted-foreground">
                        Gestione las solicitudes de roles pendientes de aprobación
                    </p>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar por usuario, email o rol..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Lista de aprobaciones pendientes */}
            <div className="grid gap-4">
                {filteredApprovals.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">
                                {pendingApprovals.length === 0
                                    ? 'No hay solicitudes pendientes de aprobación'
                                    : 'No se encontraron solicitudes que coincidan con la búsqueda'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredApprovals.map((approval) => (
                        <Card key={approval.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-lg">
                                        {approval.usuario.usuario}
                                    </CardTitle>
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                                        Pendiente
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Email</p>
                                        <p>{approval.usuario.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Rol Solicitado</p>
                                        <p className="font-medium">{approval.rol.nombre}</p>
                                        {approval.rol.descripcion && (
                                            <p className="text-xs text-muted-foreground">{approval.rol.descripcion}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Fecha de Solicitud</p>
                                        <p>{formatDate(approval.createdAt)}</p>
                                    </div>

                                    {approval.metadata && Object.keys(approval.metadata).length > 0 && (
                                        <div className="md:col-span-3">
                                            <p className="text-muted-foreground">Información Adicional</p>
                                            <pre className="text-xs bg-secondary p-2 rounded-md mt-1 overflow-auto">
                                                {JSON.stringify(approval.metadata, null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    <div className="md:col-span-3 flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => handleRejectRole(approval.id_usuario, approval.id_rol)}
                                            disabled={loading}
                                        >
                                            <X className="mr-2 h-4 w-4" />
                                            Rechazar
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="text-green-600 hover:text-green-700"
                                            onClick={() => handleApproveRole(approval.id_usuario, approval.id_rol)}
                                            disabled={loading}
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Aprobar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}