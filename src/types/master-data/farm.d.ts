// src/types/farm.d.ts

export interface Farm {
    id: number;
    nombre_finca: string;
    tag: string;
    ruc_finca: string;
    tipo_documento?: string;
    genera_guias_certificadas?: boolean;
    i_general_telefono?: string;
    i_general_email?: string;
    i_general_ciudad?: string;
    i_general_provincia?: string;
    i_general_pais?: string;
    i_general_cod_sesa?: string;
    i_general_cod_pais?: string;
    a_nombre?: string;
    a_codigo?: string;
    a_direccion?: string;
    activo: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface FarmValidation {
    registroCompleto: boolean;
    camposFaltantes: string[];
    documentosFaltantes: string[];
    mensaje: string;
}

export interface FarmWithVerificationProgress extends Farm {
    progreso_verificacion: {
        total_documentos_requeridos: number;
        documentos_subidos: number;
        documentos_aprobados: number;
        documentos_rechazados: number;
        porcentaje_completado: number;
        porcentaje_aprobado: number;
    };
}

export interface FarmInVerification {
    finca: FarmWithVerificationProgress;
    usuario: {
        id: string;
        usuario: string;
        email: string;
        createdAt: string;
    };
    rol_pendiente: {
        id: string;
        id_usuario: string;
        id_rol: number;
        estado: string;
        metadata: {
            id_finca: number;
        };
    };
}

export interface FarmDocumentVerification {
    finca_id: number;
    documentos_completos: boolean;
    tipos_pendientes: DocumentType[];
    documentos_aprobados: Document[];
}