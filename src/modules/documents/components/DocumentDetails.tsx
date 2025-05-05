// src/modules/documents/components/DocumentDetails.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { documentService } from '../services/documentService';
import { useToast } from '@/shared/hooks/useToast';
import { Document } from '@/types/document';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { DocumentViewer } from './DocumentViewer';

interface DocumentDetailsProps {
    documentId: string;
    isAdmin?: boolean;
    onBack?: () => void;
}

export function DocumentDetails({ documentId, isAdmin = false, onBack }: DocumentDetailsProps) {
    const [document, setDocument] = useState<Document | null>(null);
    const [loading, setLoading] = useState(true);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [rejectionComment, setRejectionComment] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                setLoading(true);
                // Esta es una simulación - en una implementación real, necesitaríamos
                // un endpoint para obtener un solo documento por ID
                const docs = isAdmin
                    ? await documentService.getPendingDocuments()
                    : await documentService.getFarmDocuments();

                const doc = docs.find(d => d.id === documentId);

                if (doc) {
                    setDocument(doc);
                } else {
                    toast('Documento no encontrado', 'error');
                    if (onBack) onBack();
                }
            } catch (error) {
                toast('Error al cargar el documento', 'error');
                console.error('Error fetching document:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId, isAdmin, onBack]);

    // Función para obtener el color del badge según el estado
    const getStatusColor = (status: string) => {
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

    // Función para manejar la aprobación de documentos
    const handleApproveDocument = async () => {
        if (!document) return;

        try {
            setReviewLoading(true);
            await documentService.reviewDocument({
                id: document.id,
                estado: 'APROBADO',
                comentario: 'Documento aprobado'
            });

            toast('Documento aprobado exitosamente', 'success');

            // Redireccionar o volver
            if (onBack) {
                onBack();
            } else {
                router.push('/dashboard/documentos');
            }

        } catch (error) {
            toast('Error al aprobar el documento', 'error');
            console.error('Error approving document:', error);
        } finally {
            setReviewLoading(false);
        }
    };

    // Función para manejar el rechazo de documentos
    const handleRejectDocument = async () => {
        if (!document) return;

        if (!rejectionComment.trim()) {
            toast('Debe proporcionar un comentario para rechazar el documento', 'error');
            return;
        }

        try {
            setReviewLoading(true);
            await documentService.reviewDocument({
                id: document.id,
                estado: 'RECHAZADO',
                comentario: rejectionComment
            });

            toast('Documento rechazado exitosamente', 'success');

            // Redireccionar o volver
            if (onBack) {
                onBack();
            } else {
                router.push('/dashboard/documentos');
            }

        } catch (error) {
            toast('Error al rechazar el documento', 'error');
            console.error('Error rejecting document:', error);
        } finally {
            setReviewLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Cargando documento...</p>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="text-center py-8">
                <XCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
                <h2 className="text-xl font-bold mb-2">Documento no encontrado</h2>
                <p className="text-muted-foreground mb-4">
                    No se pudo encontrar el documento solicitado.
                </p>
                <Button onClick={onBack || (() => router.back())}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={onBack || (() => router.back())}>
                            <ArrowLeft className="h-4 w-4 mr-1" /> Volver
                        </Button>
                        <CardTitle>{document.tipoDocumento?.nombre || 'Documento'}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(document.estado)}>
                        {document.estado === 'PENDIENTE' ? 'Pendiente' :
                            document.estado === 'APROBADO' ? 'Aprobado' : 'Rechazado'}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
                {/* Información de la finca (si es admin) */}
                {isAdmin && document.finca && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Información de la Finca</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-md">
                            <div>
                                <p className="text-muted-foreground">Nombre</p>
                                <p className="font-medium">{document.finca.nombre_finca}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Código</p>
                                <p className="font-medium">{document.finca.tag}</p>
                            </div>
                            {document.finca.ruc_finca && (
                                <div>
                                    <p className="text-muted-foreground">RUC</p>
                                    <p>{document.finca.ruc_finca}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Información del documento */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Detalles del Documento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/30 p-4 rounded-md">
                        <div>
                            <p className="text-muted-foreground">Tipo</p>
                            <p className="font-medium">{document.tipoDocumento?.nombre || 'N/A'}</p>
                            {document.tipoDocumento?.descripcion && (
                                <p className="text-sm text-muted-foreground">
                                    {document.tipoDocumento.descripcion}
                                </p>
                            )}
                        </div>
                        <div>
                            <p className="text-muted-foreground">Estado</p>
                            <p className="font-medium">{document.estado}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground">Fecha de Subida</p>
                            <p>{formatDate(document.fecha_subida)}</p>
                        </div>
                        {document.fecha_revision && (
                            <div>
                                <p className="text-muted-foreground">Fecha de Revisión</p>
                                <p>{formatDate(document.fecha_revision)}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Información del archivo */}
                {document.nombre_archivo && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Archivo</h3>
                        <div className="bg-secondary/30 p-4 rounded-md">
                            <div className="mb-2">
                                <p className="text-muted-foreground">Nombre del archivo</p>
                                <p className="font-medium">{document.nombre_archivo}</p>
                            </div>
                            {document.tamano_archivo && (
                                <div className="mb-2">
                                    <p className="text-muted-foreground">Tamaño</p>
                                    <p>{(document.tamano_archivo / 1024).toFixed(2)} KB</p>
                                </div>
                            )}
                            {document.tipo_mime && (
                                <div className="mb-4">
                                    <p className="text-muted-foreground">Tipo</p>
                                    <p>{document.tipo_mime}</p>
                                </div>
                            )}
                            {document.ruta_archivo && (
                                <Button variant="outline">
                                    <Download className="mr-2 h-4 w-4" />
                                    Descargar Archivo
                                </Button>
                            )}
                        </div>
                    </div>
                )}

                {document.ruta_archivo && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Vista Previa</h3>
                        <DocumentViewer
                            url={document.ruta_archivo}
                            mimeType={document.tipo_mime || 'application/pdf'}
                        />
                    </div>
                )}

                {/* Comentarios */}
                {document.comentario && (
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Comentarios</h3>
                        <div className="bg-secondary/30 p-4 rounded-md">
                            <p>{document.comentario}</p>
                        </div>
                    </div>
                )}

                {/* Forma de revisión para admin cuando el estado es PENDIENTE */}
                {isAdmin && document.estado === 'PENDIENTE' && (
                    <div className="space-y-2 mt-6">
                        <Separator className="my-4" />
                        <h3 className="text-lg font-semibold">Revisar Documento</h3>

                        <div className="space-y-4">
                            <Textarea
                                placeholder="Comentarios de revisión (requerido para rechazar)"
                                value={rejectionComment}
                                onChange={(e) => setRejectionComment(e.target.value)}
                                className="min-h-[100px]"
                            />

                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={handleRejectDocument}
                                    disabled={reviewLoading}
                                >
                                    {reviewLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <XCircle className="mr-2 h-4 w-4" />
                                    )}
                                    Rechazar
                                </Button>

                                <Button
                                    variant="outline"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={handleApproveDocument}
                                    disabled={reviewLoading}
                                >
                                    {reviewLoading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                    )}
                                    Aprobar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
                <Button variant="outline" onClick={onBack || (() => router.back())}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver
                </Button>

                {document.ruta_archivo && (
                    <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}