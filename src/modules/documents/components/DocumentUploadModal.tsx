// src/modules/fincas/components/DocumentUploadModal.tsx
'use client';

import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/shared/hooks/useToast';
import { documentService } from '@/modules/documents/services/documentService';
import { Document, DocumentType } from '@/types/document';
import { Loader2, Upload, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DocumentUploadModalProps {
    open: boolean;
    onClose: () => void;
    documentTypeId: number | null;
    document: Document | null;
    isUpdate: boolean;
    onUploadSuccess: () => void;
    documentTypes: DocumentType[];
}

export function DocumentUploadModal({
    open,
    onClose,
    documentTypeId,
    document,
    isUpdate,
    onUploadSuccess,
    documentTypes
}: DocumentUploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [comentario, setComentario] = useState(document?.comentario || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const documentType = documentTypeId
        ? documentTypes.find(t => t.id === documentTypeId)
        : document?.tipoDocumento || null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (isUpdate && !file && !comentario && document) {
            // Si es actualización y no hay cambios, simplemente cerramos
            onClose();
            return;
        }

        if (!file && !isUpdate) {
            setError('Debe seleccionar un archivo');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isUpdate && document) {
                // Actualizar documento existente
                await documentService.updateDocument(document.id, file || undefined, comentario || undefined);
                toast('Documento actualizado correctamente', 'success');
            } else if (!isUpdate && documentTypeId && file) {
                // Crear nuevo documento y subir archivo
                const createResponse = await documentService.createDocument({
                    id_tipo_documento: documentTypeId,
                    comentario: comentario || undefined
                });

                await documentService.uploadDocumentFile(createResponse.documento.id, file);
                toast('Documento subido correctamente', 'success');
            }

            onUploadSuccess();
        } catch (error) {
            console.error('Error uploading document:', error);
            setError(error instanceof Error ? error.message : 'Error al subir el documento');
            toast('Error al subir el documento', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isUpdate ? 'Actualizar documento' : 'Subir nuevo documento'}</DialogTitle>
                </DialogHeader>

                {documentType && (
                    <div className="mb-4">
                        <div className="flex items-center mb-2">
                            <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                            <h3 className="font-medium">{documentType.nombre}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">{documentType.descripcion}</p>
                    </div>
                )}

                {document && isUpdate && document.estado === 'RECHAZADO' && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Documento rechazado</AlertTitle>
                        <AlertDescription>
                            {document.comentario || 'Por favor, revise el documento y vuelva a subirlo.'}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="file">
                            {isUpdate ? 'Actualizar archivo' : 'Seleccionar archivo'}
                            {!isUpdate && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        />
                        {file && (
                            <p className="text-sm text-muted-foreground">
                                Archivo seleccionado: {file.name} ({Math.round(file.size / 1024)} KB)
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comentario">Comentario (opcional)</Label>
                        <Textarea
                            id="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Añada información adicional sobre este documento"
                            rows={3}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-destructive">{error}</div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button onClick={handleUpload} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isUpdate ? 'Actualizando...' : 'Subiendo...'}
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                {isUpdate ? 'Actualizar' : 'Subir'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}