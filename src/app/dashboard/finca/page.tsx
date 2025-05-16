// src/app/dashboard/finca/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useFinca } from '@/modules/master-data/fincas/hooks/useFinca';
import FincaForm from '@/modules/master-data/fincas/components/FincaForm';
import DocumentList from '@/modules/documents/components/DocumentsList';
import { useToast } from '@/shared/hooks/useToast';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';
import { FincaFormValues } from '@/modules/master-data/fincas/schemas/fincaSchemas';
import { Home, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FincaProfilePage() {
    const [activeTab, setActiveTab] = useState('info');
    const { user } = useAuthStore();
    const { toast } = useToast();

    // Obtener ID de finca del usuario logueado
    const fincaId = user?.finca?.id;

    // Usar el hook de finca
    const {
        finca,
        validation,
        loading,
        updateFinca,
        refreshData
    } = useFinca(fincaId);

    // Manejar actualización de datos de finca
    const handleFincaUpdate = async (values: FincaFormValues) => {
        if (!finca) return;

        try {
            // Convert null values to undefined to match Partial<Farm> type
            const cleanValues = Object.entries(values).reduce((acc, [key, value]) => {
                acc[key] = value === null ? undefined : value;
                return acc;
            }, {} as Record<string, any>);

            await updateFinca(finca.id, cleanValues);
        } catch (error) {
            toast('Error al actualizar los datos de la finca', 'error');
            console.error('Error updating farm:', error);
        }
    };

    // Manejar actualización de documentos
    const handleDocumentsUpdate = () => {
        if (fincaId) {
            refreshData(fincaId);
        }
    };

    if (loading && !finca) {
        return (
            <div className="flex justify-center py-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Cargando perfil de finca...</p>
                </div>
            </div>
        );
    }

    if (!finca) {
        return (
            <div className="p-6">
                <div className="bg-muted p-6 rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-2">No se encontró información de finca</h2>
                    <p className="text-muted-foreground mb-4">
                        No tiene una finca asociada a su cuenta o no tiene permisos para acceder a esta sección.
                    </p>
                    <Button variant="outline" asChild>
                        <a href="/dashboard">Volver al dashboard</a>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <header>
                <h1 className="text-3xl font-bold">Perfil de Finca</h1>
                <p className="text-muted-foreground">
                    Gestione los datos de su finca y la documentación requerida
                </p>
            </header>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="info">
                        <Home className="mr-2 h-4 w-4" />
                        Información de la Finca
                    </TabsTrigger>
                    <TabsTrigger value="documents">
                        <FileText className="mr-2 h-4 w-4" />
                        Documentos
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-0">
                    <FincaForm
                        finca={finca}
                        validation={validation}
                        onSubmit={handleFincaUpdate}
                        loading={loading}
                    />
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                    <DocumentList
                        fincaId={finca.id}
                        onUpdate={handleDocumentsUpdate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}