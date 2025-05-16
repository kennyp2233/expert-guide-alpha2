// src/modules/documents/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/documentService';
import { Document, DocumentType } from '@/types/document';
import { useToast } from '@/shared/hooks/useToast';

interface UseDocumentsProps {
    fincaId?: number;
    readOnly?: boolean;
}

/**
 * Hook para gestionar documentos de una finca
 */
export const useDocuments = ({ fincaId, readOnly = false }: UseDocumentsProps = {}) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const { toast } = useToast();

    // Calcular estadísticas de documentos
    const stats = {
        total: documentTypes.length,
        uploaded: documents.length,
        approved: documents.filter(d => d.estado === 'APROBADO').length,
        rejected: documents.filter(d => d.estado === 'RECHAZADO').length,
        pending: documents.filter(d => d.estado === 'PENDIENTE').length,
        required: documentTypes.filter(t => t.es_obligatorio).length,
        progress: documentTypes.length > 0
            ? Math.round((documents.length / documentTypes.length) * 100)
            : 0,
        completionProgress: documentTypes.length > 0
            ? Math.round((documents.filter(d => d.estado === 'APROBADO').length / documentTypes.length) * 100)
            : 0
    };

    // Obtener documentos según la pestaña seleccionada
    const filteredDocuments = useCallback(() => {
        switch (selectedTab) {
            case 'pending':
                return documents.filter(d => d.estado === 'PENDIENTE');
            case 'approved':
                return documents.filter(d => d.estado === 'APROBADO');
            case 'rejected':
                return documents.filter(d => d.estado === 'RECHAZADO');
            default:
                return documents;
        }
    }, [documents, selectedTab]);

    // Cargar datos de documentos
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Cargar tipos de documentos
            const typesData = await documentService.getDocumentTypes();
            setDocumentTypes(typesData);

            // Cargar documentos
            let docsData: Document[];
            if (readOnly && fincaId) {
                docsData = await documentService.getFarmDocuments(fincaId);
            } else {
                docsData = await documentService.getMyDocuments();
            }
            setDocuments(docsData);
        } catch (error) {
            toast('Error al cargar los documentos', 'error');
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    }, [fincaId, readOnly, toast]);

    // Cargar datos iniciales
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Abrir modal para subir un documento
    const openUploadModal = useCallback((typeId: number) => {
        setSelectedTypeId(typeId);
        setIsUpdateMode(false);
        setUploadOpen(true);
    }, []);

    // Abrir modal para actualizar un documento
    const openUpdateModal = useCallback((document: Document) => {
        setSelectedDocument(document);
        setSelectedTypeId(document.id_tipo_documento);
        setIsUpdateMode(true);
        setUploadOpen(true);
    }, []);

    // Abrir modal de previsualización
    const openPreviewModal = useCallback((document: Document) => {
        setSelectedDocument(document);
        setPreviewOpen(true);
    }, []);

    // Cerrar modales
    const closeUploadModal = useCallback(() => {
        setUploadOpen(false);
        setSelectedTypeId(null);
        setSelectedDocument(null);
        setIsUpdateMode(false);
    }, []);

    const closePreviewModal = useCallback(() => {
        setPreviewOpen(false);
        setSelectedDocument(null);
    }, []);

    // Manejar subida/actualización de documentos
    const handleDocumentUpload = useCallback(async (values: any, file: File) => {
        try {
            if (isUpdateMode && selectedDocument) {
                // Actualizar documento existente
                await documentService.updateDocument(selectedDocument.id, file, values.comentario);
                toast('Documento actualizado correctamente', 'success');
            } else if (selectedTypeId) {
                // Crear nuevo documento
                const createResponse = await documentService.createDocument({
                    id_tipo_documento: selectedTypeId,
                    comentario: values.comentario
                });
                await documentService.uploadDocumentFile(createResponse.documento.id, file);
                toast('Documento subido correctamente', 'success');
            }

            // Recargar documentos
            await fetchData();
            closeUploadModal();
        } catch (error) {
            toast('Error al procesar el documento', 'error');
            console.error('Error uploading document:', error);
            return false;
        }
        return true;
    }, [isUpdateMode, selectedDocument, selectedTypeId, toast, fetchData, closeUploadModal]);

    // Manejar revisión de documentos (aprobar/rechazar)
    const handleDocumentReview = useCallback(async (document: Document, approved: boolean, comentario?: string) => {
        try {
            await documentService.reviewDocument({
                id: document.id,
                estado: approved ? 'APROBADO' : 'RECHAZADO',
                comentario,
            });

            toast(
                approved ? 'Documento aprobado correctamente' : 'Documento rechazado correctamente',
                'success'
            );

            // Recargar documentos
            await fetchData();
            return true;
        } catch (error) {
            toast('Error al procesar el documento', 'error');
            console.error('Error reviewing document:', error);
            return false;
        }
    }, [fetchData, toast]);

    return {
        // Estado
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
        filteredDocuments: filteredDocuments(),

        // Acciones
        setSelectedTab,
        openUploadModal,
        openUpdateModal,
        openPreviewModal,
        closeUploadModal,
        closePreviewModal,
        handleDocumentUpload,
        handleDocumentReview,
        refreshData: fetchData
    };
};