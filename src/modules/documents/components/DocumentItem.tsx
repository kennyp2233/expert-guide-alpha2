// src/modules/documents/components/DocumentItem.tsx
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DocumentType, Document } from '@/types/document';
import { formatDate } from '@/shared/utils/formatters';
import {
    FileText,
    Upload,
    Eye,
    RotateCw,
    AlertCircle,
    Clock,
    CheckCircle,
    XCircle
} from 'lucide-react';

interface DocumentItemProps {
    document?: Document;
    documentType: DocumentType;
    onUpload: (documentTypeId: number) => void;
    onView: (document: Document) => void;
    onUpdate: (document: Document) => void;
    readOnly?: boolean;
}

export const DocumentItem: React.FC<DocumentItemProps> = ({
    document,
    documentType,
    onUpload,
    onView,
    onUpdate,
    readOnly = false
}) => {
    const [isHovering, setIsHovering] = useState(false);

    // Obtener badge de estado
    const getStatusBadge = () => {
        if (!document) {
            return (
                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    <Clock className="mr-1 h-3 w-3" />
                    Pendiente de subir
                </Badge>
            );
        }

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

    return (
        <Card
            className={`overflow-hidden transition-all ${isHovering && !readOnly ? 'shadow-md' : ''}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center text-lg">
                        <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                        {documentType.nombre}
                    </CardTitle>
                    {getStatusBadge()}
                </div>
                {documentType.descripcion && (
                    <p className="text-sm text-muted-foreground">
                        {documentType.descripcion}
                        {documentType.es_obligatorio && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </p>
                )}
            </CardHeader>

            <CardContent>
                <div className="space-y-2">
                    {document && (
                        <>
                            {document.nombre_archivo && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Nombre del archivo:</p>
                                    <p className="font-medium truncate">{document.nombre_archivo}</p>
                                </div>
                            )}

                            {document.fecha_subida && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha de subida:</p>
                                    <p>{formatDate(document.fecha_subida)}</p>
                                </div>
                            )}

                            {document.fecha_revision && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Fecha de revisión:</p>
                                    <p>{formatDate(document.fecha_revision)}</p>
                                </div>
                            )}

                            {document.comentario && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Comentario:</p>
                                    <p className="text-sm">{document.comentario}</p>
                                </div>
                            )}
                        </>
                    )}

                    {!document && documentType.es_obligatorio && (
                        <div className="flex items-center py-2 text-amber-600 dark:text-amber-500">
                            <AlertCircle className="h-4 w-4 mr-2" />
                            <p className="text-sm">Documento obligatorio pendiente de subir</p>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className={`flex justify-end gap-2 ${document ? 'pt-0' : 'pt-2'}`}>
                {!document && !readOnly ? (
                    <Button
                        variant="outline"
                        onClick={() => onUpload(documentType.id)}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Subir Documento
                    </Button>
                ) : document && !readOnly ? (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView(document)}
                        >
                            <Eye className="mr-1 h-4 w-4" />
                            Ver
                        </Button>

                        {document.estado !== 'APROBADO' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onUpdate(document)}
                            >
                                <RotateCw className="mr-1 h-4 w-4" />
                                Actualizar
                            </Button>
                        )}
                    </>
                ) : document && readOnly ? (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(document)}
                    >
                        <Eye className="mr-1 h-4 w-4" />
                        Ver
                    </Button>
                ) : null}
            </CardFooter>
        </Card>
    );
};

export default DocumentItem;