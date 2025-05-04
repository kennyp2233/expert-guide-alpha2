'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Plus } from 'lucide-react';
import { DocumentList } from '@/modules/documents/components/DocumentList';
import { UploadDocumentForm } from '@/modules/documents/components/UploadDocumentForm';
import { useAuthStore } from '@/modules/auth/stores/useAuthStore';

export default function DocumentosPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const { user } = useAuthStore();

    // Verificar si el usuario es admin o tiene permisos de admin
    const isAdmin = user?.roles.some(role => role.nombre === 'ADMIN');

    const handleUploadSuccess = () => {
        setIsOpen(false);
        // Trigger refresh of document list
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
                    <p className="text-muted-foreground">
                        {isAdmin
                            ? 'Gestione los documentos y certificaciones de las fincas'
                            : 'Gestione sus documentos y certificaciones'}
                    </p>
                </div>

                {!isAdmin && (
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Documento
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="sm:max-w-xl">
                            <SheetHeader>
                                <SheetTitle>Subir Nuevo Documento</SheetTitle>
                                <SheetDescription>
                                    Complete el formulario para subir un nuevo documento
                                </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6">
                                <UploadDocumentForm
                                    onSuccess={handleUploadSuccess}
                                />
                            </div>
                        </SheetContent>
                    </Sheet>
                )}
            </div>

            {isAdmin ? (
                <Tabs defaultValue="pendientes">
                    <TabsList>
                        <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                        <TabsTrigger value="todos">Todos</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pendientes" className="mt-6">
                        <DocumentList isAdmin={true} key={`pending-${refreshTrigger}`} />
                    </TabsContent>
                    <TabsContent value="todos" className="mt-6">
                        <div className="text-center py-4 text-muted-foreground">
                            Función en desarrollo - Próximamente podrá ver todos los documentos de todas las fincas
                        </div>
                    </TabsContent>
                </Tabs>
            ) : (
                <DocumentList key={`farm-${refreshTrigger}`} />
            )}
        </div>
    );
}