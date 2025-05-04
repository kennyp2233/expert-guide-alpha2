'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Search, Filter, Download, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { documentService } from '../services/documentService';
import { useToast } from '@/shared/hooks/useToast';
import { Document } from '@/types/document';

interface DocumentListProps {
    isAdmin?: boolean;
}

export function DocumentList({ isAdmin = false }: DocumentListProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setLoading(true);
                let docs: Document[];

                if (isAdmin) {
                    docs = await documentService.getPendingDocuments();
                } else {
                    docs = await documentService.getFarmDocuments();
                }

                setDocuments(docs);
            } catch (error) {
                toast(
                    'Error al cargar los documentos',
                    'error'
                );
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [isAdmin, toast]);

    // Filtrar documentos según la búsqueda
    const filteredDocuments = documents.filter(doc =>
        (doc.tipoDocumento?.nombre || '').toLowerCase().includes(search.toLowerCase()) ||
        (doc.estado || '').toLowerCase().includes(search.toLowerCase()) ||
        (doc.nombre_archivo || '').toLowerCase().includes(search.toLowerCase()) ||
        (doc.finca?.nombre_finca || '').toLowerCase().includes(search.toLowerCase())
    );

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

    // Función para manejar la revisión de documentos
    const handleReviewDocument = async (documentId: string, estado: 'APROBADO' | 'RECHAZADO') => {
        try {
            setLoading(true);
            await documentService.reviewDocument({
                id: documentId, // Corregido: ahora es 'id' en lugar de 'id_documento'
                estado,
                comentario: estado === 'RECHAZADO' ? 'Documento rechazado' : 'Documento aprobado'
            });

            // Recargar los documentos
            if (isAdmin) {
                const docs = await documentService.getPendingDocuments();
                setDocuments(docs);
            } else {
                const docs = await documentService.getFarmDocuments();
                setDocuments(docs);
            }

            toast(
                `Documento ${estado === 'APROBADO' ? 'aprobado' : 'rechazado'} exitosamente`,
                'success'
            );
        } catch (error) {
            toast(
                `Error al ${estado === 'APROBADO' ? 'aprobar' : 'rechazar'} el documento`,
                'error'
            );
            console.error('Error reviewing document:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="text-muted-foreground">Cargando documentos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Documentos</h2>
                    <p className="text-muted-foreground">
                        {isAdmin
                            ? 'Documentos pendientes de revisión'
                            : 'Gestione sus documentos y certificaciones'}
                    </p>
                </div>
                {!isAdmin && (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Documento
                    </Button>
                )}
            </div>

            {/* Búsqueda y Filtros */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar documentos..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros
                </Button>
            </div>

            {/* Lista de Documentos */}
            <div className="grid gap-4">
                {filteredDocuments.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground">No se encontraron documentos que coincidan con la búsqueda.</p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredDocuments.map((document) => (
                        <Card key={document.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <CardTitle className="text-lg">{document.tipoDocumento?.nombre || 'Documento'}</CardTitle>
                                    </div>
                                    <Badge className={getStatusColor(document.estado)}>
                                        {document.estado === 'PENDIENTE' ? 'Pendiente' :
                                            document.estado === 'APROBADO' ? 'Aprobado' : 'Rechazado'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    {isAdmin && document.finca && (
                                        <div>
                                            <p className="text-muted-foreground">Finca</p>
                                            <p>{document.finca.nombre_finca} ({document.finca.tag})</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-muted-foreground">Tipo</p>
                                        <p>{document.tipoDocumento?.descripcion || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Fecha Subida</p>
                                        <p>{formatDate(document.fecha_subida)}</p>
                                    </div>
                                    {document.fecha_revision && (
                                        <div>
                                            <p className="text-muted-foreground">Fecha Revisión</p>
                                            <p>{formatDate(document.fecha_revision)}</p>
                                        </div>
                                    )}
                                    {document.nombre_archivo && (
                                        <div className="md:col-span-3">
                                            <p className="text-muted-foreground">Archivo</p>
                                            <p>{document.nombre_archivo} ({(document.tamano_archivo || 0) / 1024} KB)</p>
                                        </div>
                                    )}
                                    {document.comentario && (
                                        <div className="md:col-span-3">
                                            <p className="text-muted-foreground">Comentario</p>
                                            <p>{document.comentario}</p>
                                        </div>
                                    )}
                                    <div className="md:col-span-3 flex justify-end gap-2">
                                        {document.ruta_archivo && (
                                            <Button variant="outline" size="sm">
                                                <Download className="mr-2 h-4 w-4" />
                                                Descargar
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm">
                                            <Eye className="mr-2 h-4 w-4" />
                                            Ver Detalles
                                        </Button>
                                        {isAdmin && document.estado === 'PENDIENTE' && (
                                            <>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-green-600 hover:text-green-700"
                                                    onClick={() => handleReviewDocument(document.id, 'APROBADO')}
                                                    disabled={loading}
                                                >
                                                    Aprobar
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="text-red-600 hover:text-red-700"
                                                    onClick={() => handleReviewDocument(document.id, 'RECHAZADO')}
                                                    disabled={loading}
                                                >
                                                    Rechazar
                                                </Button>
                                            </>
                                        )}
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