// src/types/master-data/farm.d.ts

/**
 * Base farm entity
 */
export interface Farm {
    id: number;
    nombre_finca: string;
    tag: string;
    ruc_finca: string;
    tipo_documento?: string;
    genera_guias_certificadas?: boolean;

    // Contact information
    i_general_telefono?: string;
    i_general_email?: string;
    i_general_ciudad?: string;
    i_general_provincia?: string;
    i_general_pais?: string;
    i_general_cod_sesa?: string;
    i_general_cod_pais?: string;

    // Additional information
    a_nombre?: string;
    a_codigo?: string;
    a_direccion?: string;

    // Status
    activo: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Result of farm validation check
 */
export interface FarmValidation {
    registroCompleto: boolean;
    camposFaltantes: string[];
    documentosFaltantes: string[];
    mensaje: string;
}

/**
 * Farm with verification progress information
 */
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

/**
 * Farm with associated user in verification process
 */
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

/**
 * Result of farm document verification
 */
export interface FarmDocumentVerification {
    finca_id: number;
    documentos_completos: boolean;
    tipos_pendientes: Array<{
        id: number;
        nombre: string;
        descripcion: string;
        es_obligatorio: boolean;
    }>;
    documentos_aprobados: Array<{
        id: string;
        id_tipo_documento: number;
        estado: string;
        fecha_revision?: string;
    }>;
}