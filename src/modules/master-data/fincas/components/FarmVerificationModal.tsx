// src/modules/fincas/components/FarmVerificationModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FincaDataForm } from './FincaDataForm';
import { DocumentReviewCard } from './DocumentReviewCard';
import { DocumentPreview } from '@/modules/documents/components/DocumentPreview';
import { fincaService } from '../services/fincaService';
import { documentService } from '@/modules/documents/services/documentService';
import { userService } from '@/modules/users/services/userService';
import { FarmInVerification, FarmDocumentVerification } from '@/types/master-data/farm';
import { Document, DocumentType } from '@/types/document';
import { useToast } from '@/shared/hooks/useToast';
import {
    AlertCircle,
    CheckCircle,
    XCircle,
    FileText,
    Home,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import { formatDate } from '@/shared/utils/formatters';

interface FarmVerificationModalProps {
    farm: FarmInVerification;
    open: boolean;
    onClose: () => void;
    onVerificationComplete: () => void;
}

export function FarmVerificationModal({
    farm,
    open,
    onClose,
    onVerificationComplete
}: FarmVerificationModalProps) {
    const [activeTab, setActiveTab] = useState('info');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [verification, setVerification] = useState<FarmDocumentVerification | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processingApproval, setProcessingApproval] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Cargar tipos de documentos
                const typesData = await documentService.getDocumentTypes();
                setDocumentTypes(typesData);

                // Cargar documentos de la finca
                const docsData = await documentService.getFarmDocuments(farm.finca.id);
                setDocuments(docsData);

                // Verificar estado de documentos
                const verificationData = await fincaService.verifyFincaDocuments(farm.finca.id);
                setVerification(verificationData);
            } catch (error) {
                toast('Error al cargar los datos de verificación', 'error');
                console.error('Error loading verification data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [farm.finca.id, toast]);

    // Manejar la aprobación de un documento
    const handleDocumentReview = async (document: Document, approved: boolean, comentario?: string) => {
        try {
            await documentService.reviewDocument({
                id: document.id,
                estado: approved ? 'APROBADO' : 'RECHAZADO',
                comentario,
            });

            toast(
                approved
                    ? 'Documento aprobado correctamente'
                    : 'Documento rechazado correctamente',
                'success'
            );

            // Recargar documentos y verificación
            const docsData = await documentService.getFarmDocuments(farm.finca.id);
            setDocuments(docsData);

            const verificationData = await fincaService.verifyFincaDocuments(farm.finca.id);
            setVerification(verificationData);
        } catch (error) {
            toast('Error al procesar el documento', 'error');
            console.error('Error reviewing document:', error);
        }
    };

    // Manejar la aprobación del rol de finca
    const handleApproveRole = async () => {
        setProcessingApproval(true);
        try {
            await userService.approveUserRole(
                farm.rol_pendiente.id_usuario,
                farm.rol_pendiente.id_rol
            );
            toast('Rol de finca aprobado correctamente', 'success');
            onVerificationComplete();
        } catch (error) {
            toast('Error al aprobar el rol de finca', 'error');
            console.error('Error approving role:', error);
            setProcessingApproval(false);
        }
    };

    // Manejar el rechazo del rol de finca
    const handleRejectRole = async () => {
        setProcessingApproval(true);
        try {
            await userService.rejectUserRole(
                farm.rol_pendiente.id_usuario,
                farm.rol_pendiente.id_rol
            );
            toast('Rol de finca rechazado', 'success');
            onVerificationComplete();
        } catch (error) {
            toast('Error al rechazar el rol de finca', 'error');
            console.error('Error rejecting role:', error);
            setProcessingApproval(false);
        }
    };

    // Determinar si todos los documentos obligatorios están aprobados
    const allRequiredDocumentsApproved = verification?.documentos_completos ?? false;

    return (
        <>
            <Dialog open={open} onOpenChange={(open) => !open && onClose()} className="min-w-[80vw]">
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Verificación de Finca</DialogTitle>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">{farm.finca.nombre_finca}</h2>
                                <p className="text-muted-foreground">
                                    Usuario: {farm.usuario.usuario} ({farm.usuario.email})
                                </p>
                            </div>
                            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 mt-2 md:mt-0">
                                Pendiente de verificación
                            </Badge>
                        </div>

                        <Card className="mb-6">
                            <CardContent className="py-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                                value={farm.finca.progreso_verificacion.porcentaje_aprobado}
                                                className="h-2 flex-1 mr-2"
                                            />
                                            <span className="text-sm font-medium">
                                                {farm.finca.progreso_verificacion.porcentaje_aprobado}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="info">
                                    <Home className="mr-2 h-4 w-4" />
                                    Información
                                </TabsTrigger>
                                <TabsTrigger value="documents">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Documentos
                                </TabsTrigger>
                                <TabsTrigger value="approval">
                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                    Aprobación
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="info" className="mt-0 space-y-4">
                                <FincaDataForm finca={farm.finca} readOnly={true} />
                            </TabsContent>

                            <TabsContent value="documents" className="mt-0 space-y-4">
                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                            <p className="text-muted-foreground">Cargando documentos...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Card>
                                            <CardHeader>
                                                <CardTitle>Documentos Requeridos</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-3 gap-4 mb-4">
                                                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                                                        <p className="text-sm text-muted-foreground">Total</p>
                                                        <p className="text-xl font-bold">{documents.length}</p>
                                                    </div>
                                                    <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                                                        <p className="text-sm text-muted-foreground">Aprobados</p>
                                                        <p className="text-xl font-bold">
                                                            {documents.filter(d => d.estado === 'APROBADO').length}
                                                        </p>
                                                    </div>
                                                    <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md">
                                                        <p className="text-sm text-muted-foreground">Rechazados</p>
                                                        <p className="text-xl font-bold">
                                                            {documents.filter(d => d.estado === 'RECHAZADO').length}
                                                        </p>
                                                    </div>
                                                </div>

                                                {verification?.tipos_pendientes.length ? (
                                                    <Alert variant="warning" className="mb-4">
                                                        <AlertCircle className="h-4 w-4" />
                                                        <AlertTitle>Documentos pendientes</AlertTitle>
                                                        <AlertDescription>
                                                            Faltan {verification.tipos_pendientes.length} documentos obligatorios por subir.
                                                        </AlertDescription>
                                                    </Alert>
                                                ) : verification?.documentos_completos ? (
                                                    <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300 mb-4">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <AlertTitle>Documentación completa</AlertTitle>
                                                        <AlertDescription>
                                                            Todos los documentos obligatorios han sido subidos y aprobados.
                                                        </AlertDescription>
                                                    </Alert>
                                                ) : null}
                                            </CardContent>
                                        </Card>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {documents.length === 0 ? (
                                                <div className="col-span-2 text-center py-8">
                                                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                                    <p className="text-muted-foreground">
                                                        La finca aún no ha subido ningún documento
                                                    </p>
                                                </div>
                                            ) : (
                                                documents.map(doc => (
                                                    <DocumentReviewCard
                                                        key={doc.id}
                                                        document={doc}
                                                        onView={() => {
                                                            setSelectedDocument(doc);
                                                            setPreviewModalOpen(true);
                                                        }}
                                                        onApprove={(comentario) => handleDocumentReview(doc, true, comentario)}
                                                        onReject={(comentario) => handleDocumentReview(doc, false, comentario)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </TabsContent>

                            <TabsContent value="approval" className="mt-0 space-y-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Aprobación de Rol de Finca</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {!verification ? (
                                            <div className="flex justify-center py-4">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                                    <p className="text-muted-foreground">Verificando documentos...</p>
                                                </div>
                                            </div>
                                        ) : verification.documentos_completos ? (
                                            <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                <CheckCircle className="h-4 w-4" />
                                                <AlertTitle>Documentación completa y verificada</AlertTitle>
                                                <AlertDescription>
                                                    Todos los documentos obligatorios han sido subidos y aprobados.
                                                    Puede proceder a aprobar el rol de finca.
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertTitle>Documentación incompleta</AlertTitle>
                                                <AlertDescription>
                                                    No se puede aprobar el rol de finca hasta que todos los documentos obligatorios
                                                    estén subidos y aprobados.
                                                </AlertDescription>
                                            </Alert>
                                        )}

                                        <Separator />

                                        <div className="space-y-2">
                                            <h3 className="font-medium">Información del Rol</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Usuario</p>
                                                    <p className="font-medium">{farm.usuario.usuario}</p>
                                                    <p className="text-sm">{farm.usuario.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">Rol solicitado</p>
                                                    <p className="font-medium">FINCA</p>
                                                    <p className="text-sm">Finca productora registrada en el sistema</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end gap-2 pt-4">
                                            <Button
                                                variant="outline"
                                                onClick={handleRejectRole}
                                                disabled={processingApproval}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                {processingApproval ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <XCircle className="mr-2 h-4 w-4" />
                                                )}
                                                Rechazar Rol
                                            </Button>
                                            <Button
                                                onClick={handleApproveRole}
                                                disabled={processingApproval || !verification?.documentos_completos}
                                                className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100"
                                            >
                                                {processingApproval ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                )}
                                                Aprobar Rol
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal para previsualizar documentos */}
            {previewModalOpen && selectedDocument && (
                <DocumentPreview
                    open={previewModalOpen}
                    onClose={() => {
                        setPreviewModalOpen(false);
                        setSelectedDocument(null);
                    }}
                    document={selectedDocument}
                />
            )}
        </>
    );
}