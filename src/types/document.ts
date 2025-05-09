// src/types/document.ts

import { Farm, User } from './user';

export interface DocumentType {
    id: number;
    nombre: string;
    descripcion: string;
    es_obligatorio: boolean;
    createdAt?: string;
    updatedAt?: string;
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
    finca?: Farm;
    tipoDocumento?: DocumentType;
    revisor?: {
        id: string;
        usuario: string;
        email: string;
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

export interface UploadDocumentResponse {
    message: string;
    documento: Document;
}

export interface ReviewDocumentRequest {
    id: string; // ID del documento
    estado: 'APROBADO' | 'RECHAZADO';
    comentario?: string;
}

export interface ReviewDocumentResponse {
    message: string;
    documento: Document;
}