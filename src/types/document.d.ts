// src/types/document.ts

/**
 * Representa un tipo de documento
 */
export interface DocumentType {
    id: number;
    nombre: string;
    descripcion: string;
    es_obligatorio: boolean;
}

/**
 * Representa un documento
 */
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

/**
 * Datos para crear un documento
 */
export interface CreateDocumentRequest {
    id_tipo_documento: number;
    comentario?: string;
}

/**
 * Datos para revisar un documento
 */
export interface DocumentReviewRequest {
    id: string;
    estado: 'APROBADO' | 'RECHAZADO';
    comentario?: string;
}