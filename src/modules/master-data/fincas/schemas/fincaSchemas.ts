// src/modules/fincas/schemas/fincaSchemas.ts
import * as Yup from 'yup';

/**
 * Esquema para el formulario de datos de finca
 */
export const fincaFormSchema = Yup.object({
    nombre_finca: Yup.string()
        .required('El nombre de la finca es obligatorio')
        .min(3, 'El nombre debe tener al menos 3 caracteres'),

    tag: Yup.string()
        .required('El código de identificación es obligatorio')
        .min(2, 'El código debe tener al menos 2 caracteres'),

    ruc_finca: Yup.string()
        .required('El RUC es obligatorio')
        .min(10, 'El RUC debe tener al menos 10 dígitos')
        .max(13, 'El RUC no debe exceder los 13 dígitos'),

    tipo_documento: Yup.string()
        .oneOf(['RUC', 'CI', 'PASSPORT'], 'Tipo de documento no válido')
        .default('RUC'),

    genera_guias_certificadas: Yup.boolean()
        .default(false),

    // Información de contacto
    i_general_telefono: Yup.string()
        .nullable()
        .test(
            'phone-format',
            'Formato de teléfono inválido',
            (value) => !value || value.length >= 7
        ),

    i_general_email: Yup.string()
        .nullable()
        .email('Formato de email no válido'),

    i_general_ciudad: Yup.string()
        .nullable(),

    i_general_provincia: Yup.string()
        .nullable(),

    i_general_pais: Yup.string()
        .nullable(),

    i_general_cod_sesa: Yup.string()
        .nullable(),

    i_general_cod_pais: Yup.string()
        .nullable(),

    // Información adicional
    a_nombre: Yup.string()
        .nullable(),

    a_codigo: Yup.string()
        .nullable(),

    a_direccion: Yup.string()
        .nullable()
});

export type FincaFormValues = Yup.InferType<typeof fincaFormSchema>;

/**
 * Esquema para el formulario de verificación de finca
 */
export const fincaVerificationSchema = Yup.object({
    comentario: Yup.string()
        .max(500, 'El comentario no puede exceder los 500 caracteres')
        .nullable()
});

export type FincaVerificationValues = Yup.InferType<typeof fincaVerificationSchema>;