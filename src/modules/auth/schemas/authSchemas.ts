// src/modules/auth/schemas/authSchemas.ts
import * as yup from 'yup';

/**
 * Esquema de validación para el login
 */
export const loginSchema = yup.object({
    email: yup
        .string()
        .required('El email es requerido')
        .email('Email inválido'),
    password: yup
        .string()
        .required('La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
export type LoginFormValues = yup.InferType<typeof loginSchema>;

/**
 * Esquema de validación para el registro de clientes
 */
export const registerClientSchema = yup
    .object({
        username: yup
            .string()
            .required('El nombre de usuario es requerido'),
        nombre: yup
            .string()
            .required('El nombre de la empresa es requerido'),
        telefono: yup
            .string()
            .required('El teléfono es requerido'),
        email: yup
            .string()
            .required('El email es requerido')
            .email('Email inválido'),
        password: yup
            .string()
            .required('La contraseña es requerida')
            .min(6, 'La contraseña debe tener al menos 6 caracteres'),
        passwordConfirm: yup
            .string()
            .required('La confirmación de contraseña es requerida')
            .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
        ruc: yup.string().optional(),
        direccion: yup.string().optional(),
        ciudad: yup.string().optional(),
        pais: yup.string().optional(),
        terms: yup
            .boolean()
            .oneOf([true], 'Debes aceptar los términos y condiciones'),
    })
    .required();
export type RegisterClientFormValues = yup.InferType<typeof registerClientSchema>;

/**
 * Esquema de validación para el registro de fincas
 */
export const registerFarmSchema = yup
    .object({
        username: yup
            .string()
            .required('El nombre de usuario es requerido'),
        nombre_finca: yup
            .string()
            .required('El nombre de la finca es requerido'),
        tag: yup
            .string()
            .required('El código identificador es requerido'),
        email: yup
            .string()
            .required('El email es requerido')
            .email('Email inválido'),
        password: yup
            .string()
            .required('La contraseña es requerida')
            .min(6, 'La contraseña debe tener al menos 6 caracteres'),
        passwordConfirm: yup
            .string()
            .required('La confirmación de contraseña es requerida')
            .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
        ruc_finca: yup
            .string()
            .required('El RUC de la finca es requerido'),
        tipo_documento: yup
            .string()
            .oneOf(['RUC', 'CI', 'PASSPORT'], 'Tipo de documento inválido')
            .default('RUC'),
        terms: yup
            .boolean()
            .oneOf([true], 'Debes aceptar los términos y condiciones'),
    })
    .required();
export type RegisterFarmFormValues = yup.InferType<typeof registerFarmSchema>;

/**
 * Esquema para cambio de contraseña
 */
export const changePasswordSchema = yup
    .object({
        currentPassword: yup
            .string()
            .required('La contraseña actual es requerida'),
        newPassword: yup
            .string()
            .required('La nueva contraseña es requerida')
            .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
        confirmPassword: yup
            .string()
            .required('La confirmación de contraseña es requerida')
            .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
    })
    .required();
export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>;

/**
 * Esquema para solicitud de recuperación de contraseña
 */
export const forgotPasswordSchema = yup
    .object({
        email: yup
            .string()
            .required('El email es requerido')
            .email('Email inválido'),
    })
    .required();
export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;

/**
 * Esquema para restablecer la contraseña
 */
export const resetPasswordSchema = yup
    .object({
        password: yup
            .string()
            .required('La contraseña es requerida')
            .min(6, 'La contraseña debe tener al menos 6 caracteres'),
        confirmPassword: yup
            .string()
            .required('La confirmación de contraseña es requerida')
            .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
    })
    .required();
export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;
