// src/modules/documents/schemas/documentSchemas.ts
import * as Yup from 'yup';

/**
 * Esquema para subida de documentos
 */
export const documentUploadSchema = Yup.object({
    file: Yup.mixed()
        .required('El archivo es obligatorio')
        .test(
            'fileFormat',
            'Formato no soportado. Se admiten PDF, JPG, PNG y documentos Word',
            (value) => {
                if (!value) return false;
                const file = value as File;
                const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                return validTypes.includes(file.type);
            }
        )
        .test(
            'fileSize',
            'El archivo es demasiado grande. Máximo 5MB permitido',
            (value) => {
                if (!value) return false;
                const file = value as File;
                const MAX_SIZE = 5 * 1024 * 1024; // 5MB
                return file.size <= MAX_SIZE;
            }
        ),
    comentario: Yup.string()
        .max(500, 'El comentario no puede exceder los 500 caracteres')
});

export type DocumentUploadValues = Yup.InferType<typeof documentUploadSchema>;

/**
 * Esquema para revisión de documentos
 */
export const documentReviewSchema = Yup.object({
    estado: Yup.string()
        .required('El estado es obligatorio')
        .oneOf(['APROBADO', 'RECHAZADO'], 'Estado no válido'),
    comentario: Yup.string()
        .when('estado', {
            is: 'RECHAZADO',
            then: (schema) => schema.required('Debe proporcionar un motivo para el rechazo'),
            otherwise: (schema) => schema
        })
        .max(500, 'El comentario no puede exceder los 500 caracteres')
});

export type DocumentReviewValues = Yup.InferType<typeof documentReviewSchema>;