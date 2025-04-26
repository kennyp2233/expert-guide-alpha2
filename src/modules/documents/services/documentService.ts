// src/modules/documents/services/documentService.ts
import { apiGet, apiPost, apiUpload } from '@/lib/api';
import {
    Document,
    DocumentType,
    CreateDocumentRequest,
    CreateDocumentResponse,
    UploadDocumentResponse,
    ReviewDocumentRequest,
    ReviewDocumentResponse
} from '@/types/document';

export const documentService = {
    /**
     * Obtiene los tipos de documentos disponibles
     */
    getDocumentTypes: async (): Promise<DocumentType[]> => {
        return await apiGet<DocumentType[]>('/documents/types');
    },

    /**
     * Crea un nuevo documento
     */
    createDocument: async (data: CreateDocumentRequest): Promise<CreateDocumentResponse> => {
        return await apiPost<CreateDocumentResponse>('/documents', data);
    },

    /**
     * Sube un archivo para un documento
     */
    uploadDocumentFile: async (documentId: string, file: File): Promise<UploadDocumentResponse> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id_documento', documentId);

        return await apiUpload<UploadDocumentResponse>('/documents/upload', formData);
    },

    /**
     * Obtiene documentos pendientes de revisión (solo admin)
     */
    getPendingDocuments: async (): Promise<Document[]> => {
        return await apiGet<Document[]>('/documents/pending');
    },

    /**
     * Obtiene los documentos de una finca específica
     * Si no se proporciona farmId, obtiene los documentos de la finca del usuario actual
     */
    getFarmDocuments: async (farmId?: number): Promise<Document[]> => {
        const url = farmId ? `/documents/finca/${farmId}` : '/documents/finca';
        return await apiGet<Document[]>(url);
    },

    /**
     * Revisa un documento (aprobar/rechazar)
     */
    reviewDocument: async (data: ReviewDocumentRequest): Promise<ReviewDocumentResponse> => {
        return await apiPost<ReviewDocumentResponse>('/documents/review', data);
    }
};