// src/modules/documents/hooks/useDocuments.ts
import { useState, useEffect, useCallback } from 'react';
import { documentService } from '../services/documentService';
import { Document, DocumentType } from '@/types/document';
import { useToast } from '@/shared/hooks/useToast';

interface UseDocumentsProps {
    fincaId?: number;
    readOnly?: boolean;
}

export const useDocuments = ({ fincaId, readOnly = false }: UseDocumentsProps = {}) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');

    // For modals
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState<number | null>(null);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);

    const { toast } = useToast();

    // Calculate document statistics
    const calculateStats = useCallback(() => {
        return {
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
    }, [documents, documentTypes]);

    // Fetch documents and document types
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Load document types
            const typesData = await documentService.getDocumentTypes();
            setDocumentTypes(typesData);

            // Load documents
            let docsData: Document[];
            if (readOnly && fincaId) {
                docsData = await documentService.getFarmDocuments(fincaId);
            } else {
                docsData = await documentService.getMyDocuments();
            }
            setDocuments(docsData);
        } catch (error) {
            toast('Error loading documents', 'error');
            console.error('Error loading documents:', error);
        } finally {
            setLoading(false);
        }
    }, [fincaId, readOnly, toast]);

    // Initial data load
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Filter documents based on selected tab
    const getFilteredDocuments = useCallback(() => {
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

    // Handle document upload
    const handleUploadClick = useCallback((documentTypeId: number) => {
        setSelectedDocumentTypeId(documentTypeId);
        setUpdateMode(false);
        setUploadModalOpen(true);
    }, []);

    // Handle document view
    const handleViewDocument = useCallback((document: Document) => {
        setSelectedDocument(document);
        setPreviewModalOpen(true);
    }, []);

    // Handle document update
    const handleUpdateDocument = useCallback((document: Document) => {
        setSelectedDocument(document);
        setUpdateMode(true);
        setUploadModalOpen(true);
    }, []);

    // Handle upload success
    const handleDocumentUpload = useCallback(async () => {
        // Refresh documents
        await fetchData();

        // Close modal
        setUploadModalOpen(false);
        setSelectedDocumentTypeId(null);
        setSelectedDocument(null);
    }, [fetchData]);

    // Handle document review (approve/reject)
    const handleDocumentReview = useCallback(async (document: Document, approved: boolean, comentario?: string) => {
        try {
            await documentService.reviewDocument({
                id: document.id,
                estado: approved ? 'APROBADO' : 'RECHAZADO',
                comentario,
            });

            toast(
                approved ? 'Document approved successfully' : 'Document rejected successfully',
                'success'
            );

            // Reload documents
            await fetchData();
        } catch (error) {
            toast('Error processing document', 'error');
            console.error('Error reviewing document:', error);
        }
    }, [fetchData, toast]);

    // Close modals
    const closeUploadModal = useCallback(() => {
        setUploadModalOpen(false);
        setSelectedDocumentTypeId(null);
        setSelectedDocument(null);
    }, []);

    const closePreviewModal = useCallback(() => {
        setPreviewModalOpen(false);
        setSelectedDocument(null);
    }, []);

    return {
        // Data
        documents,
        documentTypes,
        loading,
        selectedTab,
        stats: calculateStats(),
        filteredDocuments: getFilteredDocuments(),

        // Modal states
        uploadModalOpen,
        selectedDocumentTypeId,
        selectedDocument,
        previewModalOpen,
        updateMode,

        // Actions
        setSelectedTab,
        handleUploadClick,
        handleViewDocument,
        handleUpdateDocument,
        handleDocumentUpload,
        handleDocumentReview,
        closeUploadModal,
        closePreviewModal,
        refreshData: fetchData
    };
};