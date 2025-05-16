// src/modules/fincas/pages/FarmProfilePage.tsx
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/shared/hooks/useToast';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';
import { FincaDataForm } from '../components/FincaDataForm';
import { DocumentsList } from '@/modules/documents/components/DocumentsList';
import { Farm } from '@/types/master-data/farm';

import { authService } from '@/modules/auth/services/authService';
import { Loader2, Home, FileText } from 'lucide-react';

export function FarmProfilePage() {
    const [finca, setFinca] = useState<Farm | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');
    const { user, getProfile } = useAuthStore(state => ({
        user: state.user,
        getProfile: state.getProfile
    }));
    const { toast } = useToast();

    // Cargar datos de la finca
    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                await getProfile();
            } catch (error) {
                toast('Error al cargar el perfil', 'error');
                console.error('Error loading profile:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Actualizar datos de finca cuando cambia el usuario
    useEffect(() => {
        if (user?.finca) {
            setFinca(user.finca as Farm);
        }
    }, [user]);

    // Manejar actualización de finca
    const handleFincaUpdate = (updatedFinca: Farm) => {
        setFinca(updatedFinca);
        // Recargar perfil completo para mantener actualizado el estado global
        getProfile();
    };

    // Manejar actualización de documentos
    const handleDocumentsUpdate = () => {
        // Recargar perfil para actualizar estado de documentos
        getProfile();
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
                    <FincaDataForm finca={finca} onUpdate={handleFincaUpdate} />
                </TabsContent>

                <TabsContent value="documents" className="mt-0">
                    <DocumentsList fincaId={finca.id} onUpdate={handleDocumentsUpdate} />
                </TabsContent>
            </Tabs>
        </div>
    );
}