// src/modules/documents/components/DocumentPreview.tsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Document } from '@/types/document';
import { formatDate } from '@/shared/utils/formatters';
import {
    Download,
    ExternalLink,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
} from 'lucide-react';

interface DocumentPreviewProps {
    open: boolean;
    onClose: () => void;
    document: Document;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
    open,
    onClose,
    document,
}) => {
    // Obtener badge según el estado
    const getStatusBadge = () => {
        switch (document.estado) {
            case 'PENDIENTE':
                return (
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                        <Clock className="mr-1 h-3 w-3" />
                        En revisión
                    </Badge>
                );
            case 'APROBADO':
                return (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Aprobado
                    </Badge>
                );
            case 'RECHAZADO':
                return (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        <XCircle className="mr-1 h-3 w-3" />
                        Rechazado
                    </Badge>
                );
            default:
                return (
                    <Badge variant="outline">
                        Desconocido
                    </Badge>
                );
        }
    };

    // Obtener la URL para visualizar el documento
    const getDocumentUrl = () => {
        // Aquí se construiría la URL según la estructura de almacenamiento
        return document.ruta_archivo || '#';
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <FileText className="mr-2 h-5 w-5" />
                            {document.tipoDocumento?.nombre || 'Documento'}
                        </div>
                        {getStatusBadge()}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Nombre del archivo</h3>
                        <p>{document.nombre_archivo || 'Sin nombre'}</p>
                    </div>

                    {document.tamano_archivo && (
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Tamaño</h3>
                            <p>{Math.round(document.tamano_archivo / 1024)} KB</p>
                        </div>
                    )}

                    {document.fecha_subida && (
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Fecha de subida</h3>
                            <p>{formatDate(document.fecha_subida)}</p>
                        </div>
                    )}

                    {document.fecha_revision && (
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Fecha de revisión</h3>
                            <p>{formatDate(document.fecha_revision)}</p>
                        </div>
                    )}
                </div>

                {document.comentario && (
                    <>
                        <Separator className="my-2" />
                        <div className="my-4">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Comentario</h3>
                            <p className="text-sm">{document.comentario}</p>
                        </div>
                    </>
                )}

                {/* Vista previa del documento */}
                <div className="w-full bg-muted rounded-md min-h-56 flex items-center justify-center mb-4">
                    {document.tipo_mime?.includes('image') ? (
                        // Si es una imagen, mostrarla directamente
                        <img
                            src={getDocumentUrl()}
                            alt={document.nombre_archivo || 'Documento'}
                            className="max-w-full max-h-96 object-contain"
                        />
                    ) : document.tipo_mime?.includes('pdf') ? (
                        // Si es un PDF, mostrar vista previa con object
                        <object
                            data={getDocumentUrl()}
                            type="application/pdf"
                            width="100%"
                            height="400"
                            className="border-0"
                        >
                            <p>Su navegador no puede mostrar el PDF. <a href={getDocumentUrl()} target="_blank" rel="noreferrer">Abrir PDF</a></p>
                        </object>
                    ) : (
                        // Para otros tipos de documentos
                        <div className="text-center p-4">
                            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <p>Vista previa no disponible para este tipo de documento</p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cerrar
                    </Button>
                    <Button variant="outline" asChild>
                        <a href={getDocumentUrl()} target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Abrir
                        </a>
                    </Button>
                    <Button asChild>
                        <a href={getDocumentUrl()} download={document.nombre_archivo}>
                            <Download className="mr-2 h-4 w-4" />
                            Descargar
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentPreview;