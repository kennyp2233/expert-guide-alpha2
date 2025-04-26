// src/modules/documents/services/documentService.ts
import { apiGet, apiPost, apiUpload } from '@/lib/api';

// Interfaces basadas en los formatos de respuesta proporcionados
export interface Farm {
    id: number;
    nombre_finca: string;
    tag: string;
    ruc_finca: string;
}

export interface DocumentType {
    id: number;
    nombre: string;
    descripcion: string;
    es_obligatorio: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Document {
    id: string;
    id_finca: number;
    id_tipo_documento: number;
    ruta_archivo?: string;
    nombre_archivo?: string;
    tamano_archivo?: number;
    tipo_mime?: string;
    estado: string; // 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
    comentario?: string;
    fecha_subida?: string;
    fecha_revision?: string;
    id_revisor?: string;
    finca?: Farm;
    tipoDocumento?: DocumentType;
    revisor?: {
        id: string;
        usuario: string;
        email: string;
    };
}

export interface CreateDocumentResponse {
    message: string;
    documento: Document;
}

export interface UploadDocumentResponse {
    message: string;
    documento: Document;
}

export interface ReviewDocumentResponse {
    message: string;
    documento: Document;
}

export interface CreateDocumentRequest {
    id_finca?: number; // opcional si el usuario es una finca
    id_tipo_documento: number;
    comentario?: string;
}

export interface ReviewDocumentRequest {
    id_documento: string;
    estado: 'APROBADO' | 'RECHAZADO';
    comentario?: string;
}

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