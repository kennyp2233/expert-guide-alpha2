// src/modules/documents/components/DocumentList.tsx
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DocumentItem } from './DocumentItem';
import { DocumentUploadForm } from './DocumentUploadForm';
import { DocumentPreview } from './DocumentPreview';
import { useDocuments } from '../hooks/useDocuments';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface DocumentListProps {
    fincaId?: number;
    onUpdate?: () => void;
    readOnly?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
    fincaId,
    onUpdate,
    readOnly = false
}) => {
    const {
        documents,
        documentTypes,
        loading,
        selectedTab,
        selectedDocument,
        previewOpen,
        uploadOpen,
        selectedTypeId,
        isUpdateMode,
        stats,
        filteredDocuments,

        setSelectedTab,
        openUploadModal,
        openUpdateModal,
        openPreviewModal,
        closeUploadModal,
        closePreviewModal,
        handleDocumentUpload,
        refreshData
    } = useDocuments({ fincaId, readOnly });

    // Cuando se completa la subida/actualización, notificar al componente padre
    const handleUploadSuccess = async (values: any, file: File) => {
        const success = await handleDocumentUpload(values, file);
        if (success && onUpdate) {
            onUpdate();
        }
        return success;
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        Documentos requeridos
                        <span className="ml-auto text-sm font-normal">
                            <span className="font-semibold">{stats.uploaded}</span> de <span className="font-semibold">{stats.total}</span> documentos
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progreso de subida</span>
                            <span>{stats.progress}%</span>
                        </div>
                        <Progress value={stats.progress} className="h-2" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Aprobación</span>
                            <span>{stats.completionProgress}%</span>
                        </div>
                        <Progress value={stats.completionProgress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-xl font-bold">{stats.total}</p>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">En revisión</p>
                            <p className="text-xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">Aprobados</p>
                            <p className="text-xl font-bold">{stats.approved}</p>
                        </div>
                        <div className="bg-red-50 dark:bg-red-950 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">Rechazados</p>
                            <p className="text-xl font-bold">{stats.rejected}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Alerta de documentos pendientes */}
            {!readOnly && stats.required > stats.approved && (
                <Alert className="bg-amber-50 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Documentos obligatorios pendientes</AlertTitle>
                    <AlertDescription>
                        Debe completar todos los documentos obligatorios para poder proceder.
                    </AlertDescription>
                </Alert>
            )}

            {/* Alerta de aprobación completa */}
            {stats.required > 0 && stats.required === stats.approved && (
                <Alert className="bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Documentación completa</AlertTitle>
                    <AlertDescription>
                        Todos los documentos obligatorios han sido aprobados.
                    </AlertDescription>
                </Alert>
            )}

            {/* Tabs para filtrar documentos */}
            <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="all">
                        Todos ({documents.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        En revisión ({stats.pending})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                        Aprobados ({stats.approved})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                        Rechazados ({stats.rejected})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <div className="flex flex-col items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                <p>Cargando documentos...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {documentTypes.map(type => {
                                const doc = documents.find(d => d.id_tipo_documento === type.id);
                                return (
                                    <DocumentItem
                                        key={type.id}
                                        document={doc}
                                        documentType={type}
                                        onUpload={openUploadModal}
                                        onView={openPreviewModal}
                                        onUpdate={openUpdateModal}
                                        readOnly={readOnly}
                                    />
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pending" className="mt-0">
                    {filteredDocuments.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p className="text-muted-foreground">No hay documentos en revisión</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDocuments.map(doc => {
                                const type = documentTypes.find(t => t.id === doc.id_tipo_documento);
                                if (!type) return null;
                                return (
                                    <DocumentItem
                                        key={doc.id}
                                        document={doc}
                                        documentType={type}
                                        onUpload={openUploadModal}
                                        onView={openPreviewModal}
                                        onUpdate={openUpdateModal}
                                        readOnly={readOnly}
                                    />
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="approved" className="mt-0">
                    {filteredDocuments.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p className="text-muted-foreground">No hay documentos aprobados</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDocuments.map(doc => {
                                const type = documentTypes.find(t => t.id === doc.id_tipo_documento);
                                if (!type) return null;
                                return (
                                    <DocumentItem
                                        key={doc.id}
                                        document={doc}
                                        documentType={type}
                                        onUpload={openUploadModal}
                                        onView={openPreviewModal}
                                        onUpdate={openUpdateModal}
                                        readOnly={readOnly}
                                    />
                                );
                            })}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="rejected" className="mt-0">
                    {filteredDocuments.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p className="text-muted-foreground">No hay documentos rechazados</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredDocuments.map(doc => {
                                const type = documentTypes.find(t => t.id === doc.id_tipo_documento);
                                if (!type) return null;
                                return (
                                    <DocumentItem
                                        key={doc.id}
                                        document={doc}
                                        documentType={type}
                                        onUpload={openUploadModal}
                                        onView={openPreviewModal}
                                        onUpdate={openUpdateModal}
                                        readOnly={readOnly}
                                    />
                                );
                            })}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Modal para subir/actualizar documentos */}
            {uploadOpen && (
                <DocumentUploadForm
                    open={uploadOpen}
                    onClose={closeUploadModal}
                    documentTypeId={selectedTypeId}
                    document={selectedDocument}
                    isUpdate={isUpdateMode}
                    onSubmit={handleUploadSuccess}
                    documentTypes={documentTypes}
                />
            )}

            {/* Modal para previsualizar documentos */}
            {previewOpen && selectedDocument && (
                <DocumentPreview
                    open={previewOpen}
                    onClose={closePreviewModal}
                    document={selectedDocument}
                />
            )}
        </div>
    );
};

export default DocumentList;