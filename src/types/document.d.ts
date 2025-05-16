// src/types/document.d.ts

export interface DocumentType {
    id: number;
    nombre: string;
    descripcion: string;
    es_obligatorio: boolean;
}

export interface Document {
    id: string;
    id_finca: number;
    id_tipo_documento: number;
    ruta_archivo?: string;
    nombre_archivo?: string;
    tamano_archivo?: number;
    tipo_mime?: string;
    estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
    comentario?: string;
    fecha_subida?: string;
    fecha_revision?: string;
    id_revisor?: string;
    tipoDocumento?: DocumentType;
    revisor?: {
        id: string;
        usuario: string;
    };
    finca?: {
        id: number;
        nombre_finca: string;
        tag: string;
        ruc_finca: string;
    };
}

export interface CreateDocumentRequest {
    id_tipo_documento: number;
    comentario?: string;
}

export interface CreateDocumentResponse {
    message: string;
    documento: Document;
}

export interface UploadDocumentRequest {
    id_documento: string;
    file: File;
}

export interface DocumentReviewRequest {
    id: string;
    estado: 'APROBADO' | 'RECHAZADO';
    comentario?: string;
}

export interface DocumentReviewResponse {
    message: string;
    documento: Document;
}