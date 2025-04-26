'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
    User as UserIcon,
    Mail,
    Calendar,
    Building,
    Tag,
    FileText,
    ShieldCheck,
    ArrowLeft,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import { userService } from '@/modules/users/services/userService';
import { documentService } from '@/modules/documents/services/documentService';
import { User, UserRole } from '@/types/user';
import { Document } from '@/modules/documents/services/documentService';
import { useToast } from '@/shared/hooks/useToast';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

export default function UserDetailPage() {
    const { id } = useParams();
    const userId = Array.isArray(id) ? id[0] : id;
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [userRoles, setUserRoles] = useState<UserRole[]>([]);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { user: currentUser } = useAuthStore();

    // Verificar si el usuario actual es admin
    const isAdmin = currentUser?.roles.some(role => role.nombre === 'ADMIN');

    // Cargar datos del usuario
    useEffect(() => {
        const fetchUserData = async () => {
            if (!isAdmin || !userId) return;

            try {
                setLoading(true);

                // Cargar información del usuario
                const userData = await userService.getUser(userId);
                setUser(userData);

                // Cargar roles del usuario
                const userRolesData = await userService.getUserRoles(userId);
                setUserRoles(userRolesData);

                // Si es una finca, cargar sus documentos
                if (userData.finca) {
                    const docsData = await documentService.getFarmDocuments(userData.finca.id);
                    setDocuments(docsData);
                }
            } catch (error) {
                toast('Error al cargar los datos del usuario', 'error');
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, isAdmin, toast]);

    // Función para obtener el color del badge según el estado del rol
    const getRoleStatusColor = (status: string) => {
        switch (status) {
            case 'PENDIENTE':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
            case 'APROBADO':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'RECHAZADO':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
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

            // Recargar roles del usuario
            const userRolesData = await userService.getUserRoles(userId);
            setUserRoles(userRolesData);
        } catch (error) {
            toast('Error al aprobar el rol', 'error');
            console.error('Error approving role:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRole = async (userId: string, roleId: number) => {
        try {
            setLoading(true);
            await userService.rejectUserRole(userId, roleId);
            toast('Rol rechazado exitosamente', 'success');

            // Recargar roles del usuario
            const userRolesData = await userService.getUserRoles(userId);
            setUserRoles(userRolesData);
        } catch (error) {
            toast('Error al rechazar el rol', 'error');
            console.error('Error rejecting role:', error);
        } finally {
            setLoading(false);
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
                            No tiene permisos para acceder a los detalles de usuario.
                            Esta funcionalidad está disponible solo para administradores.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (loading && !user) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                    </Button>
                </div>
                <div className="flex justify-center py-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        <p className="text-muted-foreground">Cargando información del usuario...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <Button variant="outline" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                    </Button>
                </div>
                <Card>
                    <CardContent className="py-12 text-center">
                        <XCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
                        <h2 className="text-2xl font-bold mb-2">Usuario no encontrado</h2>
                        <p className="text-muted-foreground">
                            No se pudo encontrar la información del usuario solicitado.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Cabecera y navegación */}
            <div className="flex items-center gap-2 mb-4">
                <Button variant="outline" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                </Button>
            </div>

            {/* Información principal del usuario */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-2xl">{user.usuario}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                                <Mail className="h-4 w-4 mr-1" /> {user.email}
                            </CardDescription>
                        </div>
                        <Badge className={user.activo
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }>
                            {user.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div>
                        <p className="text-muted-foreground">ID del Usuario</p>
                        <p className="font-mono">{user.id}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Fecha de Registro</p>
                        <p>{formatDate(user.createdAt)}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Pestañas para la información detallada */}
            <Tabs defaultValue="roles" className="w-full">
                <TabsList>
                    <TabsTrigger value="roles">
                        <ShieldCheck className="h-4 w-4 mr-1" /> Roles
                    </TabsTrigger>
                    {user.finca && (
                        <TabsTrigger value="finca">
                            <Building className="h-4 w-4 mr-1" /> Finca
                        </TabsTrigger>
                    )}
                    {user.finca && (
                        <TabsTrigger value="documentos">
                            <FileText className="h-4 w-4 mr-1" /> Documentos
                        </TabsTrigger>
                    )}
                    {user.cliente && (
                        <TabsTrigger value="cliente">
                            <UserIcon className="h-4 w-4 mr-1" /> Cliente
                        </TabsTrigger>
                    )}
                </TabsList>

                {/* Pestaña de Roles */}
                <TabsContent value="roles" className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold">Roles Asignados</h3>
                    {userRoles.length === 0 ? (
                        <Card>
                            <CardContent className="py-6 text-center">
                                <p className="text-muted-foreground">Este usuario no tiene roles asignados</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {userRoles.map((userRole) => (
                                <Card key={userRole.id} className="overflow-hidden">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-center">
                                            <CardTitle>{userRole.rol?.nombre || 'Rol sin nombre'}</CardTitle>
                                            <Badge className={getRoleStatusColor(userRole.estado)}>
                                                {userRole.estado}
                                            </Badge>
                                        </div>
                                        {userRole.rol?.descripcion && (
                                            <CardDescription>{userRole.rol.descripcion}</CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-muted-foreground">Fecha de Asignación</p>
                                                <p>{formatDate(userRole.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Última Actualización</p>
                                                <p>{formatDate(userRole.updatedAt)}</p>
                                            </div>
                                        </div>

                                        {userRole.metadata && Object.keys(userRole.metadata).length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-muted-foreground mb-1">Metadata</p>
                                                <pre className="text-xs bg-secondary p-2 rounded-md overflow-auto">
                                                    {JSON.stringify(userRole.metadata, null, 2)}
                                                </pre>
                                            </div>
                                        )}

                                        {userRole.estado === 'PENDIENTE' && (
                                            <div className="flex justify-end gap-2 mt-4">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleRejectRole(user.id, userRole.id_rol)}
                                                    disabled={loading}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" /> Rechazar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 hover:text-green-700"
                                                    onClick={() => handleApproveRole(user.id, userRole.id_rol)}
                                                    disabled={loading}
                                                >
                                                    <CheckCircle2 className="h-4 w-4 mr-1" /> Aprobar
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Pestaña de Finca (si corresponde) */}
                {user.finca && (
                    <TabsContent value="finca" className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Información de la Finca</h3>
                        <Card>
                            <CardContent className="py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-muted-foreground">Nombre de la Finca</p>
                                        <p className="font-medium text-lg">{user.finca.nombre_finca}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Tag/Código</p>
                                        <div className="flex items-center">
                                            <Tag className="h-4 w-4 mr-1 text-muted-foreground" />
                                            <span>{user.finca.tag}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">RUC</p>
                                        <p>{user.finca.ruc_finca}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {/* Pestaña de Documentos (si es finca) */}
                {user.finca && (
                    <TabsContent value="documentos" className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Documentos de la Finca</h3>
                        {loading ? (
                            <div className="flex justify-center py-6">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                    <p className="text-muted-foreground">Cargando documentos...</p>
                                </div>
                            </div>
                        ) : documents.length === 0 ? (
                            <Card>
                                <CardContent className="py-6 text-center">
                                    <p className="text-muted-foreground">Esta finca no tiene documentos registrados</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {documents.map((doc) => (
                                    <Card key={doc.id} className="overflow-hidden">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle>{doc.tipoDocumento?.nombre || 'Documento'}</CardTitle>
                                                <Badge className={
                                                    doc.estado === 'PENDIENTE'
                                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                                                        : doc.estado === 'APROBADO'
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }>
                                                    {doc.estado}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {doc.nombre_archivo && (
                                                    <div className="md:col-span-2">
                                                        <p className="text-muted-foreground">Archivo</p>
                                                        <p>{doc.nombre_archivo}</p>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-muted-foreground">Fecha de Subida</p>
                                                    <p>{formatDate(doc.fecha_subida)}</p>
                                                </div>
                                                {doc.fecha_revision && (
                                                    <div>
                                                        <p className="text-muted-foreground">Fecha de Revisión</p>
                                                        <p>{formatDate(doc.fecha_revision)}</p>
                                                    </div>
                                                )}
                                                {doc.comentario && (
                                                    <div className="md:col-span-2">
                                                        <p className="text-muted-foreground">Comentario</p>
                                                        <p>{doc.comentario}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                )}

                {/* Pestaña de Cliente (si corresponde) */}
                {user.cliente && (
                    <TabsContent value="cliente" className="mt-6 space-y-4">
                        <h3 className="text-lg font-semibold">Información del Cliente</h3>
                        <Card>
                            <CardContent className="py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-muted-foreground">Nombre del Cliente</p>
                                        <p className="font-medium text-lg">{user.cliente.nombre}</p>
                                    </div>
                                    {user.cliente.ruc && (
                                        <div>
                                            <p className="text-muted-foreground">RUC/Identificación</p>
                                            <p>{user.cliente.ruc}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}