// src/app/dashboard/admin/fincas/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useFincasVerification } from '@/modules/master-data/fincas/hooks/useFinca';
import FarmVerificationForm from '@/modules/master-data/fincas/components/FarmVerificationForm';
import { ShieldAlert, Search, Filter, Eye } from 'lucide-react';
import { formatDate } from '@/shared/utils/formatters';

export default function FincasVerificationPage() {
    const {
        farms,
        loading,
        search,
        setSearch,
        filter,
        setFilter,
        selectedFarm,
        verificationModalOpen,
        openVerificationModal,
        closeVerificationModal,
        approveRole,
        rejectRole
    } = useFincasVerification();

    const router = useRouter();

    // Manejar verificación de finca
    const handleVerifyFarm = (farm: any) => {
        openVerificationModal(farm);
    };

    // Verificar si el usuario actual es admin
    const isAdmin = true; // Esto debería venir de un hook o contexto de autenticación

    if (!isAdmin) {
        return (
            <div className="container mx-auto p-6">
                <div className="bg-muted p-10 rounded-lg text-center">
                    <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-destructive" />
                    <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
                    <p className="text-muted-foreground mb-6">
                        No tiene permisos para acceder a esta sección. Esta área está reservada para administradores del sistema.
                    </p>
                    <Button variant="outline" onClick={() => router.push('/dashboard')}>
                        Volver al Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Fincas en Verificación</h2>
                    <p className="text-muted-foreground">
                        Gestione y verifique las fincas pendientes de aprobación
                    </p>
                </div>
            </header>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, tag, RUC, usuario o email..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las fincas</SelectItem>
                        <SelectItem value="with-documents">Con documentos</SelectItem>
                        <SelectItem value="pending">Documentos pendientes</SelectItem>
                        <SelectItem value="approved">Documentos aprobados</SelectItem>
                        <SelectItem value="rejected">Documentos rechazados</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        <p className="text-muted-foreground">Cargando fincas...</p>
                    </div>
                </div>
            ) : farms.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            No hay fincas en proceso de verificación
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {farms.map((farm) => (
                        <Card key={farm.finca.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold">{farm.finca.nombre_finca}</h3>
                                        <p className="text-muted-foreground">
                                            Usuario: {farm.usuario.usuario} ({farm.usuario.email})
                                        </p>
                                    </div>
                                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 mt-2 md:mt-0">
                                        Pendiente de verificación
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Identificación</p>
                                        <p>Tag: <span className="font-medium">{farm.finca.tag}</span></p>
                                        <p>RUC: <span className="font-medium">{farm.finca.ruc_finca}</span></p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fecha de registro</p>
                                        <p>{formatDate(farm.usuario.createdAt)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Progreso de verificación</p>
                                        <div className="flex items-center">
                                            <Progress
                                                value={farm.finca.progreso_verificacion?.porcentaje_aprobado}
                                                className="h-2 flex-1 mr-2"
                                            />
                                            <span className="text-sm font-medium">
                                                {farm.finca.progreso_verificacion?.porcentaje_aprobado}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button
                                        onClick={() => handleVerifyFarm(farm)}
                                        className="gap-2"
                                    >
                                        <Eye className="h-4 w-4" />
                                        Verificar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal de Verificación */}
            {verificationModalOpen && selectedFarm && (
                <FarmVerificationForm
                    farm={selectedFarm}
                    open={verificationModalOpen}
                    onClose={closeVerificationModal}
                    onApprove={approveRole}
                    onReject={rejectRole}
                />
            )}
        </div>
    );
}