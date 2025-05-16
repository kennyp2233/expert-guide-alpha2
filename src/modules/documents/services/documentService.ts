// src/modules/documents/services/documentService.ts

import { apiGet, apiPost, apiPatch, apiUpload } from '@/lib/api';
import { Document, DocumentType, CreateDocumentRequest, CreateDocumentResponse, DocumentReviewRequest, DocumentReviewResponse } from '@/types/document';

export const documentService = {
    /**
     * Obtiene los tipos de documentos disponibles
     */
    getDocumentTypes: async (): Promise<DocumentType[]> => {
        return await apiGet<DocumentType[]>('/documents/types');
    },

    /**
     * Obtiene los documentos de la finca del usuario actual
     */
    getMyDocuments: async (): Promise<Document[]> => {
        return await apiGet<Document[]>('/documents/my-documents');
    },

    /**
     * Obtiene los documentos de una finca específica (solo admin)
     */
    getFarmDocuments: async (fincaId: number): Promise<Document[]> => {
        return await apiGet<Document[]>(`/documents/finca/${fincaId}`);
    },

    /**
     * Obtiene documentos pendientes de revisión (solo admin)
     */
    getPendingDocuments: async (): Promise<Document[]> => {
        return await apiGet<Document[]>('/documents/pending');
    },

    /**
     * Crea un nuevo registro de documento
     */
    createDocument: async (data: CreateDocumentRequest): Promise<CreateDocumentResponse> => {
        return await apiPost<CreateDocumentResponse>('/documents', data);
    },

    /**
     * Sube un archivo para un documento previamente creado
     */
    uploadDocumentFile: async (documentId: string, file: File): Promise<Document> => {
        const formData = new FormData();
        formData.append('id_documento', documentId);
        formData.append('file', file);

        return await apiUpload<Document>('/documents/upload', formData);
    },

    /**
     * Actualiza un documento existente
     */
    updateDocument: async (documentId: string, file?: File, comentario?: string): Promise<Document> => {
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        }
        if (comentario) {
            formData.append('comentario', comentario);
        }

        return await apiUpload<Document>(`/documents/${documentId}`, formData);
    },

    /**
     * Revisa un documento (aprobar/rechazar) - solo admin
     */
    reviewDocument: async (data: DocumentReviewRequest): Promise<DocumentReviewResponse> => {
        return await apiPost<DocumentReviewResponse>('/documents/review', data);
    },

    /**
     * Obtiene un documento específico
     */
    getDocument: async (documentId: string): Promise<Document> => {
        return await apiGet<Document>(`/documents/${documentId}`);
    }
};