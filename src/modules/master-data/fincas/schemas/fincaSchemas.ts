// src/modules/master-data/fincas/schemas/fincaSchemas.ts
import * as Yup from 'yup';

/**
 * Schema for farm data form validation
 */
export const fincaFormSchema = Yup.object({
    nombre_finca: Yup.string()
        .required('Farm name is required')
        .min(3, 'Farm name must have at least 3 characters'),

    tag: Yup.string()
        .required('Tag/identifier is required')
        .min(1, 'Tag is required'),

    ruc_finca: Yup.string()
        .required('RUC is required')
        .min(10, 'RUC must have at least 10 digits'),

    tipo_documento: Yup.string()
        .optional(),

    genera_guias_certificadas: Yup.boolean()
        .optional(),

    // Contact information
    i_general_telefono: Yup.string()
        .min(7, 'Phone number must have at least 7 digits')
        .optional(),

    i_general_email: Yup.string()
        .email('Invalid email format')
        .optional(),

    i_general_ciudad: Yup.string()
        .min(2, 'City must have at least 2 characters')
        .optional(),

    i_general_provincia: Yup.string()
        .min(2, 'Province must have at least 2 characters')
        .optional(),

    i_general_pais: Yup.string()
        .min(2, 'Country must have at least 2 characters')
        .optional(),

    i_general_cod_sesa: Yup.string()
        .optional(),

    i_general_cod_pais: Yup.string()
        .optional(),

    // Additional information
    a_nombre: Yup.string()
        .optional(),

    a_codigo: Yup.string()
        .optional(),

    a_direccion: Yup.string()
        .optional()
});

export type FincaFormValues = Yup.InferType<typeof fincaFormSchema>;

/**
 * Schema for document upload form validation
 */
export const documentUploadSchema = Yup.object({
    file: Yup.mixed()
        .required('File is required')
        .test('fileSize', 'File is too large', (value: any) => {
            return value && value.size <= 5000000; // 5MB limit
        })
        .test('fileType', 'Unsupported file type', (value: any) => {
            return value && [
                'application/pdf',
                'image/jpeg',
                'image/png',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            ].includes(value.type);
        }),

    comentario: Yup.string()
        .optional()
});

export type DocumentUploadValues = Yup.InferType<typeof documentUploadSchema>;

/**
 * Schema for document review form validation
 */
export const documentReviewSchema = Yup.object({
    comentario: Yup.string()
        .when('estado', {
            is: 'RECHAZADO',
            then: (schema) => schema.required('A reason for rejection is required'),
            otherwise: (schema) => schema.optional()
        }),

    estado: Yup.string()
        .required('Status is required')
        .oneOf(['APROBADO', 'RECHAZADO'], 'Invalid status')
});

export type DocumentReviewValues = Yup.InferType<typeof documentReviewSchema>;